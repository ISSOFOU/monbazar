CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  buyer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  delivery_fee INTEGER NOT NULL DEFAULT 0,
  protection_fee INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER NOT NULL,
  delivery_method TEXT NOT NULL,
  delivery_address TEXT,
  fedapay_transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS payments_buyer_idx ON payments (buyer_id);
CREATE INDEX IF NOT EXISTS payments_seller_idx ON payments (seller_id);
CREATE INDEX IF NOT EXISTS payments_product_idx ON payments (product_id);
CREATE INDEX IF NOT EXISTS payments_fedapay_txn_idx ON payments (fedapay_transaction_id);
