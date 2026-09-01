import type { Config } from '@netlify/functions';

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

  if (!/^\+\d{8,15}$/.test(phone)) {
    return new Response(JSON.stringify({ error: 'Numéro invalide. Utilise le format +229XXXXXXXX.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

  const res = await fetch(
    `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/Verifications`,
    {
      method: 'POST',
      headers: {
        authorization: `Basic ${auth}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: phone, Channel: 'sms' }),
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
