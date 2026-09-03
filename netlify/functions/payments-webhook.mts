import type { Config } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import { verifyFedapayWebhookSignature } from '../lib/fedapay';

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get('fedapay-signature') || req.headers.get('x-fedapay-signature');

  const valid = await verifyFedapayWebhookSignature(rawBody, signature);
  if (!valid) {
    return new Response('Invalid signature', { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const transaction = event.entity ?? event.data ?? {};
  const transactionId = String(transaction.id ?? '');
  if (!transactionId) {
    return new Response('Missing transaction id', { status: 400 });
  }

  const db = getDatabase();

  if (event.name === 'transaction.approved') {
    await db.sql`
      UPDATE payments SET status = 'held', paid_at = NOW()
      WHERE fedapay_transaction_id = ${transactionId} AND status = 'pending'
    `;

    const rows = await db.sql`SELECT product_id FROM payments WHERE fedapay_transaction_id = ${transactionId}`;
    if (rows.length > 0) {
      await db.sql`
        UPDATE products SET data = data || '{"isSold":true}'::jsonb, is_sold = true
        WHERE id = ${rows[0].product_id}
      `;
    }
  } else if (event.name === 'transaction.declined' || event.name === 'transaction.canceled') {
    await db.sql`
      UPDATE payments SET status = 'failed'
      WHERE fedapay_transaction_id = ${transactionId} AND status = 'pending'
    `;
  }

  return new Response('ok', { status: 200 });
};

export const config: Config = {
  path: '/api/payments/webhook',
};
