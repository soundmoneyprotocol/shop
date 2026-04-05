'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Camera, DollarSign, Zap, Users, Shield, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SellerGuide() {
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

  const steps = [
    {
      number: 1,
      title: 'Create Your Account',
      description: 'Sign up for a seller account and verify your identity. This takes just 5 minutes.',
      icon: Users,
    },
    {
      number: 2,
      title: 'Set Up Your Shop',
      description: 'Customize your shop name, bio, and profile photo. Let collectors know who you are.',
      icon: Shield,
    },
    {
      number: 3,
      title: 'List Your Products',
      description: 'Add high-quality photos and detailed descriptions. Set competitive prices based on market data.',
      icon: Camera,
    },
    {
      number: 4,
      title: 'Start Selling',
      description: 'Receive orders, ship items, and get paid directly to your bank account within 5-7 days.',
      icon: DollarSign,
    },
    {
      number: 5,
      title: 'Build Your Reputation',
      description: 'Respond to buyers, maintain quality, and watch your seller rating grow.',
      icon: Zap,
    },
    {
      number: 6,
      title: 'Scale Your Business',
      description: 'Use analytics to optimize listings, expand your collection, and increase revenue.',
      icon: CheckCircle,
    },
  ];

  const bestPractices = [
    {
      title: 'Photography Matters',
      description: 'Use clear, well-lit photos from multiple angles. High-quality images increase conversion rates by up to 40%.',
      tips: [
        'Use natural lighting',
        'Show product from multiple angles',
        'Include size comparison if applicable',
        'Highlight authenticity badges',
      ],
    },
    {
      title: 'Write Compelling Descriptions',
      description: 'Be detailed and honest. Highlight condition, rarity, and any special features.',
      tips: [
        'Include brand, year, and condition',
        'Mention any defects upfront',
        'Use bullet points for easy scanning',
        'Add authentication details',
      ],
    },
    {
      title: 'Price Competitively',
      description: 'Use our analytics to understand market rates. Check trending prices for similar items.',
      tips: [
        'Research competitor pricing',
        'Use our price suggestion tool',
        'Consider condition and rarity',
        'Update prices seasonally',
      ],
    },
    {
      title: 'Shipping Excellence',
      description: 'Fast, secure shipping builds trust. Always include tracking and insurance.',
      tips: [
        'Ship within 24-48 hours',
        'Use quality packaging',
        'Include tracking number',
        'Offer insurance options',
      ],
    },
    {
      title: 'Customer Communication',
      description: 'Respond quickly to messages. Professional communication leads to 5-star reviews.',
      tips: [
        'Reply within 24 hours',
        'Be courteous and professional',
        'Address concerns immediately',
        'Follow up after delivery',
      ],
    },
    {
      title: 'Build Your Brand',
      description: 'Create a consistent seller identity. Your reputation is your greatest asset.',
      tips: [
        'Use consistent branding',
        'Share your story',
        'Offer loyalty discounts',
        'Engage with community',
      ],
    },
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
          <span className="text-black font-semibold">Seller Guide</span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-4xl font-light mb-4 text-black">Seller Guide</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Everything you need to know to succeed as a seller on SoundMoney
          </p>
        </motion.div>

        {/* Getting Started Steps */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-black mb-8">Getting Started</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={itemVariants}
                  className="relative bg-white border border-gray-200 rounded-2xl p-8"
                >
                  <div className="absolute top-4 right-4 w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {step.number}
                  </div>

                  <Icon className="w-8 h-8 text-black mb-4" />
                  <h3 className="text-xl font-bold text-black mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Best Practices */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-black mb-8">Best Practices for Success</h2>

          <div className="space-y-8">
            {bestPractices.map((practice, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-8"
              >
                <h3 className="text-xl font-bold text-black mb-3">{practice.title}</h3>
                <p className="text-gray-600 mb-6">{practice.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {practice.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-black mb-8">Common Questions</h2>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-black mb-3">How do I get verified?</h3>
              <p className="text-gray-600">
                New sellers start with basic status. You can earn verification by maintaining positive reviews, responding promptly to buyers, and shipping items as described. Most sellers achieve verified status within their first month.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-black mb-3">What if a buyer isn't satisfied?</h3>
              <p className="text-gray-600">
                We have a fair return and dispute resolution process. Always communicate professionally with buyers first. Most issues can be resolved through open dialogue. If needed, our support team mediates.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-black mb-3">How do I improve my seller rating?</h3>
              <p className="text-gray-600">
                Ratings are based on: accuracy of listings, shipping speed, item condition, customer communication, and overall satisfaction. Focus on these areas and your rating will improve over time.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-black mb-3">Can I sell multiple items at once?</h3>
              <p className="text-gray-600">
                Yes! You can list unlimited products once verified. Use our bulk listing tools to add multiple items efficiently. The more items you sell, the more exposure your shop receives.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-black mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, bank transfers, and cryptocurrency through x402 Agentic Payments. Payouts go directly to your verified bank account or crypto wallet.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-black mb-4">Need More Help?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Our seller support team is available 24/7 to answer questions and help you succeed
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/seller/register" className="btn-primary inline-flex items-center gap-2">
              Start Selling
              <ChevronRight size={20} />
            </Link>
            <Link href="/seller/fees" className="btn-outline inline-flex items-center gap-2">
              View Fee Structure
              <ChevronRight size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
