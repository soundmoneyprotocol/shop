import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database schema
export type Creator = {
  id: string;
  wallet_address: string;
  name: string;
  shop_url: string;
  bio?: string;
  avatar_url?: string;
  total_earnings: number;
  total_sales: number;
  rating: number;
  verified: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  image_url: string;
  category: string; // sneakers, clothing, art, vintage, etc
  price_usd: number; // in cents
  stock: number;
  sold: number;
  has_authenticity_nft: boolean;
  nft_token_id?: number;
  rating: number;
  created_at: string;
};

export type Order = {
  id: string;
  product_id: string;
  buyer_id: string;
  creator_id: string;
  quantity: number;
  total_usd: number; // in cents
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'disputed' | 'refunded';
  transaction_hash?: string;
  stripe_payment_id?: string;
  created_at: string;
  paid_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  tracking_number?: string;
};

export type Review = {
  id: string;
  order_id: string;
  buyer_id: string;
  product_id: string;
  rating: number; // 1-5
  comment: string;
  created_at: string;
};
