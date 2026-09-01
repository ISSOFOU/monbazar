import type { Config } from '@netlify/functions';

export default async () => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;
  return new Response(
    JSON.stringify({
      hasAccountSid: !!TWILIO_ACCOUNT_SID,
      hasAuthToken: !!TWILIO_AUTH_TOKEN,
      hasFromNumber: !!TWILIO_FROM_NUMBER,
    }),
    { headers: { 'content-type': 'application/json' } },
  );
};

export const config: Config = {
  path: '/api/debug-env',
};
