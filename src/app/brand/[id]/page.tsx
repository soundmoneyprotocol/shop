'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

const BRANDS_INFO: { [key: string]: any } = {
  bezy: { name: 'BEZY', logo: 'B', rating: 4.9, reviews: 342, description: 'Premium sneaker and collectible marketplace' },
  stockx: { name: 'STOCKX', logo: 'SX', rating: 4.8, reviews: 250, description: 'Authentic sneaker exchange platform' },
  stadiumgoods: { name: 'StadiumGoods', logo: 'SG', rating: 4.7, reviews: 180, description: 'Limited edition sneakers and apparel' },
  yeezy: { name: 'YEEZY', logo: 'Y', rating: 4.9, reviews: 520, description: 'Official Yeezy collection and drops' },
  supreme: { name: 'SUPREME', logo: 'SU', rating: 4.8, reviews: 380, description: 'Exclusive Supreme merchandise and collectibles' },
  sneakercred: { name: 'SneakerCred', logo: 'SC', rating: 4.8, reviews: 250, description: 'Curated sneaker collections and authentication' },
};

const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Jordan 1 Retro High OG',
    price: 15999,
    image: '/Air-Jordan-1.png?w=300&h=300&fit=crop',
    rating: 4.8,
    stock: 5,
  },
  {
    id: '2',
    title: 'Limited Edition Vintage Tee',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    rating: 4.5,
    stock: 12,
  },
  {
    id: '3',
    title: 'Premium Collectible',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=300&h=300&fit=crop',
    rating: 4.9,
    stock: 3,
  },
  {
    id: '4',
    title: 'Street Man',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    rating: 4.6,
    stock: 8,
  },
];

export default function BrandPage({ params }: { params: { id: string } }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const brand = BRANDS_INFO[params.id];

  if (!brand) {
    return (
      <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600">Brand not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.div
          className="mb-8 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Link href="/marketplace" className="text-gray-600 hover:text-black transition">
            Marketplace
          </Link>
          <ChevronRight size={18} className="text-gray-400" />
          <span className="text-black font-semibold">{brand.name}</span>
        </motion.div>

        {/* Brand Header */}
        <motion.div
          className="mb-12 card"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-3xl">{brand.logo}</span>
            </div>
            <div>
              <h1 className="text-4xl font-light mb-2">{brand.name}</h1>
              <p className="text-gray-600 text-lg mb-4">{brand.description}</p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-black">★ {brand.rating}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reviews</p>
                  <p className="text-2xl font-bold text-black">{brand.reviews}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-light">Featured Products</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 transition-all ${
                  viewMode === 'list'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}>
            {MOCK_PRODUCTS.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link href={`/product/${product.id}`}>
                  <div className={viewMode === 'grid' ? 'card-hover group' : 'card-hover flex gap-4'}>
                    <div
                      className={`relative overflow-hidden ${
                        viewMode === 'grid' ? 'w-full h-48' : 'w-24 h-24 flex-shrink-0'
                      }`}
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    <div className={viewMode === 'grid' ? 'mt-4' : 'flex-1 flex flex-col justify-between'}>
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base line-clamp-2">{product.title}</h3>
                      </div>

                      <div className={viewMode === 'grid' ? 'mt-4' : ''}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-sm">★ {product.rating}</div>
                        </div>
                        <div className="text-green-600 font-bold">${(product.price / 100).toFixed(2)}</div>
                        {product.stock < 10 && (
                          <p className="text-xs text-orange-500 mt-1">Only {product.stock} left</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
