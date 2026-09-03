import type { Config, Context } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import { getUserFromRequest } from '../lib/auth';

export default async (req: Request, context: Context) => {
  const db = getDatabase();
  const targetId = context.params.userId;

  if (!targetId) {
    return new Response('Missing userId', { status: 400 });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

  if (req.method === 'GET') {
    const user = await getUserFromRequest(req, db);
    const countRows = await db.sql`SELECT COUNT(*)::int AS count FROM follows WHERE followed_id = ${targetId}`;
    const followersCount = countRows[0]?.count ?? 0;

    let isFollowing = false;
    if (user) {
      const rows = await db.sql`
        SELECT 1 FROM follows WHERE follower_id = ${user.id} AND followed_id = ${targetId}
      `;
      isFollowing = rows.length > 0;
    }

    return json({ followersCount, isFollowing });
  }

  const user = await getUserFromRequest(req, db);
  if (!user) {
    return json({ error: 'Connecte-toi pour effectuer cette action.' }, 401);
  }

  if (targetId === user.id) {
    return json({ error: 'Tu ne peux pas te suivre toi-même.' }, 400);
  }

  if (req.method === 'POST') {
    await db.sql`
      INSERT INTO follows (follower_id, followed_id)
      VALUES (${user.id}, ${targetId})
      ON CONFLICT DO NOTHING
    `;
    const countRows = await db.sql`SELECT COUNT(*)::int AS count FROM follows WHERE followed_id = ${targetId}`;
    return json({ isFollowing: true, followersCount: countRows[0]?.count ?? 0 });
  }

  if (req.method === 'DELETE') {
    await db.sql`DELETE FROM follows WHERE follower_id = ${user.id} AND followed_id = ${targetId}`;
    const countRows = await db.sql`SELECT COUNT(*)::int AS count FROM follows WHERE followed_id = ${targetId}`;
    return json({ isFollowing: false, followersCount: countRows[0]?.count ?? 0 });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config: Config = {
  path: '/api/follows/:userId',
};
