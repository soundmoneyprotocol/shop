'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Loader, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const AUCTION_PRODUCTS = [
  {
    id: '1',
    title: 'Jordan 1 Retro High OG',
    creator: 'SneakerKing',
    price: 15999,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
    rating: 4.8,
    reviews: 127,
    condition: 'Like New',
    auctionEnds: '2 days left',
    currentBid: 18000,
    bidCount: 12,
  },
  {
    id: '2',
    title: 'Limited Edition Vintage Tee',
    creator: 'VintageVibe',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
    rating: 4.5,
    reviews: 42,
    condition: 'Excellent',
    auctionEnds: '5 days left',
    currentBid: 7500,
    bidCount: 8,
  },
];

export default function AuctionsPage() {
  const [selectedProduct, setSelectedProduct] = useState<typeof AUCTION_PRODUCTS[0] | null>(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [mintStep, setMintStep] = useState<'uploading' | 'saving' | 'confirming' | 'complete'>('uploading');
  const [bidAmount, setBidAmount] = useState('');
  const [offerAmount, setOfferAmount] = useState('');

  const handleBid = () => {
    if (!bidAmount || parseFloat(bidAmount) <= selectedProduct!.currentBid / 100) {
      toast.error('Bid must be higher than current bid');
      return;
    }
    toast.success(`Bid of $${bidAmount} placed!`);
    setShowBidModal(false);
    setBidAmount('');
  };

  const handleOffer = () => {
    if (!offerAmount || parseFloat(offerAmount) <= 0) {
      toast.error('Please enter a valid offer amount');
      return;
    }
    toast.success(`Offer of $${offerAmount} sent!`);
    setShowOfferModal(false);
    setOfferAmount('');
  };

  const startMintProcess = () => {
    setShowMintModal(true);
    setMintStep('uploading');
    setTimeout(() => setMintStep('saving'), 1500);
    setTimeout(() => setMintStep('confirming'), 3000);
    setTimeout(() => setMintStep('complete'), 4500);
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-light mb-2">Live Auctions</h1>
          <p className="text-gray-600">Bid on exclusive items from verified sellers</p>
        </motion.div>

        {/* Auctions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AUCTION_PRODUCTS.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <div className="relative bg-gray-100 h-64 overflow-hidden group">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Live Auction
                </div>
                <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded text-sm font-semibold">
                  {product.auctionEnds}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.creator}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          size={12}
                          className={j < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">({product.reviews})</span>
                  </div>
                </div>

                {/* Condition */}
                <div className="py-3 border-t border-b border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">CONDITION</p>
                  <p className="font-semibold text-black text-sm">{product.condition}</p>
                </div>

                {/* Bid Info */}
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">CURRENT BID</p>
                    <p className="text-2xl font-light text-black">${(product.currentBid / 100).toFixed(2)}</p>
                  </div>
                  <p className="text-xs text-gray-600">{product.bidCount} bids so far</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowBidModal(true);
                    }}
                    className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-black/90 transition"
                  >
                    Place a Bid
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowOfferModal(true);
                    }}
                    className="w-full py-2 border-2 border-black text-black font-semibold rounded-lg hover:bg-black/5 transition text-sm"
                  >
                    Make an Offer
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      startMintProcess();
                    }}
                    className="w-full py-2 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition text-sm"
                  >
                    Mint NFT
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bid Modal */}
      <AnimatePresence>
        {showBidModal && selectedProduct && (
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

              {/* Product Preview */}
              <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <img src={selectedProduct.image} alt="" className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-semibold text-black text-sm mb-2 line-clamp-2">{selectedProduct.title}</p>
                  <p className="text-xs text-gray-600 mb-2">Current Bid</p>
                  <p className="text-lg font-light text-black">${(selectedProduct.currentBid / 100).toFixed(2)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Your Bid Amount (minimum ${((selectedProduct.currentBid / 100) + 1).toFixed(2)})</label>
                <input
                  type="number"
                  placeholder="Enter bid amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black outline-none transition"
                  min={selectedProduct.currentBid / 100}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offer Modal */}
      <AnimatePresence>
        {showOfferModal && selectedProduct && (
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

              {/* Product Preview */}
              <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <img src={selectedProduct.image} alt="" className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-semibold text-black text-sm mb-2 line-clamp-2">{selectedProduct.title}</p>
                  <p className="text-xs text-gray-600 mb-2">Asking Price</p>
                  <p className="text-lg font-light text-black">${(selectedProduct.price / 100).toFixed(2)}</p>
                </div>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mint Modal */}
      <AnimatePresence>
        {showMintModal && selectedProduct && (
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
                {/* Step 1 */}
                <div className="flex gap-4 items-start">
                  <div className="mt-1">
                    {mintStep === 'uploading' && <Loader className="w-5 h-5 text-blue-600 animate-spin" />}
                    {['saving', 'confirming', 'complete'].includes(mintStep) && <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-black">Upload to IPFS</p>
                    <p className="text-sm text-gray-600">Secure metadata uploading your files</p>
                  </div>
                </div>

                {/* Step 2 */}
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

                {/* Step 3 */}
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

              {/* Success */}
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
