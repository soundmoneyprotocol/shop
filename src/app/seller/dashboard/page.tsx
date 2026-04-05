'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Package,
  TrendingUp,
  Users,
  AlertCircle,
  Edit2,
  Trash2,
  Eye,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Mock seller data
const MOCK_SELLER = {
  id: '1',
  name: 'SneakerKing',
  email: 'seller@example.com',
  verified: true,
  rating: 4.8,
  reviews: 127,
  totalEarnings: 45230,
  monthlyEarnings: 12540,
  totalSales: 234,
};

// Mock products
const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Jordan 1 Retro High OG',
    price: 15999,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100',
    stock: 5,
    sold: 23,
    rating: 4.8,
    reviews: 127,
    status: 'active',
    createdAt: '2024-04-01',
  },
  {
    id: '2',
    title: 'Nike Air Force 1',
    price: 11999,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100',
    stock: 12,
    sold: 45,
    rating: 4.6,
    reviews: 89,
    status: 'active',
    createdAt: '2024-03-15',
  },
];

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'create'>('overview');
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: 'sneakers',
    image: '',
    hasNFT: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      title: formData.title,
      price: parseInt(formData.price) * 100,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100',
      stock: parseInt(formData.stock),
      sold: 0,
      rating: 5.0,
      reviews: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setProducts([newProduct, ...products]);
    setFormData({
      title: '',
      description: '',
      price: '',
      stock: '',
      category: 'sneakers',
      image: '',
      hasNFT: false,
    });
    setActiveTab('products');
    toast.success('Product created successfully!');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success('Product deleted');
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-light mb-2">Seller Dashboard</h1>
              <p className="text-gray-600">Manage your products and track sales</p>
            </div>
            <button
              onClick={() => setActiveTab('create')}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              List New Product
            </button>
          </div>

          {/* Seller Info Card */}
          <motion.div className="card" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">SK</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{MOCK_SELLER.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    {MOCK_SELLER.verified && <span className="badge badge-success text-xs">Verified Seller</span>}
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <span>★</span>
                      {MOCK_SELLER.rating} ({MOCK_SELLER.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <Link href="/seller/settings" className="btn-outline flex items-center gap-2">
                <Settings size={18} />
                Settings
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        {activeTab === 'overview' && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                label: 'Total Earnings',
                value: `$${(MOCK_SELLER.totalEarnings / 100).toFixed(2)}`,
                icon: TrendingUp,
              },
              {
                label: 'This Month',
                value: `$${(MOCK_SELLER.monthlyEarnings / 100).toFixed(2)}`,
                icon: Package,
              },
              {
                label: 'Total Sales',
                value: MOCK_SELLER.totalSales,
                icon: Users,
              },
            ].map((stat, i) => {
              const Icon = stat.icon;
              const isMonetary = stat.label.includes("Earnings") || stat.label.includes("This Month") || stat.label.includes("Sales");
              return (
                <motion.div key={i} className="card" variants={itemVariants}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                      <p className={`text-3xl font-bold ${isMonetary ? 'text-green-600' : 'text-black'}`}>{stat.value}</p>
                    </div>
                    <Icon className="w-8 h-8 text-green-600/40" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          className="mb-8 flex gap-4 border-b border-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {['overview', 'products', 'create'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 px-2 font-semibold transition-colors ${
                activeTab === tab
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { type: 'sale', item: 'Jordan 1 Retro', amount: 159.99, time: '2 hours ago' },
                  { type: 'review', item: 'Nike Air Force 1', rating: 5, time: '5 hours ago' },
                  { type: 'sale', item: 'Jordan 1 Retro', amount: 159.99, time: '1 day ago' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between pb-3 border-b border-gray-300 last:border-0">
                    <div>
                      <p className="font-semibold capitalize text-black">{activity.type}</p>
                      <p className="text-sm text-gray-600">{activity.item}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${activity.type === 'sale' ? 'text-green-600' : 'text-black'}`}>
                        {activity.type === 'sale' ? `+$${activity.amount}` : `★${activity.rating}`}
                      </p>
                      <p className="text-sm text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {products.length > 0 ? (
              <div className="grid gap-6">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    className="card flex items-center justify-between hover:border-green-600 transition"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2 text-black">{product.title}</h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-green-600 font-semibold">${(product.price / 100).toFixed(2)}</span>
                          <span className="text-gray-600">
                            Stock: <span className="font-semibold text-black">{product.stock}</span>
                          </span>
                          <span className="text-gray-600">
                            Sold: <span className="font-semibold text-black">{product.sold}</span>
                          </span>
                          <span className="flex items-center gap-1 text-gray-600">
                            <span>★</span>
                            {product.rating} ({product.reviews})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        title="View"
                        className="p-2 hover:bg-gray-200 transition"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        title="Edit"
                        className="p-2 hover:bg-gray-200 transition"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 hover:bg-red-100 text-red-600 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="card text-center py-12">
                <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">No products yet</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="btn-primary inline-block"
                >
                  Create Your First Product
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Create Product Tab */}
        {activeTab === 'create' && (
          <motion.form
            onSubmit={handleCreateProduct}
            className="card max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-8 text-black">List New Product</h2>

            <div className="space-y-6">
              {/* Product Title */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Product Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Jordan 1 Retro High OG"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-base"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Description</label>
                <textarea
                  name="description"
                  placeholder="Describe your product in detail..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-base resize-none"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-base"
                  >
                    <option value="apparel">Apparel</option>
                    <option value="sneakers">Sneakers</option>
                    <option value="collectibles">Collectibles</option>
                    <option value="retro">Retro</option>
                    <option value="vinyl">Vinyl</option>
                    <option value="cassettes">Cassettes</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Price (USD) *</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="input-base"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="1"
                  className="input-base"
                />
              </div>

              {/* Collectible Option */}
              <div className="bg-green-50 p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasNFT"
                    checked={formData.hasNFT}
                    onChange={handleInputChange}
                    className="w-5 h-5 border-green-300"
                  />
                  <span className="font-semibold text-black">Mint Authenticity Collectible for each purchase</span>
                </label>
                <p className="text-sm text-gray-600 mt-2 ml-8">
                  Customers will receive a collectible token proving ownership and authenticity
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Tips for Success:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Use clear, descriptive titles</li>
                    <li>Set competitive prices</li>
                    <li>Provide detailed descriptions</li>
                    <li>Add high-quality product images</li>
                  </ul>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-primary w-full">
                List Product
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </main>
  );
}
