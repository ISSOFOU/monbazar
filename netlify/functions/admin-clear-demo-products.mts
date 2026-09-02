import type { Config } from '@netlify/functions';
import { getDatabase } from '@netlify/database';

// Temporary one-off cleanup: removes the seed/demo listings inserted before
// the app had real accounts. Delete this file after running it once.
export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  const db = getDatabase();
  const rows = await db.sql`DELETE FROM products WHERE seller_id LIKE 'seller-%' RETURNING id`;
  return new Response(JSON.stringify({ deleted: rows.length }), {
    headers: { 'content-type': 'application/json' },
  });
};

export const config: Config = {
  path: '/api/admin/clear-demo-products',
};
