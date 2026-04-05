'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, List, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['Apparel', 'Sneakers', 'Collectibles', 'Retro', 'Vinyl', 'Cassettes'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'featured-brands', label: 'Featured Brands' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

const BRANDS = [
  { id: 'bezy', name: 'BEZY', logo: 'B', rating: 4.9, reviews: 342, link: '/brand/bezy' },
  { id: 'stockx', name: 'STOCKX', logo: 'SX', rating: 4.8, reviews: 250, link: '/brand/stockx' },
  { id: 'stadiumgoods', name: 'StadiumGoods', logo: 'SG', rating: 4.7, reviews: 180, link: '/brand/stadiumgoods' },
  { id: 'yeezy', name: 'YEEZY', logo: 'Y', rating: 4.9, reviews: 520, link: '/brand/yeezy' },
  { id: 'supreme', name: 'SUPREME', logo: 'SU', rating: 4.8, reviews: 380, link: '/brand/supreme' },
  { id: 'sneakercred', name: 'SneakerCred', logo: 'SC', rating: 4.8, reviews: 250, link: '/brand/sneakercred' },
];

// Mock products - replace with real data from Supabase
const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Jordan 1 Retro High OG',
    creator: 'SneakerKing',
    brand: 'YEEZY',
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
    brand: 'SUPREME',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    category: 'Apparel',
    rating: 4.5,
    stock: 12,
  },
  {
    id: '3',
    title: 'Abstract Mixtape',
    creator: 'Cassette Tape Collector',
    brand: 'BEZY',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=300&h=300&fit=crop',
    category: 'Cassettes',
    rating: 4.9,
    stock: 3,
  },
  {
    id: '4',
    title: 'Retro Vinyl Record',
    creator: 'MusicLover',
    brand: 'STOCKX',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    category: 'Vinyl',
    rating: 4.6,
    stock: 8,
  },
];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === null || product.category === selectedCategory;
    const matchesBrand = selectedBrand === null || product.brand === selectedBrand;
    return matchesCategory && matchesBrand;
  });

  const currentSortLabel = SORT_OPTIONS.find(opt => opt.value === sortBy)?.label || 'Most Popular';
  const showFeaturedBrands = sortBy === 'featured-brands';

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-light mb-2">Marketplace</h1>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* All filters on one line */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="text-gray-900 font-medium flex items-center justify-start gap-2 hover:text-black transition"
              >
                <span>{selectedCategory ? selectedCategory : 'All'}</span>
                <ChevronDown size={18} className={`transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 shadow-lg z-10">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setShowCategoryDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
                      selectedCategory === null ? 'text-black font-bold' : 'text-gray-900'
                    }`}
                  >
                    All
                  </button>
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowCategoryDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
                        selectedCategory === category ? 'text-black font-bold' : 'text-gray-900'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Brand Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                className="text-gray-900 font-medium flex items-center justify-start gap-2 hover:text-black transition"
              >
                <span>{selectedBrand ? selectedBrand : 'Brand'}</span>
                <ChevronDown size={18} className={`transition-transform ${showBrandDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showBrandDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 shadow-lg z-10 min-w-[180px]">
                  <button
                    onClick={() => {
                      setSelectedBrand(null);
                      setShowBrandDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
                      selectedBrand === null ? 'text-black font-bold' : 'text-gray-900'
                    }`}
                  >
                    All Brands
                  </button>
                  {BRANDS.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => {
                        setSelectedBrand(brand.name);
                        setShowBrandDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
                        selectedBrand === brand.name ? 'text-black font-bold' : 'text-gray-900'
                      }`}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="text-gray-900 font-medium flex items-center justify-start gap-2 hover:text-black transition"
              >
                <span>{currentSortLabel}</span>
                <ChevronDown size={18} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showSortDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 shadow-lg z-10">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
                        sortBy === option.value ? 'text-black font-bold' : 'text-gray-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Mode Buttons */}
            {!showFeaturedBrands && (
              <div className="flex p-1 gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-all ${
                    viewMode === 'grid' ? 'text-black font-bold' : 'text-gray-500'
                  }`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-all ${
                    viewMode === 'list' ? 'text-black font-bold' : 'text-gray-500'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Featured Brands Section */}
        {showFeaturedBrands && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-light mb-8 text-gray-900">Featured Brands</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {BRANDS.map((brand) => (
                <Link key={brand.id} href={brand.link}>
                  <div className="card-hover p-6 text-center cursor-pointer group">
                    <div className="w-16 h-16 bg-black rounded mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{brand.logo}</span>
                    </div>
                    <h3 className="font-semibold text-sm mb-2 group-hover:underline">{brand.name}</h3>
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                      <span>★ {brand.rating}</span>
                      <span>({brand.reviews})</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results Count */}
        {!showFeaturedBrands && (
          <div className="mb-6 text-gray-600">
            Showing {filteredProducts.length} products
          </div>
        )}

        {/* Products Grid */}
        {!showFeaturedBrands && (
          <>
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
                        <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'w-full h-48' : 'w-24 h-24 flex-shrink-0'}`}>
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
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">{product.creator}</p>
                          </div>

                          <div className={viewMode === 'grid' ? 'mt-4' : ''}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-sm">★ {product.rating}</div>
                              <div className="text-xs text-gray-600">({Math.floor(Math.random() * 200)} reviews)</div>
                            </div>
                            <div className="text-green-600 font-bold">${(product.price / 100).toFixed(2)}</div>
                            {product.stock < 10 && <p className="text-xs text-orange-500 mt-1">Only {product.stock} left</p>}
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
                <p className="text-gray-600 text-lg">No products found matching your filters</p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedBrand(null);
                  }}
                  className="btn-primary mt-4"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
