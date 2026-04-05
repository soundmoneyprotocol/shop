'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, Send, ArrowDown, ArrowUp, Copy, ExternalLink, AlertCircle, Check } from 'lucide-react';
import Link from 'next/link';

interface DepositMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  minAmount: number;
  maxAmount: number;
  fee: number;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  txHash?: string;
}

export default function DepositPage() {
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const depositMethods: DepositMethod[] = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, Mastercard, American Express',
      minAmount: 5,
      maxAmount: 10000,
      fee: 2.9
    },
    {
      id: 'usdc',
      name: 'USDC (Polygon)',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Fast crypto transfers',
      minAmount: 10,
      maxAmount: 50000,
      fee: 0.5
    },
    {
      id: 'eth',
      name: 'ETH (Ethereum)',
      icon: <Send className="w-6 h-6" />,
      description: 'Direct wallet transfer',
      minAmount: 0.01,
      maxAmount: 100,
      fee: 0
    }
  ];

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'deposit',
      amount: 500,
      method: 'Stripe',
      status: 'completed',
      date: '2026-04-04 14:32',
      txHash: '0x1234...5678'
    },
    {
      id: '2',
      type: 'withdrawal',
      amount: 200,
      method: 'Bank Transfer',
      status: 'completed',
      date: '2026-04-02 10:15',
      txHash: '0xabcd...efgh'
    },
    {
      id: '3',
      type: 'deposit',
      amount: 1000,
      method: 'USDC',
      status: 'pending',
      date: '2026-04-05 09:22',
      txHash: '0xxyza...bcde'
    }
  ];

  const selectedMethodData = depositMethods.find(m => m.id === selectedMethod);
  const fee = selectedMethodData && depositAmount ? (parseFloat(depositAmount) * selectedMethodData.fee) / 100 : 0;
  const total = selectedMethodData && depositAmount ? parseFloat(depositAmount) + fee : 0;

  const handleDeposit = async () => {
    if (!selectedMethod || !depositAmount) {
      setError('Please select a payment method and enter an amount');
      return;
    }

    if (selectedMethodData && (parseFloat(depositAmount) < selectedMethodData.minAmount || parseFloat(depositAmount) > selectedMethodData.maxAmount)) {
      setError(`Amount must be between $${selectedMethodData.minAmount} and $${selectedMethodData.maxAmount}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate deposit processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(`Successfully initiated deposit of $${total.toFixed(2)} via ${selectedMethodData?.name}`);
      setDepositAmount('');
      setSelectedMethod(null);
    } catch (err) {
      setError('Failed to process deposit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <motion.div className="mb-8 text-gray-600 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link href="/account" className="hover:text-black transition">
            Account
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black">Deposit Funds</span>
        </motion.div>

        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-light mb-4 text-black">Fund Your Account</h1>
          <p className="text-gray-600 text-lg">Add funds to bid on auctions, purchase merchandise, and manage your seller balance</p>
        </motion.div>

        {/* Alerts */}
        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded flex gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            className="mb-6 p-4 bg-green-50 border-l-4 border-green-600 rounded flex gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-700">{success}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Deposit Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Tabs */}
            <div className="flex gap-1 mb-8 border-b border-gray-200">
              {(['deposit', 'withdraw', 'history'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-semibold transition-all border-b-2 ${
                    activeTab === tab
                      ? 'text-black border-black'
                      : 'text-gray-600 border-transparent hover:text-black'
                  }`}
                >
                  {tab === 'deposit' && 'Deposit'}
                  {tab === 'withdraw' && 'Withdraw'}
                  {tab === 'history' && 'History'}
                </button>
              ))}
            </div>

            {/* Deposit Tab */}
            {activeTab === 'deposit' && (
              <div className="space-y-8">
                {/* Amount Input */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Deposit Amount</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <span className="absolute left-4 top-3 text-gray-600 font-semibold">$</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black outline-none transition text-lg"
                      />
                    </div>
                    <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition">
                      MAX
                    </button>
                  </div>
                  {selectedMethodData && depositAmount && (
                    <p className="text-sm text-gray-600">
                      {depositAmount && parseFloat(depositAmount) < selectedMethodData.minAmount && (
                        <>Minimum: ${selectedMethodData.minAmount}</>
                      )}
                      {depositAmount && parseFloat(depositAmount) > selectedMethodData.maxAmount && (
                        <>Maximum: ${selectedMethodData.maxAmount}</>
                      )}
                    </p>
                  )}
                </div>

                {/* Payment Methods */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Payment Method</label>
                  <div className="space-y-3">
                    {depositMethods.map((method) => (
                      <motion.button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`w-full p-4 rounded-lg border-2 transition flex items-start gap-4 text-left ${
                          selectedMethod === method.id
                            ? 'border-black bg-black/5'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className={`mt-1 ${selectedMethod === method.id ? 'text-black' : 'text-gray-600'}`}>
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-black mb-1">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600 mb-1">Fee</p>
                          <p className="font-semibold text-black">{method.fee}%</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Fee Breakdown */}
                {selectedMethodData && depositAmount && (
                  <motion.div
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deposit Amount</span>
                        <span className="font-semibold text-black">${parseFloat(depositAmount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction Fee ({selectedMethodData.fee}%)</span>
                        <span className="font-semibold text-black">${fee.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-300 pt-2 flex justify-between text-base">
                        <span className="font-semibold text-black">Total Charge</span>
                        <span className="font-bold text-black">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleDeposit}
                  disabled={!selectedMethod || !depositAmount || loading}
                  className="w-full py-4 bg-black text-white font-semibold rounded-lg hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowDown className="w-5 h-5" />
                      Deposit {selectedMethodData && depositAmount ? `$${total.toFixed(2)}` : 'Funds'}
                    </>
                  )}
                </button>

                {/* Terms */}
                <p className="text-xs text-gray-600 text-center">
                  By depositing, you agree to our{' '}
                  <Link href="/terms" className="text-black hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-black hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            )}

            {/* Withdraw Tab */}
            {activeTab === 'withdraw' && (
              <div className="space-y-8">
                <div className="p-6 bg-blue-50 border-l-4 border-blue-600 rounded">
                  <h3 className="font-semibold text-blue-900 mb-2">Withdrawal Coming Soon</h3>
                  <p className="text-sm text-blue-700">
                    Withdrawal functionality will be available once you verify your bank account. Complete verification in your account settings.
                  </p>
                </div>

                <Link href="/account?tab=payment" className="block">
                  <button className="w-full py-4 bg-black text-white font-semibold rounded-lg hover:bg-black/90 transition">
                    Verify Bank Account
                  </button>
                </Link>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {mockTransactions.map((tx) => (
                  <motion.div
                    key={tx.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            tx.type === 'deposit'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {tx.type === 'deposit' ? (
                            <ArrowDown className="w-5 h-5" />
                          ) : (
                            <ArrowUp className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-black">
                            {tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'} - {tx.method}
                          </h3>
                          <p className="text-sm text-gray-600">{tx.date}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`text-lg font-bold ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}${tx.amount}
                        </p>
                        <p
                          className={`text-xs font-semibold ${
                            tx.status === 'completed'
                              ? 'text-green-600'
                              : tx.status === 'pending'
                              ? 'text-orange-600'
                              : 'text-red-600'
                          }`}
                        >
                          {tx.status.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {tx.txHash && (
                      <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2">
                        <span className="text-xs text-gray-600">Hash:</span>
                        <code className="text-xs text-gray-700 font-mono">{tx.txHash}</code>
                        <button className="text-gray-600 hover:text-black transition ml-auto">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-black transition">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Account Balance */}
            <div className="card bg-gradient-to-br from-black to-gray-800 text-white">
              <p className="text-sm text-gray-300 mb-2">Account Balance</p>
              <p className="text-4xl font-light mb-4">$2,450.32</p>
              <div className="space-y-2 pt-4 border-t border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Available</span>
                  <span className="font-semibold">$2,450.32</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Pending</span>
                  <span className="font-semibold">$1,000.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Total</span>
                  <span className="font-semibold text-green-400">$3,450.32</span>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="card space-y-4">
              <h3 className="font-semibold text-black">Why Deposit?</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Bid on auctions instantly</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Receive seller payouts</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Access exclusive drops</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Earn rewards faster</span>
                </li>
              </ul>
            </div>

            {/* Wallet Info */}
            <div className="card bg-blue-50 border-2 border-blue-200">
              <h3 className="font-semibold text-black mb-3">Crypto Wallet</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Your USDC Address (Polygon)</p>
                  <code className="text-xs bg-white p-2 rounded block font-mono text-gray-700 break-all">
                    0x742d35Cc6634C0532925a3b844Bc9e7595f...
                  </code>
                </div>
                <button className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition">
                  Copy Address
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="card space-y-3">
              <p className="text-sm text-gray-600">
                Having trouble? Contact our support team or check our{' '}
                <Link href="/faq" className="text-black font-semibold hover:underline">
                  FAQ
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
