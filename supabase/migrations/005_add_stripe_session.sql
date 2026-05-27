ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS stripe_session_id text UNIQUE;
