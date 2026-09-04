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

  if (req.method === 'GET') {
    const rows = await db.sql`SELECT category FROM interest_categories WHERE user_id = ${user.id}`;
    return new Response(JSON.stringify(rows.map((r: { category: string }) => r.category)), {
      headers: { 'content-type': 'application/json' },
    });
  }

  if (req.method === 'PUT') {
    const body = await req.json().catch(() => ({}));
    const categories: string[] = Array.isArray(body.categories)
      ? body.categories.filter((c: unknown) => typeof c === 'string').slice(0, 20)
      : [];

    await db.sql`DELETE FROM interest_categories WHERE user_id = ${user.id}`;
    for (const category of categories) {
      await db.sql`
        INSERT INTO interest_categories (user_id, category) VALUES (${user.id}, ${category})
        ON CONFLICT DO NOTHING
      `;
    }

    return new Response(JSON.stringify(categories), {
      headers: { 'content-type': 'application/json' },
    });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config: Config = {
  path: '/api/interests',
};
