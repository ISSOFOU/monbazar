import type { getDatabase } from '@netlify/database';

type Db = ReturnType<typeof getDatabase>;

interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

// Sends push notifications via Expo's push service (https://exp.host).
// Expo batches delivery to Apple/Google's own push services under the hood.
async function sendExpoPush(messages: PushMessage[]): Promise<void> {
  if (messages.length === 0) return;
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(messages),
  }).catch(() => {});
}

async function tokensForUser(userId: string, db: Db): Promise<string[]> {
  const rows = await db.sql`SELECT token FROM push_tokens WHERE user_id = ${userId}`;
  return rows.map((r: { token: string }) => r.token);
}

export async function notifyUser(
  userId: string,
  title: string,
  body: string,
  data: Record<string, unknown>,
  db: Db
): Promise<void> {
  const tokens = await tokensForUser(userId, db);
  await sendExpoPush(tokens.map((to) => ({ to, title, body, data })));
}

export async function notifyUsers(
  userIds: string[],
  title: string,
  body: string,
  data: Record<string, unknown>,
  db: Db
): Promise<void> {
  if (userIds.length === 0) return;
  const rows = await db.sql`SELECT token FROM push_tokens WHERE user_id = ANY(${userIds})`;
  const tokens = rows.map((r: { token: string }) => r.token);
  await sendExpoPush(tokens.map((to) => ({ to, title, body, data })));
}
