import type { Config, Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

export default async (req: Request, context: Context) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const key = context.params.key;
  if (!key) {
    return new Response('Missing key', { status: 400 });
  }

  const store = getStore('product-images');
  const result = await store.getWithMetadata(key, { type: 'arrayBuffer' });

  if (!result) {
    return new Response('Not found', { status: 404 });
  }

  const contentType = (result.metadata?.contentType as string) || 'application/octet-stream';

  return new Response(result.data, {
    headers: {
      'content-type': contentType,
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
};

export const config: Config = {
  path: '/api/images/:key',
};
