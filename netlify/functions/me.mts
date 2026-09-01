import type { Config } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import { getUserFromRequest } from '../lib/auth';

export default async (req: Request) => {
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

  return new Response(JSON.stringify(user), {
    headers: { 'content-type': 'application/json' },
  });
};

export const config: Config = {
  path: '/api/me',
};
