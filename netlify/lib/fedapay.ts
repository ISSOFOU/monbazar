// Thin wrapper around the Fedapay REST API (https://docs.fedapay.com).
// Uses FEDAPAY_SECRET_KEY + FEDAPAY_ENV env vars, set as Netlify env vars.

function apiBase(): string {
  const env = process.env.FEDAPAY_ENV === 'live' ? 'live' : 'sandbox';
  return env === 'live' ? 'https://api.fedapay.com/v1' : 'https://sandbox-api.fedapay.com/v1';
}

function checkoutBase(): string {
  const env = process.env.FEDAPAY_ENV === 'live' ? 'live' : 'sandbox';
  return env === 'live' ? 'https://checkout.fedapay.com' : 'https://sandbox-checkout.fedapay.com';
}

function secretKey(): string {
  const key = process.env.FEDAPAY_SECRET_KEY;
  if (!key) throw new Error('FEDAPAY_SECRET_KEY manquant');
  return key;
}

export function isFedapayConfigured(): boolean {
  return Boolean(process.env.FEDAPAY_SECRET_KEY);
}

interface CreateTransactionParams {
  amount: number;
  description: string;
  callbackUrl: string;
  customer: { firstname: string; lastname: string; phoneNumber: string };
}

export async function createFedapayTransaction(params: CreateTransactionParams): Promise<{ transactionId: string; checkoutUrl: string }> {
  const res = await fetch(`${apiBase()}/transactions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${secretKey()}`,
    },
    body: JSON.stringify({
      description: params.description,
      amount: params.amount,
      currency: { iso: 'XOF' },
      callback_url: params.callbackUrl,
      customer: {
        firstname: params.customer.firstname,
        lastname: params.customer.lastname,
        phone_number: { number: params.customer.phoneNumber, country: 'bj' },
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`Fedapay transaction creation failed (${res.status}): ${errBody}`);
  }

  const data = await res.json();
  const transactionId = String(data['v1/transaction']?.id ?? data.id);

  const tokenRes = await fetch(`${apiBase()}/transactions/${transactionId}/token`, {
    method: 'POST',
    headers: { authorization: `Bearer ${secretKey()}` },
  });

  if (!tokenRes.ok) {
    const errBody = await tokenRes.text().catch(() => '');
    throw new Error(`Fedapay token generation failed (${tokenRes.status}): ${errBody}`);
  }

  const tokenData = await tokenRes.json();
  const token = tokenData.token ?? tokenData['v1/token']?.token;

  return {
    transactionId,
    checkoutUrl: tokenData.url ?? `${checkoutBase()}/${token}`,
  };
}

export async function getFedapayTransaction(transactionId: string): Promise<any> {
  const res = await fetch(`${apiBase()}/transactions/${transactionId}`, {
    headers: { authorization: `Bearer ${secretKey()}` },
  });
  if (!res.ok) throw new Error(`Fedapay transaction lookup failed (${res.status})`);
  const data = await res.json();
  return data['v1/transaction'] ?? data;
}

// Verifies the Fedapay-Signature header (HMAC-SHA256 over the raw body) using
// the Web Crypto API, since Netlify Functions run on Deno without Node's `crypto`.
export async function verifyFedapayWebhookSignature(rawBody: string, signatureHeader: string | null): Promise<boolean> {
  const secret = process.env.FEDAPAY_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;

  // Header format: "t=1673000000,s=abcdef123..."
  const parts = Object.fromEntries(
    signatureHeader.split(',').map((p) => {
      const [k, v] = p.split('=');
      return [k, v];
    })
  );
  const timestamp = parts.t;
  const signature = parts.s;
  if (!timestamp || !signature) return false;

  const payload = `${timestamp}.${rawBody}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const computed = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return computed === signature;
}
