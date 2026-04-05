'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Share2, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cartStore';
import toast from 'react-hot-toast';

// Mock product data
const MOCK_PRODUCTS: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Jordan 1 Retro High OG',
    creator: 'SneakerKing',
    creatorId: '1',
    price: 15999,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
    category: 'Sneakers',
    rating: 4.8,
    reviews: 127,
    stock: 5,
    sold: 23,
    description:
      'Original Air Jordan 1 Retro High OG in pristine condition. Worn only twice, comes with original box and receipt. Size 10.5 US. Perfect for collectors.',
    details: {
      condition: 'Like New',
      size: '10.5 US',
      year: '2024',
      color: 'Black and Red',
      material: 'Leather',
    },
    badges: ['Verified Authentic', 'Seller Verified', 'Fast Shipping'],
  },
  '2': {
    id: '2',
    title: 'Limited Edition Vintage Tee',
    creator: 'VintageVibe',
    creatorId: '2',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
    category: 'Clothing',
    rating: 4.5,
    reviews: 42,
    stock: 12,
    sold: 8,
    description:
      '90s vintage graphic tee in excellent condition. Single stitch construction, faded graphic adds to the authenticity. Unisex sizing.',
    details: {
      condition: 'Excellent',
      size: 'L',
      era: '1990s',
      brand: 'Vintage (Unknown)',
      material: 'Cotton 100%',
    },
    badges: ['Authentic Vintage', 'Rare Find'],
  },
};

export default function ProductDetail({ params }: { params: { id: string } }) {
  const product = MOCK_PRODUCTS[params.id] || MOCK_PRODUCTS['1'];
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      creatorName: product.creator,
      maxStock: product.stock,
    });
    toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart!`);
    setQuantity(1);
  };

  const reviews = [
    {
      id: 1,
      author: 'Jordan Collector',
      rating: 5,
      comment: 'Authentic and in perfect condition. Great seller!',
      date: '2024-04-01',
    },
    {
      id: 2,
      author: 'Sneaker Head',
      rating: 4,
      comment: 'Item matches description. Fast shipping.',
      date: '2024-03-28',
    },
  ];

  return (
    <main className="min-h-screen bg-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <Link href="/marketplace" className="text-sm text-gray-600 hover:text-black transition">
            ← Back to Marketplace
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Product Image Section */}
          <motion.div className="space-y-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-96 sm:h-[500px] object-cover"
              />
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur transition-all ${
                  isFavorite
                    ? 'bg-red-500/90 text-white'
                    : 'bg-white/90 text-black hover:bg-white'
                }`}
              >
                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>

              {/* Badges */}
              <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                {product.badges.slice(0, 2).map((badge: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-white/90 text-black text-xs font-semibold rounded">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <button key={i} className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-transparent hover:border-black transition overflow-hidden">
                  <img src={product.image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info Section */}
          <motion.div className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            {/* Title & Category */}
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase mb-2">{product.category}</p>
              <h1 className="text-3xl sm:text-4xl font-light mb-4 text-black">{product.title}</h1>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
                <p className="text-sm text-gray-600">({product.reviews} reviews)</p>
              </div>
            </div>

            {/* Seller Card */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-2">SELLER</p>
              <p className="font-semibold text-black">{product.creator}</p>
              <p className="text-sm text-gray-600">Verified Seller</p>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">PRICE</p>
              <p className="text-5xl font-light text-black">${(product.price / 100).toFixed(2)}</p>
            </div>

            {/* Stock & Condition */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">STOCK</p>
                <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">CONDITION</p>
                <p className="font-semibold text-black">{product.details.condition}</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600">QUANTITY</p>
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border-2 border-black rounded-lg hover:bg-black/5 transition"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.stock))
                  }
                  className="w-20 text-center px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-black outline-none transition"
                />
                <button
                  onClick={() => setQuantity(Math.min(quantity + 1, product.stock))}
                  className="px-4 py-2 border-2 border-black rounded-lg hover:bg-black/5 transition"
                >
                  +
                </button>
                <p className="text-sm text-gray-600 ml-auto">
                  Total: ${((product.price * quantity) / 100).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-black/90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <Link href="/checkout" className="block">
                <button className="w-full py-3 border-2 border-black text-black font-semibold rounded-lg hover:bg-black/5 transition">
                  Buy Now
                </button>
              </Link>
            </div>

            {/* Browse vs Auction Info */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                For auction bidding, offers, and NFT minting, visit the <Link href="/seller/dashboard" className="font-semibold hover:underline">Auctions</Link> section.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Details Section */}
        <motion.div
          className="mt-16 space-y-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-2xl font-light mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-light mb-4">Item Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(product.details).map(([key, value]: [string, any]) => (
                <div key={key} className="border-b border-gray-200 pb-4">
                  <p className="text-xs text-gray-600 uppercase mb-1">{key}</p>
                  <p className="font-semibold text-black">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-2xl font-light mb-4">Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-black">{review.author}</p>
                    <p className="text-xs text-gray-600">{review.date}</p>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
