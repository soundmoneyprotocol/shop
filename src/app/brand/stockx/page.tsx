'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const BRAND_INFO = {
  name: 'STOCKX',
  description: 'Verified resale marketplace for sneakers and streetwear',
  verified: true,
  rating: 4.8,
  reviews: 250,
  totalSales: 850,
};

export default function StockXPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 transition mb-6 text-sm"
          >
            <ArrowLeft size={18} />
            Back to Marketplace
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-900 rounded flex items-center justify-center">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">{BRAND_INFO.name}</h1>
              <p className="text-gray-600 mb-3">{BRAND_INFO.description}</p>
              <div className="flex items-center gap-4">
                {BRAND_INFO.verified && (
                  <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded font-medium">Verified</span>
                )}
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <span>★</span>
                  {BRAND_INFO.rating} ({BRAND_INFO.reviews} reviews)
                </span>
                <span className="text-sm text-gray-600">
                  {BRAND_INFO.totalSales.toLocaleString()} sales
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-gray-600 text-center mb-12">Browse {BRAND_INFO.name} products on our marketplace</p>
        <Link href="/marketplace" className="text-center block">
          <button className="px-6 py-2 bg-gray-900 text-white rounded font-medium hover:bg-gray-800 transition">
            View Products
          </button>
        </Link>
      </div>
    </main>
  );
}
