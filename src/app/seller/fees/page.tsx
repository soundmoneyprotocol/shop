'use client';

import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SellerFees() {
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

  const feeStructure = [
    {
      title: 'Platform Fee',
      percentage: '11%',
      description: 'Transaction processing and marketplace maintenance',
    },
    {
      title: 'Payment Processing',
      percentage: '2.9% + $0.30',
      description: 'Stripe payment processing fee',
    },
    {
      title: 'Artist Keeps',
      percentage: '86-89%',
      description: 'Net revenue after all fees',
    },
  ];

  const benefits = [
    'Direct access to millions of collectors',
    'Verified seller badge and authentication',
    'Fast and reliable shipping support',
    'Real-time sales analytics dashboard',
    'Community marketplace exposure',
    '24/7 seller support',
    'Secure blockchain escrow',
    'No monthly subscription fees',
  ];

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <motion.div
          className="mb-8 text-gray-600 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Link href="/seller/dashboard" className="hover:text-black transition">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black font-semibold">Fee Structure</span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-light mb-4 text-black">Fee Structure</h1>
          <p className="text-lg text-gray-600">
            Transparent pricing so you know exactly what you earn
          </p>
        </motion.div>

        {/* Fee Breakdown */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16 space-y-6"
        >
          {feeStructure.map((fee, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white border border-gray-200 rounded-2xl p-8"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">{fee.title}</h3>
                  <p className="text-gray-600">{fee.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-black">{fee.percentage}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Example Calculation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16 bg-gray-50 border border-gray-200 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-black mb-8">Example: $100 Sale</h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-300">
              <span className="text-gray-700">Sale Amount</span>
              <span className="font-semibold text-black">$100.00</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-300">
              <span className="text-gray-700">Platform Fee (11%)</span>
              <span className="font-semibold text-black">-$11.00</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-300">
              <span className="text-gray-700">Payment Processing (2.9% + $0.30)</span>
              <span className="font-semibold text-black">-$3.20</span>
            </div>

            <div className="flex justify-between items-center pt-4 bg-white rounded-lg p-4">
              <span className="text-lg font-bold text-black">You Receive</span>
              <span className="text-2xl font-bold text-green-600">$84.80</span>
            </div>
          </div>
        </motion.div>

        {/* Why Sell With Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-black mb-8">Why Sell on SoundMoney?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check size={16} className="text-white" />
                </div>
                <span className="text-gray-700 text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white border border-gray-200 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-black mb-4">Ready to Start Selling?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of creators earning fair revenue on SoundMoney
          </p>
          <Link href="/seller/register" className="btn-primary inline-flex items-center gap-2">
            Create Your Shop
            <ChevronRight size={20} />
          </Link>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 space-y-6"
        >
          <h2 className="text-2xl font-bold text-black mb-8">Frequently Asked Questions</h2>

          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-black mb-3">When do I get paid?</h3>
            <p className="text-gray-600">
              Payments are processed within 1-3 business days after your customer confirms delivery. Funds are transferred directly to your verified bank account.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-black mb-3">Are there any hidden fees?</h3>
            <p className="text-gray-600">
              No. The fees shown above are the only charges you'll incur. We believe in complete transparency—no subscription fees, no hidden costs, just fair pricing.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-black mb-3">Can I adjust my prices?</h3>
            <p className="text-gray-600">
              Yes, you can update product prices anytime from your seller dashboard. Price changes take effect immediately for new orders.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-black mb-3">What about refunds?</h3>
            <p className="text-gray-600">
              If a customer requests a refund, we handle the chargeback through our escrow system. You'll be notified immediately, and the fee will be reversed if applicable.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-black mb-3">How do x402 Agentic Payments work?</h3>
            <p className="text-gray-600">
              x402 Agentic Payments enable autonomous agents and creators to transact directly on blockchain rails. You keep 86-89% of revenue with zero middlemen interference—just secure, instant settlement via blockchain escrow.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
