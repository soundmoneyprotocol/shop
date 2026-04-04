'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['All', 'Sneakers', 'Clothing', 'Art', 'Vintage', 'Collectibles', 'Music'];
const PRICE_RANGES = [
  { label: 'Under $25', min: 0, max: 2500 },
  { label: '$25 - $50', min: 2500, max: 5000 },
  { label: '$50 - $100', min: 5000, max: 10000 },
  { label: 'Over $100', min: 10000, max: Infinity },
];

// Mock products - replace with real data from Supabase
const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Jordan 1 Retro High OG',
    creator: 'SneakerKing',
    price: 15999,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    category: 'Sneakers',
    rating: 4.8,
    stock: 5,
  },
  {
    id: '2',
    title: 'Limited Edition Vintage Tee',
    creator: 'VintageVibe',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    category: 'Clothing',
    rating: 4.5,
    stock: 12,
  },
  {
    id: '3',
    title: 'Abstract Art Print',
    creator: 'ArtCollector',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=300&h=300&fit=crop',
    category: 'Art',
    rating: 4.9,
    stock: 3,
  },
  {
    id: '4',
    title: 'Retro Vinyl Record',
    creator: 'MusicLover',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    category: 'Music',
    rating: 4.6,
    stock: 8,
  },
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice = !selectedPriceRange || (product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <main className="min-h-screen bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
          <p className="text-slate-400">Discover products from creators worldwide</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="mb-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products, creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base pl-12"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Price Range and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2 flex-1 overflow-x-auto">
              <button
                onClick={() => setSelectedPriceRange(null)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedPriceRange === null
                    ? 'bg-primary text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All Prices
              </button>
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.label}
                  onClick={() => setSelectedPriceRange(range)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    selectedPriceRange?.label === range.label
                      ? 'bg-primary text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Sort and View Mode */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-base py-2 px-3"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'grid' ? 'bg-primary text-white' : 'text-slate-400'
                  }`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'list' ? 'bg-primary text-white' : 'text-slate-400'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 text-slate-400">
          Showing {filteredProducts.length} products
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div
            className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={`/product/${product.id}`}>
                  <div className={viewMode === 'grid' ? 'card-hover group' : 'card-hover flex gap-4'}>
                    <div className={`relative overflow-hidden rounded-lg ${viewMode === 'grid' ? 'w-full h-48' : 'w-24 h-24 flex-shrink-0'}`}>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 badge-primary">{product.category}</div>
                    </div>

                    <div className={viewMode === 'grid' ? 'mt-4' : 'flex-1 flex flex-col justify-between'}>
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base line-clamp-2">{product.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">{product.creator}</p>
                      </div>

                      <div className={viewMode === 'grid' ? 'mt-4' : ''}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-sm">★ {product.rating}</div>
                          <div className="text-xs text-slate-400">({Math.floor(Math.random() * 200)} reviews)</div>
                        </div>
                        <div className="text-primary font-bold">${(product.price / 100).toFixed(2)}</div>
                        {product.stock < 10 && <p className="text-xs text-orange-400 mt-1">Only {product.stock} left</p>}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="card text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-slate-400 text-lg">No products found matching your filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedPriceRange(null);
              }}
              className="btn-primary mt-4"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}
