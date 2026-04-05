'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Users, Shield, Zap } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const features = [
    {
      icon: ShoppingBag,
      title: 'Create Your Shop',
      description: 'List your products and reach millions of collectors worldwide',
    },
    {
      icon: Users,
      title: 'x402 Agentic Payments',
      description: 'Keep 86-89% of revenue. No middlemen, just blockchain escrow',
    },
    {
      icon: Shield,
      title: 'Authenticity Badges',
      description: 'Mint Badges for each product to verify ownership and authenticity',
    },
    {
      icon: Zap,
      title: 'Real-time Trading',
      description: 'Live inventory, instant payments, and community governance',
    },
  ];

  return (
    <main className="overflow-hidden bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img
                src="/sm-bw-logo.png"
                alt="SoundMoney"
                className="h-8 w-8 object-contain"
              />
              <span className="hidden sm:inline text-xl font-light text-black">SoundMoney</span>
            </div>
            <div className="flex gap-2 sm:gap-4">
              <Link href="/marketplace" className="btn-primary px-3 sm:px-6 text-sm sm:text-base">
                Explore
              </Link>
              <Link href="/seller/register" className="btn-secondary px-3 sm:px-6 text-sm sm:text-base">
                Sell
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-white to-green-50 -z-10" />
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />

        <motion.div
          className="max-w-5xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl sm:text-7xl font-light mb-6 gradient-text"
            variants={itemVariants}
          >
            The Creator Marketplace
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Sell sneakers, clothing, vinyl, cd's and cassettes directly to fans. Keep more revenue. Own your community.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
            <Link href="/marketplace" className="btn-primary flex items-center justify-center gap-2">
              Start Shopping <ArrowRight size={20} />
            </Link>
            <Link href="/seller/register" className="btn-outline flex items-center justify-center gap-2">
              Become a Creator
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div className="mt-16 grid grid-cols-3 gap-8" variants={itemVariants}>
            <div>
              <div className="text-4xl font-bold text-green-600">10K+</div>
              <div className="text-gray-600">Creators</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600">100K+</div>
              <div className="text-gray-600">Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600">$50M+</div>
              <div className="text-gray-600">Annual GMV</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-light mb-4">Why Choose SoundMoney?</h2>
            <p className="text-xl text-gray-600">Everything you need to build your creator business</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  className="card-hover p-8"
                  variants={itemVariants}
                >
                  <Icon className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-light mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-8">Join thousands of creators earning directly from their fans</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace" className="btn-primary px-3 sm:px-6 text-sm sm:text-base">
                Browse Products
              </Link>
              <Link href="/seller/register" className="btn-outline">
                List Your First Item
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-300 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">SoundMoney</h3>
              <p className="text-gray-600 text-sm">Creator marketplace with blockchain escrow</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/marketplace" className="hover:text-green-600">Marketplace</Link></li>
                <li><Link href="/categories" className="hover:text-green-600">Categories</Link></li>
                <li><Link href="/trending" className="hover:text-green-600">Trending</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sellers</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/seller/register" className="hover:text-green-600">Become Seller</Link></li>
                <li><Link href="/seller/guide" className="hover:text-green-600">Seller Guide</Link></li>
                <li><Link href="/seller/fees" className="hover:text-green-600">Fee Structure</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/privacy" className="hover:text-green-600">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-green-600">Terms</Link></li>
                <li><Link href="/contact" className="hover:text-green-600">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-300 pt-8 text-center text-gray-600 text-sm">
            <p>© 2026 SoundMoney. All rights reserved. Powered by blockchain technology.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
