import type { Config, Context } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import { getUserFromRequest } from '../lib/auth';

export default async (req: Request, context: Context) => {
  const db = getDatabase();
  const id = context.params.id;

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  const user = await getUserFromRequest(req, db);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Connecte-toi pour effectuer cette action.' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (req.method === 'PATCH') {
    const patch = await req.json();
    const patchJson = JSON.stringify(patch);

    const rows = await db.sql`
      UPDATE products
      SET data = data || ${patchJson}::jsonb,
          is_sold = COALESCE((${patchJson}::jsonb ->> 'isSold')::boolean, is_sold)
      WHERE id = ${id}
      RETURNING data
    `;

    if (rows.length === 0) {
      return new Response('Not found', { status: 404 });
    }

    return new Response(JSON.stringify(rows[0].data), {
      headers: { 'content-type': 'application/json' },
    });
  }

  if (req.method === 'DELETE') {
    const rows = await db.sql`DELETE FROM products WHERE id = ${id} AND seller_id = ${user.id} RETURNING id`;
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "Tu ne peux supprimer que tes propres annonces." }), {
        status: 403,
        headers: { 'content-type': 'application/json' },
      });
    }
    return new Response(null, { status: 204 });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config: Config = {
  path: '/api/products/:id',
};
