'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Heart, Share2, TrendingUp, X, CheckCircle, Loader } from 'lucide-react';
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
};

export default function ProductDetail({ params }: { params: { id: string } }) {
  const product = MOCK_PRODUCTS[params.id] || MOCK_PRODUCTS['1'];
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [mintStep, setMintStep] = useState<'uploading' | 'saving' | 'confirming' | 'complete'>('uploading');
  const [bidAmount, setBidAmount] = useState('');
  const [offerAmount, setOfferAmount] = useState('');

  const addItem = useCartStore((state) => state.addItem);

  const handleBid = () => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      toast.error('Please enter a valid bid amount');
      return;
    }
    toast.success(`Bid placed for $${bidAmount}!`);
    setShowBidModal(false);
    setBidAmount('');
  };

  const handleOffer = () => {
    if (!offerAmount || parseFloat(offerAmount) <= 0) {
      toast.error('Please enter a valid offer amount');
      return;
    }
    toast.success(`Offer sent for $${offerAmount}!`);
    setShowOfferModal(false);
    setOfferAmount('');
  };

  const handleCheckout = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      creatorName: product.creator,
      maxStock: product.stock,
    });
    toast.success('Added to cart!');
  };

  const startMintProcess = () => {
    setShowMintModal(true);
    setMintStep('uploading');

    // Simulate mint flow
    setTimeout(() => setMintStep('saving'), 1500);
    setTimeout(() => setMintStep('confirming'), 3000);
    setTimeout(() => setMintStep('complete'), 4500);
  };

  const getMintStepIcon = () => {
    if (mintStep === 'complete') return <CheckCircle className="w-6 h-6 text-green-600" />;
    if (mintStep === 'confirming') return <Loader className="w-6 h-6 text-blue-600 animate-spin" />;
    return <CheckCircle className="w-6 h-6 text-green-600" />;
  };

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

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={() => setShowBidModal(true)}
                className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-black/90 transition"
              >
                Place a Bid
              </button>
              <button
                onClick={() => setShowOfferModal(true)}
                className="w-full py-3 border-2 border-black text-black font-semibold rounded-lg hover:bg-black/5 transition"
              >
                Make an Offer
              </button>
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-gray-100 text-black font-semibold rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Checkout
              </button>
            </div>

            {/* Mint Option */}
            <button
              onClick={startMintProcess}
              className="w-full py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
            >
              Mint as NFT
            </button>
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
        </motion.div>
      </div>

      {/* Bid Modal */}
      <AnimatePresence>
        {showBidModal && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="bg-white rounded-lg max-w-md w-full p-6 space-y-4"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-light">Place a Bid</h3>
                <button onClick={() => setShowBidModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">CURRENT PRICE</p>
                  <p className="text-3xl font-light">${(product.price / 100).toFixed(2)}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Your Bid Amount</label>
                  <input
                    type="number"
                    placeholder="Enter bid amount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black outline-none transition"
                    min={product.price / 100}
                    step="0.01"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={handleBid}
                    className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-black/90 transition"
                  >
                    Submit Bid
                  </button>
                  <button
                    onClick={() => setShowBidModal(false)}
                    className="w-full py-3 border-2 border-gray-300 text-black font-semibold rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offer Modal */}
      <AnimatePresence>
        {showOfferModal && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="bg-white rounded-lg max-w-md w-full p-6 space-y-4"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-light">Make an Offer</h3>
                <button onClick={() => setShowOfferModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">ASKING PRICE</p>
                  <p className="text-3xl font-light">${(product.price / 100).toFixed(2)}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Your Offer Amount</label>
                  <input
                    type="number"
                    placeholder="Enter offer amount"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black outline-none transition"
                    step="0.01"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={handleOffer}
                    className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-black/90 transition"
                  >
                    Send Offer
                  </button>
                  <button
                    onClick={() => setShowOfferModal(false)}
                    className="w-full py-3 border-2 border-gray-300 text-black font-semibold rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mint Modal */}
      <AnimatePresence>
        {showMintModal && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="bg-white rounded-lg max-w-md w-full p-6 space-y-6"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-light">Mint NFT</h3>
                {mintStep === 'complete' && (
                  <button onClick={() => setShowMintModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Mint Steps */}
              <div className="space-y-4">
                {/* Step 1: Upload to IPFS */}
                <div className="flex gap-4 items-start">
                  <div className="mt-1">
                    {mintStep === 'uploading' && <Loader className="w-5 h-5 text-blue-600 animate-spin" />}
                    {['saving', 'confirming', 'complete'].includes(mintStep) && <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-black">Upload to IPFS</p>
                    <p className="text-sm text-gray-600">Please wait Secure metadata uploading your files</p>
                  </div>
                </div>

                {/* Step 2: Save Metadata */}
                <div className="flex gap-4 items-start">
                  <div className="mt-1">
                    {['uploading'].includes(mintStep) && <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                    {mintStep === 'saving' && <Loader className="w-5 h-5 text-blue-600 animate-spin" />}
                    {['confirming', 'complete'].includes(mintStep) && <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-black">Saving to Metadata</p>
                    <p className="text-sm text-gray-600">Storing your NFT metadata on blockchain</p>
                  </div>
                </div>

                {/* Step 3: Confirm Mint */}
                <div className="flex gap-4 items-start">
                  <div className="mt-1">
                    {['uploading', 'saving'].includes(mintStep) && <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                    {mintStep === 'confirming' && <Loader className="w-5 h-5 text-blue-600 animate-spin" />}
                    {mintStep === 'complete' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-black">Awaiting Mint Confirmation</p>
                    <p className="text-sm text-gray-600">Confirming your transaction on-chain</p>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              {mintStep === 'complete' && (
                <motion.div className="p-4 bg-green-50 rounded-lg text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-green-700 font-semibold mb-2">NFT Successfully Minted!</p>
                  <p className="text-sm text-green-600">Your authenticity badge is now on the blockchain</p>
                </motion.div>
              )}

              {mintStep === 'complete' && (
                <button
                  onClick={() => setShowMintModal(false)}
                  className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-black/90 transition"
                >
                  Done
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
