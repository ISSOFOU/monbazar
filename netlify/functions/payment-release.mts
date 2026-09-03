import type { Config, Context } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import { getUserFromRequest } from '../lib/auth';

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') {
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
  if (payment.buyer_id !== user.id) {
    return new Response(JSON.stringify({ error: 'Seul l\'acheteur peut confirmer la réception.' }), {
      status: 403,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (payment.status !== 'held') {
    return new Response(JSON.stringify({ error: 'Ce paiement ne peut pas être libéré dans son état actuel.' }), {
      status: 409,
      headers: { 'content-type': 'application/json' },
    });
  }

  await db.sql`
    UPDATE payments SET status = 'released', released_at = NOW() WHERE id = ${id}
  `;
  await db.sql`
    UPDATE users SET sales_count = sales_count + 1 WHERE id = ${payment.seller_id}
  `;
  await db.sql`
    UPDATE users SET purchases_count = purchases_count + 1 WHERE id = ${payment.buyer_id}
  `;

  return new Response(JSON.stringify({ status: 'released' }), {
    headers: { 'content-type': 'application/json' },
  });
};

export const config: Config = {
  path: '/api/payments/:id/release',
};
