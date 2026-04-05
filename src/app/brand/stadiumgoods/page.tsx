'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  title: string;
  price_usd: number;
  image_url: string;
  category: string;
  rating: number;
  stock: number;
  creator_id: string;
}

const BRAND = {
  id: 'stadiumgoods-brand',
  name: 'StadiumGoods',
  description: 'Curated streetwear and sneaker marketplace',
  verified: true,
  rating: 4.7,
  reviews: 180,
  totalSales: 620,
};

const PRODUCTS: Product[] = [
  {
    id: 'sg-1',
    title: 'New Balance 550',
    price_usd: 14999,
    image_url: '/Air-Jordan-1.png?w=500&h=500&fit=crop',
    category: 'Sneakers',
    rating: 4.6,
    stock: 7,
    creator_id: 'stadiumgoods-brand',
  },
  {
    id: 'sg-2',
    title: 'Asics Gel-Lyte III',
    price_usd: 13999,
    image_url: '/Air-Jordan-1.png?w=500&h=500&fit=crop',
    category: 'Sneakers',
    rating: 4.5,
    stock: 5,
    creator_id: 'stadiumgoods-brand',
  },
  {
    id: 'sg-3',
    title: 'Vintage Starter Jacket',
    price_usd: 18999,
    image_url: '/Air-Jordan-1.png?w=500&h=500&fit=crop',
    category: 'Apparel',
    rating: 4.7,
    stock: 3,
    creator_id: 'stadiumgoods-brand',
  },
  {
    id: 'sg-4',
    title: 'Nike Cortez',
    price_usd: 11999,
    image_url: '/Air-Jordan-1.png?w=500&h=500&fit=crop',
    category: 'Sneakers',
    rating: 4.4,
    stock: 9,
    creator_id: 'stadiumgoods-brand',
  },
];

export default function StadiumGoodsPage() {
  const [products] = useState<Product[]>(PRODUCTS);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price_usd,
      image: product.image_url,
      creatorName: BRAND.name,
      maxStock: product.stock,
    });
    toast.success('Added to cart');
  };

  return (
    <main className="min-h-screen bg-white">
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
            <div className="w-20 h-20 bg-black rounded flex items-center justify-center">
              <span className="text-lg font-bold text-white">SG</span>
            </div>
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">{BRAND.name}</h1>
              <p className="text-gray-600 mb-3">{BRAND.description}</p>
              <div className="flex items-center gap-4">
                {BRAND.verified && (
                  <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded font-medium">Verified</span>
                )}
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <span>★</span>
                  {BRAND.rating} ({BRAND.reviews} reviews)
                </span>
                <span className="text-sm text-gray-600">
                  {BRAND.totalSales.toLocaleString()} sales
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-light text-gray-900 mb-8">Curated Collection</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="cursor-pointer">
                <div className="aspect-square overflow-hidden bg-gray-100 mb-3 relative">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:opacity-80 transition"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/400x400?text=No+Image';
                    }}
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">Out of Stock</span>
                    </div>
                  )}
                </div>

                <h3 className="text-sm text-gray-900 mb-2 line-clamp-2 group-hover:underline">
                  {product.title}
                </h3>
                <div className="flex justify-between items-baseline text-sm mb-3">
                  <span className="font-semibold text-green-600">
                    ${(product.price_usd / 100).toFixed(2)}
                  </span>
                  {product.rating ? (
                    <span className="text-gray-500 text-xs">★ {product.rating.toFixed(1)}</span>
                  ) : (
                    <span className="text-gray-400 text-xs">New</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
                className="w-full py-2 border border-gray-300 rounded text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition flex items-center justify-center gap-2"
              >
                <ShoppingCart size={14} />
                Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
