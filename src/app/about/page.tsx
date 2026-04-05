'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function About() {
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

  const stakeholders = [
    {
      name: 'Artists & Creators',
      actions: [
        'Monetize merchandise directly from fans',
        'Retain 86-89% revenue per sale',
        'Authentic verification for all products',
        'Build sustainable income from your fanbase',
      ],
    },
    {
      name: 'Fans & Collectors',
      actions: [
        'Discover exclusive artist merchandise',
        'Support creators directly',
        'Buy authenticated, verified products',
        'Access limited editions and rare drops',
      ],
    },
    {
      name: 'Resellers & Traders',
      actions: [
        'Trade artist merchandise in secondary market',
        'Fair pricing with real-time valuations',
        'Secure escrow for all transactions',
        'Build trading portfolios by artist',
      ],
    },
    {
      name: 'SoundMoney Community',
      actions: [
        'Governance token holders vote on policy',
        'Share in platform revenue',
        'Shape marketplace direction',
        'Earn rewards from ecosystem growth',
      ],
    },
  ];

  const protocolFeatures = [
    {
      name: 'Releases',
      description: 'Brands list their merchandise on SoundMoney. Products include physical merchandise, limited editions, digital items, or exclusive access passes. Once listed, products establish market value and authenticity.',
      platform: '14%',
      artist: '86%',
    },
    {
      name: 'Primary Sale',
      description: 'When a fan purchases directly from an artist, the transaction is secure and authenticated. Artists keep 86-89% of revenue. SoundMoney handles verification, payment processing, and coordination.',
      platform: '11-14%',
      artist: '86-89%',
    },
    {
      name: 'Secondary Market (Resale)',
      description: 'Authenticated products can be resold between collectors and fans. Secondary market transactions are verified through our escrow system to ensure authenticity and fair pricing across the community.',
      platform: '8%',
      artist: '92%',
    },
    {
      name: 'Community Votes',
      description: 'Token holders vote on marketplace policies, fees, and new features. Platform decisions are made by the community. This voting mechanism ensures fair governance and keeps the marketplace aligned with user interests.',
      platform: '100%',
      artist: '0%',
    },
    {
      name: 'Artist Verification',
      description: 'All artists on SoundMoney go through identity and authenticity verification. Verified artist badges appear on all product listings. This builds buyer confidence and prevents counterfeits from entering the marketplace.',
      platform: '100%',
      artist: '0%',
    },
  ];

  const hideFeeForFeatures = ['Community Votes', 'Artist Verification'];

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl sm:text-6xl font-light mb-4 text-black">SoundMoney Market</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            The Authentic marketplace for artist merchandise. Like StockX for creators.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="card mb-8" variants={itemVariants}>
            <h2 className="text-3xl font-light mb-4">Our Mission</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              SoundMoney is building an authentic marketplace where artists own their success. We eliminate middlemen,
              maximize artist earnings, and create a trusted platform for buying, selling, and trading artist merchandise.
              Every transaction is verified and secure. Every artist is authenticated. Every sale is fair. Agentic x402 payments Price Discovery.
            </p>
          </motion.div>
        </motion.div>

        {/* Stakeholders Section */}
        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 className="text-3xl font-light mb-8" variants={itemVariants}>
            Our Community
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stakeholders.map((stakeholder, idx) => (
              <motion.div key={idx} className="card" variants={itemVariants}>
                <h3 className="text-2xl font-bold text-black mb-6">{stakeholder.name}</h3>
                <ul className="space-y-3">
                  {stakeholder.actions.map((action, actionIdx) => (
                    <li key={actionIdx} className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg mt-1">✓</span>
                      <span className="text-gray-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Protocol Features */}
        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 className="text-3xl font-light mb-8" variants={itemVariants}>
            How It Works
          </motion.h2>

          <div className="space-y-4">
            {protocolFeatures.map((feature, idx) => (
              <motion.div key={idx} className="card" variants={itemVariants}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-black mb-2">{feature.name}</h3>
                    <p className="text-gray-700">{feature.description}</p>
                  </div>
                  {!hideFeeForFeatures.includes(feature.name) && (
                    <div className="flex flex-col gap-4 md:text-right min-w-[150px]">
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">Platform Fee</p>
                        <p className="text-2xl font-bold text-gray-600">{feature.platform}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">Artist Keeps</p>
                        <p className="text-2xl font-bold text-green-600">{feature.artist}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Differences Section */}
        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 className="text-3xl font-light mb-8" variants={itemVariants}>
            Why SoundMoney
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Higher Artist Payouts',
                description: 'Keep 86-89% of revenue. Compare that to traditional marketplaces taking 30-50%. Your fans support you directly.',
              },
              {
                title: 'Authenticated Products',
                description: 'Every item is verified. Prevents counterfeits. Buyers can trust what they\'re purchasing. Resale values stay high.',
              },
              {
                title: 'Direct Artist Control',
                description: 'You decide pricing, drops, and exclusivity. No gatekeepers. No approval delays. Launch products whenever you want.',
              },
              {
                title: 'Secondary Market',
                description: 'Products can be bought and sold between collectors. Real market prices. Resellers help establish fair value for all artists.',
              },
              {
                title: 'Secure Escrow',
                description: 'All transactions are escrow-protected. Buyers and sellers are both protected. Money is held securely until delivery.',
              },
              {
                title: 'Global Community',
                description: 'Connect with fans worldwide. No geographic restrictions. Your merchandise reaches the entire SoundMoney community.',
              },
            ].map((feature, idx) => (
              <motion.div key={idx} className="card" variants={itemVariants}>
                <h3 className="text-lg font-bold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="card bg-white border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-light mb-4">Ready to Launch Your Shop?</h2>
            <p className="text-gray-700 mb-8">Join hundreds of artists earning directly from their fanbase. No middlemen. No approval delays. Just you and your fans.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace" className="btn-outline">
                Browse Merchandise
              </Link>
              <Link href="/seller/register" className="btn-outline">
                Become a Creator
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
