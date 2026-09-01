import type { Config } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import { rowToUser } from '../lib/auth';

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
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

  const db = getDatabase();

  const otpRows = await db.sql`SELECT * FROM otp_codes WHERE phone = ${phone}`;
  if (otpRows.length === 0) {
    return new Response(JSON.stringify({ error: "Aucun code demandé pour ce numéro." }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const otp = otpRows[0];

  if (new Date(otp.expires_at).getTime() < Date.now()) {
    return new Response(JSON.stringify({ error: 'Code expiré, redemande-en un.' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (otp.attempts >= 5) {
    return new Response(JSON.stringify({ error: 'Trop de tentatives, redemande un code.' }), {
      status: 429,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (otp.code !== code) {
    await db.sql`UPDATE otp_codes SET attempts = attempts + 1 WHERE phone = ${phone}`;
    return new Response(JSON.stringify({ error: 'Code invalide.' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  await db.sql`DELETE FROM otp_codes WHERE phone = ${phone}`;

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
