'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const MOCK_SELLER = {
  id: '1',
  name: 'SneakerKing',
  email: 'seller@example.com',
  verified: true,
  rating: 4.8,
  reviews: 127,
  storeName: 'SneakerKing Premium',
  bio: 'Curated sneaker collection for collectors',
  phone: '+1 (555) 123-4567',
  location: 'Los Angeles, CA',
  joinedDate: 'March 2024',
};

export default function SellerSettings() {
  const [formData, setFormData] = useState({
    storeName: MOCK_SELLER.storeName,
    bio: MOCK_SELLER.bio,
    phone: MOCK_SELLER.phone,
    location: MOCK_SELLER.location,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings updated successfully!');
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/seller/dashboard" className="text-gray-600 hover:text-black transition">
                Dashboard
              </Link>
              <ChevronRight size={18} className="text-gray-400" />
              <span className="text-black font-semibold">Settings</span>
            </div>
            <h1 className="text-4xl font-light mb-2">Seller Settings</h1>
            <p className="text-gray-600">Manage your store and account information</p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-8">
            {/* Verified Seller Status */}
            <motion.div
              variants={itemVariants}
            >
              <div className="bg-white border-0 p-8 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-black mb-2">Verified Seller</h2>
                    <p className="text-gray-600 mb-4">
                      Your account is verified and in good standing. You can sell unlimited items and have access to all seller features.
                    </p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Identity verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Email verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Payment method confirmed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Seller rating: {MOCK_SELLER.rating} stars ({MOCK_SELLER.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Store Information */}
            <motion.div
              variants={itemVariants}
            >
              <form onSubmit={handleSave} className="bg-white border-0 p-8 rounded-2xl space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-6">Store Information</h2>
                </div>

                {/* Store Name */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Store Name</label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    className="input-base"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Store Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="input-base resize-none"
                  />
                  <p className="text-xs text-gray-600 mt-1">Tell customers about your store</p>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="input-base"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <button type="submit" className="btn-primary w-full">
                  Save Changes
                </button>
              </form>
            </motion.div>

            {/* Account Information */}
            <motion.div
              variants={itemVariants}
            >
              <div className="bg-white border-0 p-8 rounded-2xl space-y-4">
                <h2 className="text-2xl font-bold text-black mb-6">Account Information</h2>
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1">Name</p>
                  <p className="text-black font-semibold">{MOCK_SELLER.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1">Email</p>
                  <p className="text-black font-semibold">{MOCK_SELLER.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1">Member Since</p>
                  <p className="text-black font-semibold">{MOCK_SELLER.joinedDate}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
