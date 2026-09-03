import type { Config } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import { getUserFromRequest, getUserById, userToSeller } from '../lib/auth';

export default async (req: Request) => {
  const db = getDatabase();
  const user = await getUserFromRequest(req, db);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Connecte-toi pour voir tes messages.' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (req.method === 'GET') {
    const rows = await db.sql`
      SELECT data, buyer_id, seller_id, buyer_unread, seller_unread
      FROM conversations
      WHERE buyer_id = ${user.id} OR seller_id = ${user.id}
      ORDER BY updated_at DESC
    `;

    const conversations = rows.map((r: any) => ({
      ...r.data,
      unread: r.buyer_id === user.id ? r.buyer_unread : r.seller_unread,
    }));

    return new Response(JSON.stringify(conversations), {
      headers: { 'content-type': 'application/json' },
    });
  }

  if (req.method === 'POST') {
    const body = await req.json();
    const { productId, productTitle, productPrice, productImage, sellerId, text, isOffer, offerAmount } = body;

    if (!sellerId || !text) {
      return new Response(JSON.stringify({ error: 'Vendeur et message requis.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    if (sellerId === user.id) {
      return new Response(JSON.stringify({ error: "C'est ta propre annonce." }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const now = new Date().toISOString();
    const message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      text,
      timestamp: now,
      ...(isOffer ? { isOffer: true, offerAmount, offerStatus: 'pending' } : {}),
    };

    const existing = await db.sql`
      SELECT id, data FROM conversations WHERE buyer_id = ${user.id} AND product_id = ${productId ?? null}
    `;

    if (existing.length > 0) {
      const conv = existing[0];
      const updatedData = {
        ...conv.data,
        lastMessage: text,
        lastMessageTime: now,
        messages: [...conv.data.messages, message],
      };

      await db.sql`
        UPDATE conversations
        SET data = ${JSON.stringify(updatedData)}::jsonb,
            seller_unread = true,
            buyer_unread = false,
            updated_at = NOW()
        WHERE id = ${conv.id}
      `;

      return new Response(JSON.stringify({ ...updatedData, unread: false }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      });
    }

    const sellerUser = await getUserById(sellerId, db);
    if (!sellerUser) {
      return new Response(JSON.stringify({ error: 'Vendeur introuvable.' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    const id = `conv-${Date.now()}`;
    const data = {
      id,
      productId: productId ?? null,
      productTitle,
      productPrice,
      productImage,
      buyerId: user.id,
      sellerId,
      buyer: userToSeller(user),
      seller: userToSeller(sellerUser),
      lastMessage: text,
      lastMessageTime: "À l'instant",
      messages: [message],
    };

    await db.sql`
      INSERT INTO conversations (id, product_id, buyer_id, seller_id, buyer_unread, seller_unread, data)
      VALUES (${id}, ${productId ?? null}, ${user.id}, ${sellerId}, false, true, ${JSON.stringify(data)}::jsonb)
    `;

    return new Response(JSON.stringify({ ...data, unread: false }), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config: Config = {
  path: '/api/conversations',
};
