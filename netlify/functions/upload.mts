import type { Config } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { getDatabase } from '@netlify/database';
import { getUserFromRequest } from '../lib/auth';

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export default async (req: Request) => {
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

  const body = await req.json().catch(() => null);
  const dataUrl: string | undefined = body?.dataUrl;

  if (!dataUrl || !dataUrl.startsWith('data:')) {
    return new Response(JSON.stringify({ error: 'Image manquante ou invalide.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    return new Response(JSON.stringify({ error: 'Format de données image invalide.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const [, contentType, base64] = match;
  const ext = ALLOWED_TYPES[contentType];
  if (!ext) {
    return new Response(JSON.stringify({ error: 'Type de fichier non supporté (JPEG, PNG ou WebP uniquement).' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const buffer = Buffer.from(base64, 'base64');
  if (buffer.byteLength > 5 * 1024 * 1024) {
    return new Response(JSON.stringify({ error: 'Image trop lourde (5 Mo max).' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const key = `${user.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const store = getStore('product-images');
  await store.set(key, buffer, { metadata: { contentType } });

  return new Response(JSON.stringify({ url: `/api/images/${key}` }), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  });
};

export const config: Config = {
  path: '/api/upload',
};
