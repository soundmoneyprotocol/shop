'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Store,
  Gavel,
  AlertCircle,
  CreditCard,
  DollarSign,
  ChevronRight,
  ArrowDown,
  Settings,
  LogOut,
  Plus,
  X,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const MOCK_USER = {
  id: '1',
  name: 'John Collector',
  email: 'john@example.com',
  joinedDate: 'March 2024',
  isSeller: true,
};

const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    item: 'Jordan 1 Retro High OG',
    seller: 'SneakerKing',
    price: 159.99,
    status: 'Delivered',
    date: '2024-04-01',
    image: '/Air-Jordan-1.png?w=100',
  },
  {
    id: 'ORD-002',
    item: 'Nike Air Force 1',
    seller: 'VintageVibe',
    price: 89.99,
    status: 'In Transit',
    date: '2024-03-25',
    image: '/Air-Jordan-1.png?w=100',
  },
];

const MOCK_BIDS = [
  {
    id: 'BID-001',
    item: 'Yeezy 350 V2',
    seller: 'SneakerCred',
    yourBid: 180.00,
    highestBid: 185.00,
    status: 'Outbid',
    endsAt: '2024-04-10',
  },
  {
    id: 'BID-002',
    item: 'Travis Scott Jordan',
    seller: 'Supreme Store',
    yourBid: 290.00,
    highestBid: 290.00,
    status: 'Leading',
    endsAt: '2024-04-15',
  },
];

const MOCK_PAYMENT_METHODS = [
  {
    id: 'PM-001',
    type: 'credit_card',
    last4: '4242',
    brand: 'Visa',
    expiryDate: '12/25',
    isDefault: true,
  },
  {
    id: 'PM-002',
    type: 'bank_account',
    accountName: 'Checking Account',
    last4: '6789',
    isDefault: false,
  },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'seller' | 'bids' | 'disputes' | 'payments' | 'crypto'>('orders');
  const [showAddPayment, setShowAddPayment] = useState(false);

  const tabs = [
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'seller', label: 'Seller Account', icon: Store },
    { id: 'bids', label: 'Bids & Auctions', icon: Gavel },
    { id: 'disputes', label: 'Disputes', icon: AlertCircle },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'crypto', label: 'Crypto & USDC', icon: DollarSign },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <main className="min-h-screen bg-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-light mb-2">My Account</h1>
              <p className="text-sm sm:text-base text-gray-600">{MOCK_USER.name}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/deposit" className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">
                <ArrowDown size={16} />
                Deposit
              </Link>
              <Link
                href="/seller/settings"
                className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-lg text-sm hover:bg-black/5 transition"
              >
                <Settings size={16} />
                Settings
              </Link>
              <button className="flex items-center gap-2 px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg text-sm hover:bg-red-50 transition">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 overflow-x-auto"
        >
          <div className="flex gap-2 min-w-min">
            {tabs.map((tab) => {
              const Icon = tab.icon as any;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-sm transition ${
                    activeTab === tab.id
                      ? 'bg-black text-white'
                      : 'border border-gray-300 text-gray-700 hover:border-black'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-black">Your Orders</h2>
              {MOCK_ORDERS.map((order) => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img src={order.image} alt={order.item} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-black">{order.item}</h3>
                          <p className="text-sm text-gray-600">from {order.seller}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                        <span>${order.price.toFixed(2)}</span>
                        <span>{order.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Seller Account Tab */}
          {activeTab === 'seller' && (
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-black">Your Seller Account</h2>
                <Link
                  href="/seller/dashboard"
                  className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-lg text-sm hover:bg-black/5 transition"
                >
                  Manage <ChevronRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">Total Sales</p>
                  <p className="text-3xl font-bold text-black">234</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">Seller Rating</p>
                  <p className="text-3xl font-bold text-black">4.8★</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">Total Earnings</p>
                  <p className="text-3xl font-bold text-green-600">$12.5K</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  You are a verified seller with access to all seller features. Visit your dashboard to manage auctions, inventory, and earnings.
                </p>
              </div>
            </motion.div>
          )}

          {/* Bids & Auctions Tab */}
          {activeTab === 'bids' && (
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-black">Your Bids & Auctions</h2>
              {MOCK_BIDS.map((bid) => (
                <div key={bid.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-black">{bid.item}</h3>
                      <p className="text-sm text-gray-600">from {bid.seller}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                        bid.status === 'Leading'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {bid.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Your Bid</p>
                      <p className="font-semibold text-black">${bid.yourBid.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Highest Bid</p>
                      <p className="font-semibold text-black">${bid.highestBid.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Ends At</p>
                      <p className="font-semibold text-black">{bid.endsAt}</p>
                    </div>
                    <div className="text-right">
                      <button className="px-3 py-1 border-2 border-black rounded text-xs font-semibold hover:bg-black/5 transition">
                        Bid Again
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Disputes Tab */}
          {activeTab === 'disputes' && (
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-black">Disputes & Settlements</h2>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-8 text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">No active disputes</p>
                <p className="text-sm text-gray-500">If you have an issue with an order or transaction, you can file a dispute here.</p>
              </div>
              <button className="w-full px-4 py-3 border-2 border-black rounded-lg font-semibold hover:bg-black/5 transition flex items-center justify-center gap-2">
                <Plus size={18} />
                File a Dispute
              </button>
            </motion.div>
          )}

          {/* Payment Methods Tab */}
          {activeTab === 'payments' && (
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-black">Payment Methods</h2>
                <button
                  onClick={() => setShowAddPayment(!showAddPayment)}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-lg text-sm hover:bg-black/5 transition"
                >
                  <Plus size={16} />
                  Add Payment
                </button>
              </div>

              {showAddPayment && (
                <div className="bg-gray-50 border-2 border-black rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Add Payment Method</h3>
                    <button onClick={() => setShowAddPayment(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <button className="w-full p-3 border-2 border-gray-300 rounded-lg text-left hover:border-black transition">
                      💳 Add Credit/Debit Card
                    </button>
                    <button className="w-full p-3 border-2 border-gray-300 rounded-lg text-left hover:border-black transition">
                      🏦 Connect Bank Account
                    </button>
                    <button className="w-full p-3 border-2 border-gray-300 rounded-lg text-left hover:border-black transition">
                      🔐 Connect via Privy
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {MOCK_PAYMENT_METHODS.map((method) => (
                  <div key={method.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {method.type === 'credit_card' ? '💳' : '🏦'}
                        </span>
                        <div>
                          <p className="font-semibold text-black">
                            {method.type === 'credit_card'
                              ? `${method.brand} ending in ${method.last4}`
                              : method.accountName}
                          </p>
                          {method.type === 'credit_card' && (
                            <p className="text-sm text-gray-600">Expires {method.expiryDate}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isDefault && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                          Default
                        </span>
                      )}
                      <button className="px-3 py-1 text-red-600 text-xs font-semibold hover:bg-red-50 rounded transition">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Crypto & USDC Tab */}
          {activeTab === 'crypto' && (
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-black">Crypto & USDC & BEZY</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">🔐</span>
                    <div>
                      <h3 className="font-bold text-black">Privy Integration</h3>
                      <p className="text-sm text-gray-700">Secure crypto wallet</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                    Connect Privy Wallet
                  </button>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">💵</span>
                    <div>
                      <h3 className="font-bold text-black">Buy USDC</h3>
                      <p className="text-sm text-gray-700">Stablecoin payments</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                    Buy USDC
                  </button>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">⭐</span>
                    <div>
                      <h3 className="font-bold text-black">Buy BEZY</h3>
                      <p className="text-sm text-gray-700">Creator rewards token</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition">
                    Buy BEZY
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-black">About Crypto Payments</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Buy crypto securely with Privy integration</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Use USDC for instant, low-cost payments</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Earn BEZY rewards for platform participation</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Access blockchain escrow for secure transactions</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Real-time settlement to your wallet</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
