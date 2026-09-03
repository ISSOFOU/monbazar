import type { Config, Context } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import { getUserFromRequest } from '../lib/auth';

export default async (req: Request, context: Context) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const db = getDatabase();
  const user = await getUserFromRequest(req, db);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non authentifié' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  const id = context.params.id;
  const rows = await db.sql`SELECT data, buyer_id, seller_id FROM conversations WHERE id = ${id}`;
  if (rows.length === 0) {
    return new Response('Not found', { status: 404 });
  }

  const conv = rows[0];
  if (conv.buyer_id !== user.id && conv.seller_id !== user.id) {
    return new Response(JSON.stringify({ error: 'Accès refusé.' }), {
      status: 403,
      headers: { 'content-type': 'application/json' },
    });
  }

  const isBuyer = conv.buyer_id === user.id;
  if (isBuyer) {
    await db.sql`UPDATE conversations SET buyer_unread = false WHERE id = ${id}`;
  } else {
    await db.sql`UPDATE conversations SET seller_unread = false WHERE id = ${id}`;
  }

  return new Response(JSON.stringify({ ...conv.data, unread: false }), {
    headers: { 'content-type': 'application/json' },
  });
};

export const config: Config = {
  path: '/api/conversations/:id',
};
