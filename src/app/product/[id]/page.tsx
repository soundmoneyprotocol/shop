'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Share2, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cartStore';
import toast from 'react-hot-toast';

// Mock product data - replace with real data from Supabase
const MOCK_PRODUCTS: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Jordan 1 Retro High OG',
    creator: 'SneakerKing',
    creatorId: '1',
    price: 15999, // $159.99
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
    price: 4999, // $49.99
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
  const [selectedTab, setSelectedTab] = useState('details');

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Mock reviews
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
    <main className="min-h-screen bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-8 text-slate-400">
            <Link href="/marketplace" className="hover:text-primary transition">
              Marketplace
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/marketplace?category=${product.category}`} className="hover:text-primary transition">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{product.title}</span>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <motion.div variants={itemVariants}>
              <div className="space-y-4">
                <div className="relative bg-slate-800 rounded-xl overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-96 sm:h-[500px] object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`p-3 rounded-full backdrop-blur transition-all ${
                        isFavorite
                          ? 'bg-red-500/80 text-white'
                          : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                    >
                      <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <button className="p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all">
                      <Share2 size={20} />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    {product.badges.map((badge: string, i: number) => (
                      <span key={i} className="badge badge-primary text-xs">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Thumbnail placeholder */}
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-20 h-20 bg-slate-800 rounded-lg cursor-pointer hover:border-primary border-2 border-transparent transition">
                      <img src={product.image} alt="" className="w-full h-full object-cover rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div variants={itemVariants}>
              <div className="space-y-6">
                {/* Title & Rating */}
                <div>
                  <span className="text-primary text-sm font-semibold uppercase">{product.category}</span>
                  <h1 className="text-4xl font-bold mt-2 mb-4">{product.title}</h1>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{product.rating}</span>
                      <span className="text-slate-400">({product.reviews} reviews)</span>
                    </div>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-400">{product.sold} sold</span>
                  </div>
                </div>

                {/* Creator Info */}
                <Link href={`/seller/${product.creatorId}`}>
                  <div className="card-hover p-4 flex items-center gap-3 cursor-pointer group">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/40 transition">
                      {product.creator.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold group-hover:text-primary transition">{product.creator}</p>
                      <p className="text-sm text-slate-400">Verified Seller</p>
                    </div>
                  </div>
                </Link>

                {/* Price & Stock */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-slate-400 text-sm">Price</p>
                    <p className="text-5xl font-bold text-primary">${(product.price / 100).toFixed(2)}</p>
                  </div>

                  <div className="flex gap-6 text-sm">
                    <div>
                      <p className="text-slate-400">Stock Available</p>
                      <p className="font-semibold text-lg">
                        {product.stock > 0 ? (
                          <span className="text-green-400">{product.stock} left</span>
                        ) : (
                          <span className="text-red-400">Out of Stock</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Condition</p>
                      <p className="font-semibold text-lg">{product.details.condition}</p>
                    </div>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="space-y-3">
                  <p className="text-slate-400 text-sm">Quantity</p>
                  <div className="flex gap-3 items-center">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.stock))
                      }
                      className="input-base w-20 text-center"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(quantity + 1, product.stock))}
                      className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
                    >
                      +
                    </button>
                    <p className="text-slate-400 text-sm ml-auto">
                      Total: ${((product.price * quantity) / 100).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                  <Link href="/checkout" className="flex-1 btn-secondary text-center">
                    Buy Now
                  </Link>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-700">
                  <div className="text-center">
                    <TrendingUp className="w-5 h-5 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-slate-400">Trending</p>
                  </div>
                  <div className="text-center">
                    <ShoppingCart className="w-5 h-5 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-slate-400">Fast Shipping</p>
                  </div>
                  <div className="text-center">
                    <Star className="w-5 h-5 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-slate-400">Verified</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Tabs Section */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="mt-16 space-y-8">
            {/* Tab Navigation */}
            <div className="flex gap-6 border-b border-slate-700">
              {['details', 'reviews', 'shipping'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`pb-4 px-2 font-semibold transition-colors ${
                    selectedTab === tab ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Details Tab */}
            {selectedTab === 'details' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3">Description</h3>
                    <p className="text-slate-300 leading-relaxed">{product.description}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-4">Item Details</h3>
                    <div className="grid grid-cols-2 gap-6">
                      {Object.entries(product.details).map(([key, value]: [string, any]) => (
                        <div key={key}>
                          <p className="text-slate-400 text-sm mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                          <p className="font-semibold">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reviews Tab */}
            {selectedTab === 'reviews' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card text-center">
                      <p className="text-4xl font-bold text-primary">{product.rating}</p>
                      <div className="flex items-center justify-center gap-1 my-2">
                        {[...Array(5)].map((_: any, i: number) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}
                          />
                        ))}
                      </div>
                      <p className="text-slate-400 text-sm">{product.reviews} reviews</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {reviews.map((review: typeof reviews[0]) => (
                      <div key={review.id} className="card">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold">{review.author}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {[...Array(5)].map((_: any, i: number) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={
                                    i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-400 text-sm">{review.date}</p>
                        </div>
                        <p className="text-slate-300">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Shipping Tab */}
            {selectedTab === 'shipping' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-4">
                  <div className="card">
                    <h3 className="font-semibold mb-3">Shipping Information</h3>
                    <ul className="space-y-2 text-slate-300">
                      <li>✓ Ships from: United States</li>
                      <li>✓ Shipping time: 2-5 business days</li>
                      <li>✓ Free shipping on orders over $50</li>
                      <li>✓ Tracking number provided</li>
                      <li>✓ Insured package</li>
                    </ul>
                  </div>

                  <div className="card">
                    <h3 className="font-semibold mb-3">Return Policy</h3>
                    <p className="text-slate-300">
                      Items can be returned within 30 days of delivery for full refund. Item must be in original condition.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Similar Products */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="mt-20 space-y-8">
            <h2 className="text-3xl font-bold">Similar Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {['1', '2'].map((id) => {
                const p = MOCK_PRODUCTS[id];
                return (
                  <Link key={id} href={`/product/${id}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="card-hover group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg h-48 mb-4">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2 badge-primary">{p.category}</div>
                        </div>
                        <h3 className="font-semibold line-clamp-2 mb-2">{p.title}</h3>
                        <p className="text-sm text-slate-400 mb-3">{p.creator}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-primary font-bold">${(p.price / 100).toFixed(2)}</p>
                          <div className="flex items-center gap-1">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{p.rating}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
