'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, Wallet, LogOut } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useWeb3Store } from '@/lib/web3Store';
import { useAuth } from '@/lib/authContext';
import toast from 'react-hot-toast';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems);
  const isConnected = useWeb3Store((state) => state.isConnected);
  const address = useWeb3Store((state) => state.address);
  const connect = useWeb3Store((state) => state.connect);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      setIsUserMenuOpen(false);
    } catch (error: any) {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/sm-bw-logo.png"
              alt="SoundMoney"
              className="h-8 w-8 object-contain"
            />
            <div className="text-xl font-light text-black">SoundMoney</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/marketplace" className="text-gray-700 hover:text-black transition">
              Browse
            </Link>
            <Link href="/seller/dashboard" className="text-gray-700 hover:text-black transition">
              Sell
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-black transition">
              About
            </Link>
            <Link href="/marketplace-analytics" className="text-gray-700 hover:text-black transition">
              Analytics
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Wallet Connection */}
            {!isConnected ? (
              <button
                onClick={connect}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 transition text-sm font-semibold text-white rounded-lg"
              >
                <Wallet size={18} />
                Connect Wallet
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-lg">
                <Wallet size={18} />
                {address?.substring(0, 6)}...{address?.substring(-4)}
              </div>
            )}

            {/* Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition"
                >
                  {user.firstName || 'Account'}
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                    <Link
                      href="/seller/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="text-gray-700 hover:text-black transition font-semibold text-sm">
                  Login
                </Link>
                <Link href="/signup" className="px-4 py-2 border-2 border-black text-black text-sm font-semibold rounded-lg hover:bg-black hover:text-white transition">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Cart */}
            <Link href="/checkout" className="relative">
              <button className="p-2 hover:bg-gray-100 transition">
                <ShoppingCart size={24} className="text-gray-900" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 transition"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-gray-300 pt-4">
            <Link
              href="/marketplace-analytics"
              className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 transition"
            >
              Analytics
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 transition"
            >
              About Us
            </Link>
            <Link
              href="/marketplace"
              className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 transition"
            >
              Browse Products
            </Link>
            <Link
              href="/seller/dashboard"
              className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 transition"
            >
              Sell on SoundMoney
            </Link>
            {!isConnected && (
              <button
                onClick={connect}
                className="w-full px-4 py-2 bg-green-600 text-white font-semibold hover:bg-green-700 transition rounded-lg"
              >
                Connect Wallet
              </button>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-600 text-white font-semibold hover:bg-red-700 transition rounded-lg flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block px-4 py-2 bg-gray-200 text-black font-semibold hover:bg-gray-300 transition rounded-lg text-center"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-2 border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition rounded-lg text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
