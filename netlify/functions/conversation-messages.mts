import type { Config, Context } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import { getUserFromRequest } from '../lib/auth';
import { notifyUser } from '../lib/push';

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
  const body = await req.json();
  const text = (body.text || '').trim();
  if (!text) {
    return new Response(JSON.stringify({ error: 'Message vide.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

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
  const now = new Date().toISOString();
  const message = {
    id: `msg-${Date.now()}`,
    senderId: user.id,
    text,
    timestamp: now,
  };

  const updatedData = {
    ...conv.data,
    lastMessage: text,
    lastMessageTime: now,
    messages: [...conv.data.messages, message],
  };

  if (isBuyer) {
    await db.sql`
      UPDATE conversations
      SET data = ${JSON.stringify(updatedData)}::jsonb, seller_unread = true, buyer_unread = false, updated_at = NOW()
      WHERE id = ${id}
    `;
  } else {
    await db.sql`
      UPDATE conversations
      SET data = ${JSON.stringify(updatedData)}::jsonb, buyer_unread = true, seller_unread = false, updated_at = NOW()
      WHERE id = ${id}
    `;
  }

  const recipientId = isBuyer ? conv.seller_id : conv.buyer_id;
  notifyUser(
    recipientId,
    user.name,
    text,
    { type: 'new_message', conversationId: id },
    db
  ).catch(() => {});

  return new Response(JSON.stringify({ ...updatedData, unread: false }), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  });
};

export const config: Config = {
  path: '/api/conversations/:id/messages',
};
