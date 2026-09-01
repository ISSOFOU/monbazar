import type { Config } from '@netlify/functions';
import { getDatabase } from '@netlify/database';
import { INITIAL_PRODUCTS } from '../../src/data/mockData';
import type { Product } from '../../src/types';

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
    const body = await req.json();

    const product: Product = {
      id: `prod-${Date.now()}`,
      title: body.title || 'Nouvel article',
      price: body.price || 5000,
      originalPrice: body.originalPrice,
      images: body.images?.length
        ? body.images
        : ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80'],
      category: body.category || 'Mode & Friperie',
      condition: body.condition || 'Très bon état',
      location: body.location || body.city || 'Cotonou',
      city: body.city || 'Cotonou',
      description: body.description || "Description de l'article",
      seller: body.seller,
      createdAt: "À l'instant",
      viewsCount: 1,
      likesCount: 0,
      isNegotiable: body.isNegotiable ?? true,
      isSold: false,
    };

    await db.sql`
      INSERT INTO products (id, seller_id, category, city, is_sold, data)
      VALUES (${product.id}, ${product.seller?.id ?? 'unknown'}, ${product.category}, ${product.city}, false, ${JSON.stringify(product)}::jsonb)
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
