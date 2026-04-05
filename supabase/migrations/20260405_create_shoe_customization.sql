-- Shoe Customization Schema
-- Enables users to create custom sneaker NFTs with layer-based color customization

-- Shoe attribute types (colors available for each shoe part)
CREATE TABLE shoe_attributes (
  id SERIAL PRIMARY KEY,
  attribute_type VARCHAR(50) NOT NULL,  -- 'sole', 'swoosh', 'body', 'top', 'toe', 'back'
  name VARCHAR(255),
  hex_code VARCHAR(6) NOT NULL,  -- Hex color without #
  image_path TEXT,  -- Path in Supabase storage
  boost_level INT DEFAULT 0,  -- For special color variants
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(attribute_type, hex_code)
);

-- Custom shoes created by users
CREATE TABLE custom_shoes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token_id BIGINT UNIQUE,  -- NFT token ID after minting
  name VARCHAR(255),
  description TEXT,

  -- Custom colors (hex codes)
  sole_hex VARCHAR(6),
  swoosh_hex VARCHAR(6),
  body_hex VARCHAR(6),
  top_hex VARCHAR(6),
  toe_hex VARCHAR(6),
  back_hex VARCHAR(6),

  -- Generated metadata
  image_url TEXT,  -- Supabase Storage URL
  metadata_uri TEXT,  -- IPFS or Supabase URI
  metadata_json JSONB,  -- Full NFT metadata

  -- Contract info
  contract_address TEXT,
  contract_chain VARCHAR(50),  -- 'skale', 'ethereum', 'polygon'
  mint_status VARCHAR(20) DEFAULT 'draft',  -- 'draft', 'pending', 'minted', 'failed'
  transaction_hash TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_hex_colors CHECK (
    (sole_hex IS NULL OR sole_hex ~ '^[0-9A-Fa-f]{6}$') AND
    (swoosh_hex IS NULL OR swoosh_hex ~ '^[0-9A-Fa-f]{6}$') AND
    (body_hex IS NULL OR body_hex ~ '^[0-9A-Fa-f]{6}$') AND
    (top_hex IS NULL OR top_hex ~ '^[0-9A-Fa-f]{6}$') AND
    (toe_hex IS NULL OR toe_hex ~ '^[0-9A-Fa-f]{6}$') AND
    (back_hex IS NULL OR back_hex ~ '^[0-9A-Fa-f]{6}$')
  )
);

-- Shoe trades/marketplace listings
CREATE TABLE shoe_trades (
  id SERIAL PRIMARY KEY,
  shoe_id INTEGER REFERENCES custom_shoes(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES auth.users(id),

  -- Trade details
  price DECIMAL(18, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'active',  -- 'active', 'sold', 'cancelled', 'failed'

  -- Payment & settlement
  payment_intent_id TEXT,  -- Stripe payment intent ID
  transaction_hash TEXT,  -- Blockchain transaction

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,

  INDEX idx_seller_id (seller_id),
  INDEX idx_buyer_id (buyer_id),
  INDEX idx_status (status)
);

-- Enable RLS (Row Level Security)
ALTER TABLE shoe_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_shoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shoe_trades ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- shoe_attributes: Public read, only service role can insert/update
CREATE POLICY "Shoe attributes are readable by everyone"
  ON shoe_attributes FOR SELECT
  USING (true);

CREATE POLICY "Only service role can manage attributes"
  ON shoe_attributes FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- custom_shoes: Users can read their own, create new
CREATE POLICY "Users can read their own shoes"
  ON custom_shoes FOR SELECT
  USING (auth.uid() = user_id OR mint_status = 'minted');

CREATE POLICY "Users can create shoes"
  ON custom_shoes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shoes"
  ON custom_shoes FOR UPDATE
  USING (auth.uid() = user_id);

-- shoe_trades: Users can see their trades, open listings
CREATE POLICY "Users can read their trades and public listings"
  ON shoe_trades FOR SELECT
  USING (auth.uid() = seller_id OR auth.uid() = buyer_id OR status = 'active');

CREATE POLICY "Users can create trades"
  ON shoe_trades FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own trades"
  ON shoe_trades FOR UPDATE
  USING (auth.uid() = seller_id);

-- Create storage bucket for shoe images
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
VALUES ('shoe-images', 'shoe-images', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Allow public reads from shoe-images bucket
CREATE POLICY "Allow public read on shoe images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'shoe-images');

-- Allow users to upload to their own folder
CREATE POLICY "Allow users to upload their shoe images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'shoe-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create indexes for performance
CREATE INDEX idx_custom_shoes_user_id ON custom_shoes(user_id);
CREATE INDEX idx_custom_shoes_token_id ON custom_shoes(token_id);
CREATE INDEX idx_custom_shoes_mint_status ON custom_shoes(mint_status);
CREATE INDEX idx_shoe_trades_shoe_id ON shoe_trades(shoe_id);
CREATE INDEX idx_shoe_trades_created_at ON shoe_trades(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_custom_shoes_updated_at
  BEFORE UPDATE ON custom_shoes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
