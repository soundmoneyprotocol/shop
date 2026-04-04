'use client';

import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const MOCK_SELLER = {
  id: '1',
  name: 'SneakerKing',
  storeName: 'SneakerKing Official',
  email: 'seller@example.com',
  phone: '+1 (555) 123-4567',
  verified: true,
  bio: 'Premium sneaker authentication and sales',
  bankAccount: '****1234',
  payoutFrequency: 'weekly',
  country: 'United States',
  city: 'New York',
};

export default function SellerSettings() {
  const [activeSection, setActiveSection] = useState<'profile' | 'store' | 'payments' | 'security'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: MOCK_SELLER.name,
    storeName: MOCK_SELLER.storeName,
    email: MOCK_SELLER.email,
    phone: MOCK_SELLER.phone,
    bio: MOCK_SELLER.bio,
    country: MOCK_SELLER.country,
    city: MOCK_SELLER.city,
    password: '',
    confirmPassword: '',
    bankAccount: MOCK_SELLER.bankAccount,
    payoutFrequency: MOCK_SELLER.payoutFrequency,
    notificationsEmail: true,
    notificationsSMS: false,
    twoFactorAuth: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings updated successfully');
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/seller/dashboard"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 transition mb-6 text-sm"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-light text-gray-900">Settings</h1>
        </div>
      </div>

      {/* Settings Container */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="md:col-span-1">
            <div className="flex flex-col gap-2 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4">
              <button
                onClick={() => setActiveSection('profile')}
                className={`text-left px-4 py-2 rounded text-sm transition ${
                  activeSection === 'profile'
                    ? 'bg-gray-900 text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveSection('store')}
                className={`text-left px-4 py-2 rounded text-sm transition ${
                  activeSection === 'store'
                    ? 'bg-gray-900 text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Store
              </button>
              <button
                onClick={() => setActiveSection('payments')}
                className={`text-left px-4 py-2 rounded text-sm transition ${
                  activeSection === 'payments'
                    ? 'bg-gray-900 text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Payments
              </button>
              <button
                onClick={() => setActiveSection('security')}
                className={`text-left px-4 py-2 rounded text-sm transition ${
                  activeSection === 'security'
                    ? 'bg-gray-900 text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Security
              </button>
            </div>
          </div>

          {/* Settings Content */}
          <div className="md:col-span-3">
            <form onSubmit={handleSaveChanges} className="border border-gray-200 rounded p-6">
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>

                    {MOCK_SELLER.verified && (
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <p className="text-sm text-green-700">
                          ✓ Your account is verified
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Store Section */}
              {activeSection === 'store' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Store Settings</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Store Name
                      </label>
                      <input
                        type="text"
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Store Description
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Tell customers about your store..."
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded p-4 mt-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Store Appearance</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Customize your store's appearance and branding
                      </p>
                      <button
                        type="button"
                        className="text-sm border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 text-gray-900"
                      >
                        Upload Logo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Payments Section */}
              {activeSection === 'payments' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Settings</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Bank Account
                      </label>
                      <input
                        type="text"
                        value={formData.bankAccount}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 text-gray-700"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Contact support to update bank details
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Payout Frequency
                      </label>
                      <select
                        name="payoutFrequency"
                        value={formData.payoutFrequency}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded p-4 mt-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Payment History</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        View your past payments and invoices
                      </p>
                      <button
                        type="button"
                        className="text-sm border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 text-gray-900"
                      >
                        View History
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter new password"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm new password"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">
                        Two-Factor Authentication
                      </h3>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="twoFactorAuth"
                          checked={formData.twoFactorAuth}
                          onChange={handleInputChange}
                          className="w-4 h-4 border border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          Enable two-factor authentication for extra security
                        </span>
                      </label>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">
                        Notifications
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="notificationsEmail"
                            checked={formData.notificationsEmail}
                            onChange={handleInputChange}
                            className="w-4 h-4 border border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">
                            Email notifications for sales and orders
                          </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="notificationsSMS"
                            checked={formData.notificationsSMS}
                            onChange={handleInputChange}
                            className="w-4 h-4 border border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">
                            SMS notifications for important updates
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-6 py-2 border border-gray-300 rounded text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
