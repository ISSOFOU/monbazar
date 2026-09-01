import type { Config, Context } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import type { Product } from '../../src/types';

export default async (req: Request, context: Context) => {
  const db = getDatabase();
  const id = context.params.id;

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  if (req.method === 'PATCH') {
    const patch = await req.json();
    const rows = await db.sql`SELECT data FROM products WHERE id = ${id}`;
    if (rows.length === 0) {
      return new Response('Not found', { status: 404 });
    }

    const updated: Product = { ...(rows[0].data as Product), ...patch };

    await db.sql`
      UPDATE products
      SET data = ${JSON.stringify(updated)}::jsonb,
          is_sold = ${updated.isSold ?? false}
      WHERE id = ${id}
    `;

    return new Response(JSON.stringify(updated), {
      headers: { 'content-type': 'application/json' },
    });
  }

  if (req.method === 'DELETE') {
    await db.sql`DELETE FROM products WHERE id = ${id}`;
    return new Response(null, { status: 204 });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config: Config = {
  path: '/api/products/:id',
};
