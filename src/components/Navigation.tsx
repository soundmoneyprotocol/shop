'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, Wallet } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useWeb3Store } from '@/lib/web3Store';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems);
  const isConnected = useWeb3Store((state) => state.isConnected);
  const address = useWeb3Store((state) => state.address);
  const connect = useWeb3Store((state) => state.connect);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/sm-bw-logo.png"
              alt="SoundMoney"
              className="h-8 w-8 object-contain"
            />
            <div className="text-lg font-semibold text-gray-900">SoundMoney</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/marketplace" className="text-sm text-gray-700 hover:text-gray-900 transition">
              Browse
            </Link>
            <Link href="/seller/dashboard" className="text-sm text-gray-700 hover:text-gray-900 transition">
              Sell
            </Link>
            <Link href="/about" className="text-sm text-gray-700 hover:text-gray-900 transition">
              About
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Wallet Connection */}
            {!isConnected ? (
              <button
                onClick={connect}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition rounded"
              >
                <Wallet size={18} />
                Connect
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900">
                <Wallet size={18} />
                {address?.substring(0, 6)}...{address?.substring(-4)}
              </div>
            )}

            {/* Cart */}
            <Link href="/checkout" className="relative">
              <button className="p-2 text-gray-700 hover:text-gray-900 transition">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-green-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-gray-200 pt-4">
            <Link
              href="/marketplace"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
            >
              Browse Products
            </Link>
            <Link
              href="/seller/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
            >
              Sell on SoundMoney
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
            >
              About Us
            </Link>
            {!isConnected && (
              <button
                onClick={connect}
                className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded font-medium hover:from-green-600 hover:to-green-700 transition text-sm"
              >
                Connect Wallet
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
