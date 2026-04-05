'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';

interface TrendingItem {
  id: string;
  title: string;
  creator: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  trendScore: number;
  category: string;
  percentGain: number;
}

const TRENDING_PRODUCTS: TrendingItem[] = [
  {
    id: '1',
    title: 'Jordan 1 Retro High OG',
    creator: 'SneakerKing',
    price: 15999,
    image: '/Air-Jordan-1.png?w=400&h=400&fit=crop',
    rating: 4.8,
    reviews: 127,
    trendScore: 98,
    category: 'Sneakers',
    percentGain: 12.5,
  },
  {
    id: '2',
    title: 'Limited Edition Vintage Tee',
    creator: 'VintageVibe',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    rating: 4.5,
    reviews: 42,
    trendScore: 87,
    category: 'Apparel',
    percentGain: 8.3,
  },
  {
    id: '3',
    title: 'Abstract Mixtape',
    creator: 'Cassette Tape Collector',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=400&h=400&fit=crop',
    rating: 4.9,
    reviews: 89,
    trendScore: 95,
    category: 'Cassettes',
    percentGain: 15.2,
  },
  {
    id: '4',
    title: 'Street Man',
    creator: 'Drope Beats',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    rating: 4.6,
    reviews: 56,
    trendScore: 82,
    category: 'Vinyl',
    percentGain: 6.1,
  },
  {
    id: '5',
    title: 'Supreme Collaboration Box',
    creator: 'SupremeCollector',
    price: 29999,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop',
    rating: 4.9,
    reviews: 234,
    trendScore: 92,
    category: 'Collectibles',
    percentGain: 18.7,
  },
  {
    id: '6',
    title: 'Yeezy 350 V2',
    creator: 'SneakerCred',
    price: 22999,
    image: '/Air-Jordan-1.png?w=400&h=400&fit=crop',
    rating: 4.8,
    reviews: 178,
    trendScore: 91,
    category: 'Sneakers',
    percentGain: 11.4,
  },
  {
    id: '7',
    title: 'Rare Band Poster',
    creator: 'PosterVault',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop',
    rating: 4.7,
    reviews: 45,
    trendScore: 78,
    category: 'Art',
    percentGain: 9.8,
  },
  {
    id: '8',
    title: 'Nike Dunk Low',
    creator: 'SneakerKing',
    price: 10999,
    image: '/Air-Jordan-1.png?w=400&h=400&fit=crop',
    rating: 4.6,
    reviews: 92,
    trendScore: 85,
    category: 'Sneakers',
    percentGain: 7.5,
  },
];

export default function TrendingPage() {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('7d');

  const sortedProducts = [...TRENDING_PRODUCTS].sort(
    (a, b) => b.trendScore - a.trendScore
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-black" />
            <h1 className="text-4xl font-light text-black">Trending Now</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover the hottest items gaining momentum on SoundMoney. Real-time trending based on views, sales velocity, and community engagement.
          </p>
        </motion.div>

        {/* Timeframe Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-12 flex gap-4"
        >
          {(['24h', '7d', '30d'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                timeframe === tf
                  ? 'bg-black text-white'
                  : 'border-2 border-black text-black hover:bg-black/5'
              }`}
            >
              {tf === '24h' ? 'Last 24h' : tf === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {sortedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group"
            >
              <Link href={`/product/${product.id}`}>
                <div className="relative overflow-hidden rounded-2xl bg-gray-100 mb-4 h-64">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Trend Score Badge */}
                  <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <TrendingUp size={14} />
                    {product.trendScore}
                  </div>

                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3 bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Percent Gain */}
                  <div className="absolute bottom-3 left-3 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    +{product.percentGain}%
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-semibold uppercase">{product.category}</p>
                  <h3 className="text-sm font-semibold line-clamp-2 group-hover:underline text-black">
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-600">{product.creator}</p>

                  <div className="flex items-center justify-between pt-2">
                    <p className="font-bold text-black">${(product.price / 100).toFixed(2)}</p>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">({product.reviews} reviews)</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-gray-50 border border-gray-200 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-black mb-4">How We Calculate Trending</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-black mb-2">📈 Velocity</h3>
              <p className="text-gray-600 text-sm">
                Sales and view acceleration in real-time
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-2">👥 Engagement</h3>
              <p className="text-gray-600 text-sm">
                Community interest and social signals
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-2">⭐ Quality</h3>
              <p className="text-gray-600 text-sm">
                Seller verification and customer ratings
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
