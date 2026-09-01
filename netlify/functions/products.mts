import type { Config } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import { INITIAL_PRODUCTS } from '../../src/data/mockData';
import type { Product } from '../../src/types';
import { getUserFromRequest } from '../lib/auth';

export default async (req: Request) => {
  const db = getDatabase();

  if (req.method === 'GET') {
    const [{ count }] = await db.sql`SELECT COUNT(*)::int AS count FROM products`;

    if (count === 0) {
      for (const p of INITIAL_PRODUCTS) {
        await db.sql`
          INSERT INTO products (id, seller_id, category, city, is_sold, data)
          VALUES (${p.id}, ${p.seller.id}, ${p.category}, ${p.city}, ${p.isSold ?? false}, ${JSON.stringify(p)}::jsonb)
          ON CONFLICT (id) DO NOTHING
        `;
      }
    }

    const rows = await db.sql`SELECT data FROM products ORDER BY created_at DESC`;
    const products = rows.map((r: { data: Product }) => r.data);

    return new Response(JSON.stringify(products), {
      headers: { 'content-type': 'application/json' },
    });
  }

  if (req.method === 'POST') {
    const user = await getUserFromRequest(req, db);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Connecte-toi pour publier une annonce.' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });
    }

    const body = await req.json();

    if (!body.title || !body.price || !body.images?.length) {
      return new Response(JSON.stringify({ error: 'Titre, prix et au moins une photo sont requis.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const product: Product = {
      id: `prod-${Date.now()}`,
      title: body.title,
      price: body.price,
      originalPrice: body.originalPrice,
      images: body.images,
      category: body.category || 'Mode & Friperie',
      condition: body.condition || 'Très bon état',
      location: body.location || body.city || 'Cotonou',
      city: body.city || 'Cotonou',
      description: body.description || "Description de l'article",
      seller: {
        id: user.id,
        name: user.name,
        avatar: user.avatar ?? undefined,
        initials: user.name
          .split(' ')
          .map((w) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
        isVerified: true,
        memberSince: user.memberSince,
        salesCount: user.salesCount,
        rating: 5.0,
        phone: user.phone,
        responseRate: '5 min',
        verifiedMobileMoney: user.verifiedMobileMoney,
      },
      createdAt: "À l'instant",
      viewsCount: 1,
      likesCount: 0,
      isNegotiable: body.isNegotiable ?? true,
      isSold: false,
    };

    await db.sql`
      INSERT INTO products (id, seller_id, category, city, is_sold, data)
      VALUES (${product.id}, ${user.id}, ${product.category}, ${product.city}, false, ${JSON.stringify(product)}::jsonb)
    `;

    return new Response(JSON.stringify(product), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config: Config = {
  path: '/api/products',
};
