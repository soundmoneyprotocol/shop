'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, Loader, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Jordan 1 Retro High OG',
    creator: 'SneakerKing',
    price: 15999,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
    condition: 'Like New',
  },
  {
    id: '2',
    title: 'Limited Edition Vintage Tee',
    creator: 'VintageVibe',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
    condition: 'Excellent',
  },
];

type AuthStep = 'select' | 'verify' | 'minting' | 'complete';

export default function AuthenticatePage() {
  const [authStep, setAuthStep] = useState<AuthStep>('select');
  const [selectedProduct, setSelectedProduct] = useState<typeof MOCK_PRODUCTS[0] | null>(null);
  const [mintStep, setMintStep] = useState<'uploading' | 'saving' | 'confirming' | 'complete'>('uploading');

  const handleSelectProduct = (product: typeof MOCK_PRODUCTS[0]) => {
    setSelectedProduct(product);
    setAuthStep('verify');
  };

  const handleVerify = () => {
    setAuthStep('minting');
    setMintStep('uploading');
    setTimeout(() => setMintStep('saving'), 1500);
    setTimeout(() => setMintStep('confirming'), 3000);
    setTimeout(() => setMintStep('complete'), 4500);
  };

  const handleComplete = () => {
    setAuthStep('complete');
    toast.success('NFT minted successfully!');
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <Link href="/" className="text-sm text-gray-600 hover:text-black transition mb-8 inline-block">
            ← Back
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-light text-black">Authenticate & Mint</h1>
              <p className="text-gray-600 mt-2">Verify your item and mint an authenticity NFT badge</p>
            </div>
          </div>
        </motion.div>

        {/* Step 1: Select Product */}
        <AnimatePresence>
          {authStep === 'select' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-light mb-6">Select an item to authenticate</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_PRODUCTS.map((product, i) => (
                  <motion.button
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleSelectProduct(product)}
                    className="text-left border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-600 hover:shadow-lg transition group"
                  >
                    <div className="relative bg-gray-100 h-64 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-6 space-y-3">
                      <div>
                        <p className="font-semibold text-black text-lg mb-1">{product.title}</p>
                        <p className="text-sm text-gray-600">{product.creator}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">CONDITION</p>
                          <p className="font-semibold text-black">{product.condition}</p>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                          Select <ArrowRight size={18} />
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 2: Verify */}
        <AnimatePresence>
          {authStep === 'verify' && selectedProduct && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Product Summary */}
              <div className="flex gap-6 p-8 bg-gray-50 rounded-lg border border-gray-200">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-light text-black mb-2">{selectedProduct.title}</h3>
                  <p className="text-gray-600 mb-4">By {selectedProduct.creator}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Condition:</span>
                      <span className="font-semibold text-black">{selectedProduct.condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold text-black">${(selectedProduct.price / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Steps */}
              <div className="space-y-4">
                <h2 className="text-2xl font-light mb-6">Complete verification</h2>

                <div className="space-y-4">
                  {[
                    { number: 1, title: 'Photo Verification', desc: 'Submit clear photos from multiple angles' },
                    { number: 2, title: 'Serial Number Check', desc: 'Verify authenticity markers and serial numbers' },
                    { number: 3, title: 'Ownership Proof', desc: 'Provide receipt or proof of purchase' },
                    { number: 4, title: 'Provenance', desc: 'Document the item\'s ownership history and origin' },
                    { number: 5, title: 'Attestations on IPFS', desc: 'Store verification records and digital signatures on blockchain' },
                  ].map((step, i) => (
                    <div key={i} className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold">{step.number}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-black mb-1">{step.title}</h4>
                          <p className="text-sm text-gray-600">{step.desc}</p>
                        </div>
                        <Upload className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setAuthStep('select')}
                  className="flex-1 py-3 border-2 border-gray-300 text-black font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleVerify}
                  className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Proceed to Minting
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: Minting */}
        <AnimatePresence>
          {authStep === 'minting' && selectedProduct && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Product Summary */}
              <div className="flex gap-6 p-8 bg-gray-50 rounded-lg border border-gray-200">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-black mb-2">{selectedProduct.title}</h3>
                  <p className="text-gray-600 text-sm">Status: Minting NFT Badge...</p>
                </div>
              </div>

              {/* Mint Progress */}
              <div className="space-y-4">
                <h2 className="text-2xl font-light mb-6">Minting authenticity badge</h2>

                {/* Step 1: Upload to IPFS */}
                <div className="flex gap-4 items-start p-6 bg-white border-2 border-blue-200 rounded-lg">
                  <div className="mt-1">
                    {mintStep === 'uploading' && <Loader className="w-5 h-5 text-blue-600 animate-spin" />}
                    {['saving', 'confirming', 'complete'].includes(mintStep) && <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-black mb-1">Upload to IPFS</p>
                    <p className="text-sm text-gray-600">Encrypting and storing metadata files securely</p>
                  </div>
                </div>

                {/* Step 2: Save Metadata */}
                <div className="flex gap-4 items-start p-6 bg-white border-2 rounded-lg" style={{ borderColor: ['uploading'].includes(mintStep) ? '#e5e7eb' : '#93c5fd' }}>
                  <div className="mt-1">
                    {['uploading'].includes(mintStep) && <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                    {mintStep === 'saving' && <Loader className="w-5 h-5 text-blue-600 animate-spin" />}
                    {['confirming', 'complete'].includes(mintStep) && <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-black mb-1">Save Metadata</p>
                    <p className="text-sm text-gray-600">Registering NFT properties on blockchain</p>
                  </div>
                </div>

                {/* Step 3: Confirm */}
                <div className="flex gap-4 items-start p-6 bg-white border-2 rounded-lg" style={{ borderColor: ['uploading', 'saving'].includes(mintStep) ? '#e5e7eb' : '#93c5fd' }}>
                  <div className="mt-1">
                    {['uploading', 'saving'].includes(mintStep) && <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                    {mintStep === 'confirming' && <Loader className="w-5 h-5 text-blue-600 animate-spin" />}
                    {mintStep === 'complete' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-black mb-1">Confirm Transaction</p>
                    <p className="text-sm text-gray-600">Finalizing NFT mint on-chain</p>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              {mintStep === 'complete' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-green-50 border-2 border-green-200 rounded-lg text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <p className="text-green-700 font-semibold mb-2">NFT Successfully Minted!</p>
                  <p className="text-sm text-green-600">Your authenticity badge is now on the blockchain</p>
                </motion.div>
              )}

              {/* Actions */}
              {mintStep === 'complete' && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setAuthStep('select');
                      setSelectedProduct(null);
                      setMintStep('uploading');
                    }}
                    className="flex-1 py-3 border-2 border-gray-300 text-black font-semibold rounded-lg hover:bg-gray-50 transition"
                  >
                    Authenticate Another Item
                  </button>
                  <Link href="/" className="flex-1">
                    <button className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-black/90 transition">
                      Done
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
