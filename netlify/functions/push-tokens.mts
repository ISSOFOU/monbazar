import type { Config } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import { getUserFromRequest } from '../lib/auth';

export default async (req: Request) => {
  const db = getDatabase();
  const user = await getUserFromRequest(req, db);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non authentifié' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (req.method === 'POST') {
    const body = await req.json().catch(() => ({}));
    const token = typeof body.token === 'string' ? body.token.trim() : '';
    if (!token) {
      return new Response(JSON.stringify({ error: 'Token manquant.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    await db.sql`
      INSERT INTO push_tokens (token, user_id) VALUES (${token}, ${user.id})
      ON CONFLICT (token) DO UPDATE SET user_id = ${user.id}
    `;

    return new Response(JSON.stringify({ ok: true }), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (req.method === 'DELETE') {
    const body = await req.json().catch(() => ({}));
    const token = typeof body.token === 'string' ? body.token.trim() : '';
    if (token) {
      await db.sql`DELETE FROM push_tokens WHERE token = ${token} AND user_id = ${user.id}`;
    }
    return new Response(null, { status: 204 });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config: Config = {
  path: '/api/push-tokens',
};
