CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  buyer_id TEXT NOT NULL,
  seller_id TEXT NOT NULL,
  buyer_unread BOOLEAN NOT NULL DEFAULT false,
  seller_unread BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS conversations_buyer_id_idx ON conversations (buyer_id);
CREATE INDEX IF NOT EXISTS conversations_seller_id_idx ON conversations (seller_id);
CREATE INDEX IF NOT EXISTS conversations_updated_at_idx ON conversations (updated_at DESC);
