import type { Config } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import type { Product } from '../../src/types';
import { getUserFromRequest } from '../lib/auth';
import { createFedapayTransaction, isFedapayConfigured } from '../lib/fedapay';

const DELIVERY_FEES: Record<string, number> = { zem: 1000, pickup: 0 };
const PROTECTION_FEE = 500;

export default async (req: Request) => {
  const db = getDatabase();
  const user = await getUserFromRequest(req, db);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Connecte-toi pour continuer.' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (req.method === 'GET') {
    const url = new URL(req.url);
    const productId = url.searchParams.get('productId');

    const rows = productId
      ? await db.sql`
          SELECT * FROM payments
          WHERE product_id = ${productId} AND (buyer_id = ${user.id} OR seller_id = ${user.id})
          ORDER BY created_at DESC LIMIT 1
        `
      : await db.sql`
          SELECT * FROM payments WHERE buyer_id = ${user.id} OR seller_id = ${user.id}
          ORDER BY created_at DESC
        `;

    return new Response(JSON.stringify(productId ? rows[0] ?? null : rows), {
      headers: { 'content-type': 'application/json' },
    });
  }

  if (req.method === 'POST') {
    if (!isFedapayConfigured()) {
      return new Response(
        JSON.stringify({ error: "Le paiement Mobile Money n'est pas encore configuré sur ce site." }),
        { status: 503, headers: { 'content-type': 'application/json' } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { productId, deliveryMethod, deliveryAddress } = body;

    if (!productId || !DELIVERY_FEES.hasOwnProperty(deliveryMethod) || !deliveryAddress) {
      return new Response(JSON.stringify({ error: 'Informations de livraison manquantes.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const productRows = await db.sql`SELECT data, is_sold, seller_id FROM products WHERE id = ${productId}`;
    if (productRows.length === 0) {
      return new Response(JSON.stringify({ error: 'Article introuvable.' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    const product = productRows[0].data as Product;
    if (productRows[0].is_sold) {
      return new Response(JSON.stringify({ error: 'Cet article a déjà été vendu.' }), {
        status: 409,
        headers: { 'content-type': 'application/json' },
      });
    }
    if (productRows[0].seller_id === user.id) {
      return new Response(JSON.stringify({ error: 'Tu ne peux pas acheter ta propre annonce.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const deliveryFee = DELIVERY_FEES[deliveryMethod];
    const totalAmount = product.price + deliveryFee + PROTECTION_FEE;
    const paymentId = `pay-${Date.now()}`;

    await db.sql`
      INSERT INTO payments (id, product_id, buyer_id, seller_id, amount, delivery_fee, protection_fee, total_amount, delivery_method, delivery_address, status)
      VALUES (${paymentId}, ${productId}, ${user.id}, ${productRows[0].seller_id}, ${product.price}, ${deliveryFee}, ${PROTECTION_FEE}, ${totalAmount}, ${deliveryMethod}, ${deliveryAddress}, 'pending')
    `;

    const siteUrl = process.env.URL || 'https://mon-bazar-benin.netlify.app';
    const [firstname, ...rest] = user.name.trim().split(' ');

    try {
      const { transactionId, checkoutUrl } = await createFedapayTransaction({
        amount: totalAmount,
        description: `Achat "${product.title}" sur Mon Bazar`,
        callbackUrl: `${siteUrl}/?payment_id=${paymentId}`,
        customer: {
          firstname: firstname || user.name,
          lastname: rest.join(' ') || '.',
          phoneNumber: user.phone.replace(/^\+229/, ''),
        },
      });

      await db.sql`UPDATE payments SET fedapay_transaction_id = ${transactionId} WHERE id = ${paymentId}`;

      return new Response(JSON.stringify({ paymentId, checkoutUrl }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      });
    } catch (err) {
      await db.sql`UPDATE payments SET status = 'failed' WHERE id = ${paymentId}`;
      return new Response(JSON.stringify({ error: "Impossible de démarrer le paiement Fedapay." }), {
        status: 502,
        headers: { 'content-type': 'application/json' },
      });
    }
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config: Config = {
  path: '/api/payments',
};
