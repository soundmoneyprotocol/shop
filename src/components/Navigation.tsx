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
    <nav className="sticky top-0 z-50 bg-dark/80 backdrop-blur border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold gradient-text">Shopping</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/marketplace" className="text-slate-300 hover:text-white transition">
              Browse
            </Link>
            <Link href="/seller/dashboard" className="text-slate-300 hover:text-white transition">
              Sell
            </Link>
            <Link href="/about" className="text-slate-300 hover:text-white transition">
              About
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Wallet Connection */}
            {!isConnected ? (
              <button
                onClick={connect}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition text-sm font-semibold"
              >
                <Wallet size={18} />
                Connect Wallet
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary text-sm font-semibold">
                <Wallet size={18} />
                {address?.substring(0, 6)}...{address?.substring(-4)}
              </div>
            )}

            {/* Cart */}
            <Link href="/checkout" className="relative">
              <button className="p-2 hover:bg-slate-800 rounded-lg transition">
                <ShoppingCart size={24} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-slate-700 pt-4">
            <Link
              href="/marketplace"
              className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition"
            >
              Browse Products
            </Link>
            <Link
              href="/seller/dashboard"
              className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition"
            >
              Sell on SoundMoney
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition"
            >
              About Us
            </Link>
            {!isConnected && (
              <button
                onClick={connect}
                className="w-full px-4 py-2 bg-primary text-white rounded font-semibold hover:bg-primary/90 transition"
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
