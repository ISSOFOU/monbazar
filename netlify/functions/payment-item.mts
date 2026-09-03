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
  const rows = await db.sql`SELECT * FROM payments WHERE id = ${id}`;
  if (rows.length === 0) {
    return new Response('Not found', { status: 404 });
  }

  const payment = rows[0];
  if (payment.buyer_id !== user.id && payment.seller_id !== user.id) {
    return new Response(JSON.stringify({ error: 'Accès refusé.' }), {
      status: 403,
      headers: { 'content-type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(payment), {
    headers: { 'content-type': 'application/json' },
  });
};

export const config: Config = {
  path: '/api/payments/:id',
};
