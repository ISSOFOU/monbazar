import type { Config } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import { rowToUser } from '../lib/auth';

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
    return new Response(
      JSON.stringify({
        error: "L'envoi de SMS n'est pas encore configuré sur ce site (clés Twilio manquantes).",
      }),
      { status: 501, headers: { 'content-type': 'application/json' } },
    );
  }

  const body = await req.json().catch(() => ({}));
  const phone = (body.phone || '').trim();
  const code = (body.code || '').trim();
  const name = (body.name || '').trim();

  if (!phone || !code) {
    return new Response(JSON.stringify({ error: 'Numéro et code requis.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

  const checkRes = await fetch(
    `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/VerificationCheck`,
    {
      method: 'POST',
      headers: {
        authorization: `Basic ${auth}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: phone, Code: code }),
    },
  );

  const checkData = await checkRes.json().catch(() => ({}));

  if (!checkRes.ok || checkData.status !== 'approved') {
    return new Response(JSON.stringify({ error: 'Code invalide ou expiré.' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  const db = getDatabase();
  const existing = await db.sql`SELECT * FROM users WHERE phone = ${phone}`;

  let userRow;
  if (existing.length > 0) {
    userRow = existing[0];
  } else {
    const id = `user-${Date.now()}`;
    const memberSince = String(new Date().getFullYear());
    const inserted = await db.sql`
      INSERT INTO users (id, phone, name, member_since)
      VALUES (${id}, ${phone}, ${name || 'Nouveau vendeur'}, ${memberSince})
      RETURNING *
    `;
    userRow = inserted[0];
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  await db.sql`
    INSERT INTO sessions (token, user_id, expires_at)
    VALUES (${token}, ${userRow.id}, ${expiresAt})
  `;

  return new Response(JSON.stringify({ token, user: rowToUser(userRow) }), {
    headers: { 'content-type': 'application/json' },
  });
};

export const config: Config = {
  path: '/api/auth/verify-otp',
};
