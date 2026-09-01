import type { Config } from '@netlify/functions';
import { getDatabase } from '@netlify/database';

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    return new Response(
      JSON.stringify({
        error: "L'envoi de SMS n'est pas encore configuré sur ce site (clés Twilio manquantes).",
      }),
      { status: 501, headers: { 'content-type': 'application/json' } },
    );
  }

  const body = await req.json().catch(() => ({}));
  const phone = (body.phone || '').trim();

  if (!/^\+\d{8,15}$/.test(phone)) {
    return new Response(JSON.stringify({ error: 'Numéro invalide. Utilise le format +229XXXXXXXX.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const db = getDatabase();
  await db.sql`
    INSERT INTO otp_codes (phone, code, attempts, expires_at)
    VALUES (${phone}, ${code}, 0, ${expiresAt})
    ON CONFLICT (phone) DO UPDATE SET code = ${code}, attempts = 0, expires_at = ${expiresAt}
  `;

  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        authorization: `Basic ${auth}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: phone,
        From: TWILIO_FROM_NUMBER,
        Body: `Mon Bazar : votre code de connexion est ${code}. Valable 10 minutes.`,
      }),
    },
  );

  if (!res.ok) {
    const errText = await res.text();
    return new Response(JSON.stringify({ error: "Échec de l'envoi du SMS.", detail: errText }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ sent: true }), {
    headers: { 'content-type': 'application/json' },
  });
};

export const config: Config = {
  path: '/api/auth/request-otp',
};
