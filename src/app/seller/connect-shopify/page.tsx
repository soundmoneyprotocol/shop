'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, Loader, Link as LinkIcon, Unlink } from 'lucide-react';
import Link from 'next/link';

interface ShopifyStore {
  shop_name: string;
  connected_at: string;
  product_count: number;
}

export default function ConnectShopifyPage() {
  const [shopUrl, setShopUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stores, setStores] = useState<ShopifyStore[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);

  // Load connected stores on mount
  useEffect(() => {
    fetchConnectedStores();
  }, []);

  const fetchConnectedStores = async () => {
    try {
      setLoadingStores(true);
      const response = await fetch('/api/shopify/stores');
      const result = await response.json();
      if (result.success) {
        setStores(result.data.stores || []);
      }
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    } finally {
      setLoadingStores(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!shopUrl) {
      setError('Please enter a Shopify store URL');
      return;
    }

    if (!shopUrl.includes('myshopify.com')) {
      setError('Please enter a valid Shopify store URL (e.g., mystore.myshopify.com)');
      return;
    }

    setLoading(true);
    try {
      // In production, you'd redirect to Shopify OAuth flow
      // For now, show a placeholder
      setSuccess('Shopify OAuth integration would redirect here. Contact Casmir to complete setup.');
      setShopUrl('');
    } catch (err) {
      setError('Failed to connect store. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (shopName: string) => {
    setSyncing(true);
    setError(null);
    try {
      const response = await fetch('/api/shopify/sync-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopName })
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(`Synced ${result.data.synced} products successfully!`);
        fetchConnectedStores();
      } else {
        setError(result.error || 'Sync failed');
      }
    } catch (err) {
      setError('Failed to sync products. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async (shopName: string) => {
    if (!confirm(`Disconnect ${shopName}? Products will remain in your SoundMoney shop.`)) {
      return;
    }

    try {
      const response = await fetch('/api/shopify/disconnect', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopName })
      });

      const result = await response.json();
      if (result.success) {
        setSuccess('Store disconnected');
        fetchConnectedStores();
      } else {
        setError(result.error || 'Disconnect failed');
      }
    } catch (err) {
      setError('Failed to disconnect store');
    }
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <motion.div className="mb-8 text-gray-600 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link href="/seller/dashboard" className="hover:text-black transition">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black">Connect Shopify</span>
        </motion.div>

        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-light mb-4 text-black">Connect Your Shopify Store</h1>
          <p className="text-gray-600 text-lg">
            Sync your existing products and inventory to SoundMoney. Reach new customers while keeping your shop unified.
          </p>
        </motion.div>

        {/* Error/Success Messages */}
        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            className="mb-6 p-4 bg-green-50 border-l-4 border-green-600 rounded"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-700">{success}</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Connection Form */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-light mb-6 text-black">Add New Store</h2>

            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Shopify Store URL
                </label>
                <input
                  type="text"
                  placeholder="e.g., mystore.myshopify.com"
                  value={shopUrl}
                  onChange={(e) => setShopUrl(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black outline-none transition"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Your store URL can be found in your Shopify admin settings
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
                {loading ? 'Connecting...' : 'Connect to Shopify'}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-black mb-4">How it works</h3>
              <ol className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-3">
                  <span className="font-bold text-black flex-shrink-0">1.</span>
                  <span>Click "Connect to Shopify"</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-black flex-shrink-0">2.</span>
                  <span>Authorize SoundMoney to access your store</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-black flex-shrink-0">3.</span>
                  <span>Review and sync your products</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-black flex-shrink-0">4.</span>
                  <span>Products appear in your SoundMoney shop</span>
                </li>
              </ol>
            </div>
          </motion.div>

          {/* Connected Stores */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="text-2xl font-light mb-6 text-black">Connected Stores</h2>

            {loadingStores ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-5 h-5 animate-spin text-gray-600" />
              </div>
            ) : stores.length === 0 ? (
              <p className="text-gray-600 py-8 text-center">No connected stores yet</p>
            ) : (
              <div className="space-y-4">
                {stores.map((store) => (
                  <div key={store.shop_name} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-black">{store.shop_name}</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          Connected {new Date(store.connected_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                        {store.product_count} products
                      </span>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleSync(store.shop_name)}
                        disabled={syncing}
                        className="flex-1 px-3 py-2 bg-black text-white text-sm font-semibold rounded hover:bg-black/90 disabled:opacity-50 transition"
                      >
                        {syncing ? 'Syncing...' : 'Sync Products'}
                      </button>
                      <button
                        onClick={() => handleDisconnect(store.shop_name)}
                        className="flex-1 px-3 py-2 border-2 border-red-600 text-red-600 text-sm font-semibold rounded hover:bg-red-50 transition"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Benefits Section */}
        <motion.div
          className="mt-16 bg-blue-50 border-l-4 border-blue-600 p-8 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-2xl font-light mb-4 text-blue-900">Why Connect Your Shopify Store?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <Check className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Expand Your Reach</h3>
                <p className="text-sm text-blue-700">Access SoundMoney's community of collectors and music fans</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Check className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Unified Inventory</h3>
                <p className="text-sm text-blue-700">Manage stock across both platforms from one dashboard</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Check className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Higher Payouts</h3>
                <p className="text-sm text-blue-700">Keep 86-89% of revenue vs. traditional marketplace fees</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Check className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Authentication</h3>
                <p className="text-sm text-blue-700">All products verified with authenticity badges</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
