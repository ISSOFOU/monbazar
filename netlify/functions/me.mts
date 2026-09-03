import type { Config } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import { getUserFromRequest, rowToUser } from '../lib/auth';

export default async (req: Request) => {
  const db = getDatabase();
  const user = await getUserFromRequest(req, db);

  if (!user) {
    return new Response(JSON.stringify({ error: 'Non authentifié' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (req.method === 'GET') {
    return new Response(JSON.stringify(user), {
      headers: { 'content-type': 'application/json' },
    });
  }

  if (req.method === 'PATCH') {
    const body = await req.json().catch(() => ({}));
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 60) : undefined;
    const avatar = typeof body.avatar === 'string' ? body.avatar : undefined;
    const city = typeof body.city === 'string' ? body.city.trim().slice(0, 80) : undefined;
    const bio = typeof body.bio === 'string' ? body.bio.trim().slice(0, 150) : undefined;

    const rows = await db.sql`
      UPDATE users
      SET name = COALESCE(${name ?? null}, name),
          avatar = COALESCE(${avatar ?? null}, avatar),
          city = COALESCE(${city ?? null}, city),
          bio = COALESCE(${bio ?? null}, bio)
      WHERE id = ${user.id}
      RETURNING *
    `;

    return new Response(JSON.stringify(rowToUser(rows[0])), {
      headers: { 'content-type': 'application/json' },
    });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config: Config = {
  path: '/api/me',
};
