import type { Config } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import { getUserFromRequest } from '../lib/auth';

const VALID_TARGET_TYPES = ['product', 'user'];
const VALID_REASONS = ['contrefacon', 'arnaque', 'contenu_interdit', 'spam', 'autre'];

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const db = getDatabase();
  const user = await getUserFromRequest(req, db);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Connecte-toi pour signaler un contenu.' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  const body = await req.json().catch(() => ({}));
  const targetType = typeof body.targetType === 'string' ? body.targetType : '';
  const targetId = typeof body.targetId === 'string' ? body.targetId : '';
  const reason = typeof body.reason === 'string' ? body.reason : '';
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 500) : null;

  if (!VALID_TARGET_TYPES.includes(targetType) || !targetId || !VALID_REASONS.includes(reason)) {
    return new Response(JSON.stringify({ error: 'Signalement invalide.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const id = `report-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await db.sql`
    INSERT INTO reports (id, reporter_id, target_type, target_id, reason, message)
    VALUES (${id}, ${user.id}, ${targetType}, ${targetId}, ${reason}, ${message})
  `;

  return new Response(JSON.stringify({ id, status: 'open' }), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  });
};

export const config: Config = {
  path: '/api/reports',
};
