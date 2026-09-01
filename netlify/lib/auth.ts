import type { getDatabase } from '@netlify/database';

export interface AuthUser {
  id: string;
  phone: string;
  name: string;
  avatar: string | null;
  city: string | null;
  verifiedMobileMoney: boolean;
  memberSince: string;
  salesCount: number;
  purchasesCount: number;
}

type Db = ReturnType<typeof getDatabase>;

function rowToUser(row: any): AuthUser {
  return {
    id: row.id,
    phone: row.phone,
    name: row.name,
    avatar: row.avatar,
    city: row.city,
    verifiedMobileMoney: row.verified_mobile_money,
    memberSince: row.member_since,
    salesCount: row.sales_count,
    purchasesCount: row.purchases_count,
  };
}

export async function getUserFromRequest(req: Request, db: Db): Promise<AuthUser | null> {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;

  const rows = await db.sql`
    SELECT u.* FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ${token} AND s.expires_at > NOW()
  `;

  if (rows.length === 0) return null;
  return rowToUser(rows[0]);
}

export function userToRow(user: AuthUser) {
  return user;
}

export { rowToUser };
