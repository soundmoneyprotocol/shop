'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface MarketplacePrice {
  marketplace: string;
  lowestAsk: number | null;
  highestBid: number | null;
  lastSalePrice: number | null;
  supply: number;
  demand: number;
  timestamp: string;
  condition: string;
  size: string;
}

interface PriceData {
  sku: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  timeframe: string;
  prices: MarketplacePrice[];
  summary: Record<string, any>;
}

const PRODUCTS = [
  { sku: 'JORDAN-001', name: 'Jordan 1 Retro High OG', brand: 'Nike' },
  { sku: 'NIKE-AF1', name: 'Nike Air Force 1', brand: 'Nike' },
  { sku: 'YEEZY-350', name: 'Yeezy 350 Boost', brand: 'Adidas' },
];

const MARKETPLACES = ['GOAT', 'StockX', 'Grailed', 'eBay', 'StadiumGoods', 'KLEKT'];

export default function MarketplaceAnalytics() {
  const [selectedProduct, setSelectedProduct] = useState('JORDAN-001');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('7d');
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showTimeframeDropdown, setShowTimeframeDropdown] = useState(false);

  useEffect(() => {
    fetchPriceData();
  }, [selectedProduct, timeframe]);

  const fetchPriceData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/marketplace-prices?sku=${selectedProduct}&timeframe=${timeframe}`
      );
      const result = await response.json();
      if (result.success) {
        setPriceData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch price data:', error);
    }
    setLoading(false);
  };

  if (!priceData) {
    return (
      <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  // Group prices by marketplace
  const pricesByMarketplace = priceData.prices.reduce((acc, p) => {
    if (!acc[p.marketplace]) {
      acc[p.marketplace] = [];
    }
    acc[p.marketplace].push(p);
    return acc;
  }, {} as Record<string, MarketplacePrice[]>);

  // Get latest price for each marketplace
  const latestPrices: Record<string, MarketplacePrice> = {};
  for (const [marketplace, prices] of Object.entries(pricesByMarketplace)) {
    if (prices.length > 0) {
      latestPrices[marketplace] = prices[prices.length - 1];
    }
  }

  // Find min/max ask across all marketplaces
  const allAsks = Object.values(latestPrices)
    .map(p => p.lowestAsk)
    .filter((p): p is number => p !== null);
  const minAsk = allAsks.length > 0 ? Math.min(...allAsks) : 0;
  const maxAsk = allAsks.length > 0 ? Math.max(...allAsks) : 0;
  const askRange = maxAsk - minAsk;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.div className="mb-8 text-gray-600 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black">Marketplace Analytics</span>
        </motion.div>

        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-light mb-4 text-black">Marketplace Analytics</h1>
          <p className="text-gray-600">Compare prices across GOAT, StockX, Grailed, eBay and more</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex flex-wrap items-center gap-6">
            {/* Product Selector */}
            <div className="relative">
              <button
                onClick={() => setShowProductDropdown(!showProductDropdown)}
                className="text-gray-900 font-medium flex items-center justify-start gap-2 hover:text-black transition"
              >
                <span>
                  {PRODUCTS.find(p => p.sku === selectedProduct)?.name || 'Select Product'}
                </span>
                <ChevronDown size={18} className={`transition-transform ${showProductDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showProductDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 shadow-lg z-10 min-w-[300px]">
                  {PRODUCTS.map((product) => (
                    <button
                      key={product.sku}
                      onClick={() => {
                        setSelectedProduct(product.sku);
                        setShowProductDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
                        selectedProduct === product.sku ? 'text-black font-bold' : 'text-gray-900'
                      }`}
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Timeframe Selector */}
            <div className="relative">
              <button
                onClick={() => setShowTimeframeDropdown(!showTimeframeDropdown)}
                className="text-gray-900 font-medium flex items-center justify-start gap-2 hover:text-black transition"
              >
                <span>{timeframe === '7d' ? '7 Days' : timeframe === '30d' ? '30 Days' : '90 Days'}</span>
                <ChevronDown size={18} className={`transition-transform ${showTimeframeDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showTimeframeDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 shadow-lg z-10">
                  {(['7d', '30d', '90d'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => {
                        setTimeframe(tf);
                        setShowTimeframeDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
                        timeframe === tf ? 'text-black font-bold' : 'text-gray-900'
                      }`}
                    >
                      {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : '90 Days'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          className="card mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex gap-6 items-start">
            {priceData.imageUrl && (
              <img
                src={priceData.imageUrl}
                alt={priceData.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Product</p>
              <h2 className="text-2xl font-light mb-2 text-black">{priceData.name}</h2>
              <p className="text-gray-600">{priceData.brand}</p>
            </div>
          </div>
        </motion.div>

        {/* Marketplace Comparison */}
        <motion.div
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-light mb-8 text-black">Price Comparison</h2>

          <div className="space-y-6">
            {MARKETPLACES.map((marketplace) => {
              const data = latestPrices[marketplace];

              if (!data) return null;

              const ask = data.lowestAsk || 0;
              const percentOfMax = askRange > 0 ? ((ask - minAsk) / askRange) * 100 : 50;
              const isLowestPrice = ask === minAsk;
              const isPriceDiff = ask !== minAsk;

              return (
                <motion.div
                  key={marketplace}
                  className="card"
                  variants={itemVariants}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-black">{marketplace}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Updated: {new Date(data.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-green-600">${ask.toFixed(2)}</p>
                      {isLowestPrice && (
                        <p className="text-xs text-green-600 font-semibold mt-1">Lowest Price</p>
                      )}
                      {isPriceDiff && !isLowestPrice && (
                        <p className="text-xs text-orange-600 font-semibold mt-1">
                          +${(ask - minAsk).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price Bar */}
                  <div className="mb-6">
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${'bg-green-600'}`}
                        style={{ width: `${percentOfMax}%` }}
                      />
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Highest Bid</p>
                      <p className="text-lg font-bold text-black">
                        ${data.highestBid ? data.highestBid.toFixed(2) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Last Sale</p>
                      <p className="text-lg font-bold text-black">
                        ${data.lastSalePrice ? data.lastSalePrice.toFixed(2) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Supply</p>
                      <p className="text-lg font-bold text-black flex items-center gap-2">
                        {data.supply}
                        {data.supply > 40 && <TrendingUp size={16} className="text-red-600" />}
                        {data.supply <= 40 && <TrendingDown size={16} className="text-green-600" />}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Demand</p>
                      <p className="text-lg font-bold text-black flex items-center gap-2">
                        {data.demand}
                        {data.demand > 100 && <TrendingUp size={16} className="text-green-600" />}
                        {data.demand <= 100 && <TrendingDown size={16} className="text-red-600" />}
                      </p>
                    </div>
                  </div>

                  {/* Condition Badge */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      {data.condition} • Size {data.size}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Summary Stats */}
        {priceData.summary && (
          <motion.div
            className="mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-light mb-8 text-black">Summary Statistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(priceData.summary).map(([marketplace, stats]: [string, any]) => (
                <motion.div key={marketplace} className="card" variants={itemVariants}>
                  <h3 className="text-lg font-bold text-black mb-4">{marketplace}</h3>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Average Ask</p>
                      <p className="text-xl font-bold text-green-600">
                        ${stats.avgAsk ? stats.avgAsk.toFixed(2) : 'N/A'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 mb-1">Price Range</p>
                      <p className="text-sm text-black">
                        ${stats.minAsk?.toFixed(2) || 'N/A'} - ${stats.maxAsk?.toFixed(2) || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 mb-1">Avg Sale Price</p>
                      <p className="text-sm font-semibold text-black">
                        ${stats.avgSalePrice ? stats.avgSalePrice.toFixed(2) : 'N/A'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        {stats.dataPoints} price points • Supply: {stats.totalSupply} • Demand: {stats.totalDemand}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Info Box */}
        <motion.div
          className="card bg-gray-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <h3 className="font-semibold text-black mb-3">About This Data</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            Price data is collected hourly from major marketplaces including GOAT, StockX, Grailed, and eBay.
            Prices shown represent the lowest asking price (Ask) for each marketplace. Supply indicates
            the number of active listings, while demand represents buyer interest. This data helps you
            understand market trends and set competitive prices for your artist merchandise.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
