'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cartStore';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'confirmation'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Shipping
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',

    // Payment
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    cardholderName: '',
  });

  const [orderData, setOrderData] = useState<any>(null);

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <main className="min-h-screen bg-dark py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center py-16">
            <ShoppingBag className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-slate-400 mb-8">Add some products to get started</p>
            <Link href="/marketplace" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode
    ) {
      toast.error('Please fill in all shipping fields');
      return;
    }
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.cardNumber ||
      !formData.cardExpiry ||
      !formData.cardCVC ||
      !formData.cardholderName
    ) {
      toast.error('Please fill in all payment fields');
      return;
    }

    setIsProcessing(true);

    // Simulate Stripe payment processing
    setTimeout(() => {
      const order = {
        id: `ORDER-${Date.now()}`,
        items: items,
        totalPrice: totalPrice,
        shippingInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: 'stripe',
        status: 'paid',
        createdAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      };

      setOrderData(order);
      clearCart();
      setStep('confirmation');
      setIsProcessing(false);
      toast.success('Payment successful! Order placed.');
    }, 2000);
  };

  const shippingCost = totalPrice > 5000 ? 0 : 999; // Free shipping over $50
  const subtotal = totalPrice;
  const tax = Math.round(subtotal * 0.08); // 8% tax
  const finalTotal = subtotal + shippingCost + tax;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <main className="min-h-screen bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition mb-4"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
          <h1 className="text-4xl font-bold">Checkout</h1>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          className="mb-12 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {['Cart', 'Shipping', 'Payment', 'Confirmation'].map((label, index) => {
            const steps = ['cart', 'shipping', 'payment', 'confirmation'];
            const isActive = steps.indexOf(step) >= index;
            const isCurrent = step === steps[index];

            return (
              <div key={index} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    isCurrent
                      ? 'bg-primary text-white'
                      : isActive
                      ? 'bg-primary/50 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {index + 1}
                </div>
                <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            className="lg:col-span-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Cart Review */}
            {step === 'cart' && (
              <motion.div className="space-y-6" variants={itemVariants}>
                <div className="card">
                  <h2 className="text-2xl font-bold mb-6">Order Review</h2>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 pb-4 border-b border-slate-700 last:border-0"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-slate-400">{item.creatorName}</p>
                          <p className="text-sm mt-1">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">${(item.price / 100).toFixed(2)}</p>
                          <p className="text-sm text-slate-400">
                            ${((item.price * item.quantity) / 100).toFixed(2)} total
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep('shipping')}
                  className="btn-primary w-full"
                >
                  Continue to Shipping
                </button>
              </motion.div>
            )}

            {/* Shipping Form */}
            {step === 'shipping' && (
              <motion.form onSubmit={handleShippingSubmit} className="card space-y-6" variants={itemVariants}>
                <h2 className="text-2xl font-bold">Shipping Address</h2>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="input-base col-span-1"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="input-base col-span-1"
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-base"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-base"
                />

                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input-base"
                />

                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="input-base"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="input-base"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="input-base"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="btn-outline flex-1"
                  >
                    Back
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Continue to Payment
                  </button>
                </div>
              </motion.form>
            )}

            {/* Payment Form */}
            {step === 'payment' && (
              <motion.form onSubmit={handlePaymentSubmit} className="card space-y-6" variants={itemVariants}>
                <h2 className="text-2xl font-bold">Payment Information</h2>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3">
                  <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-300">
                    Your payment information is secure and encrypted with SSL.
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardholderName"
                    placeholder="John Doe"
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\s/g, '');
                      if (!/^\d*$/.test(value)) value = formData.cardNumber;
                      value = value.substring(0, 16);
                      const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
                      setFormData((prev) => ({ ...prev, cardNumber: formatted }));
                    }}
                    className="input-base"
                  />
                  <p className="text-xs text-slate-400 mt-1">For testing: 4242 4242 4242 4242</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-300 mb-2 block">Expiry Date</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.substring(0, 2) + '/' + value.substring(2, 4);
                        }
                        setFormData((prev) => ({ ...prev, cardExpiry: value }));
                      }}
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-300 mb-2 block">CVC</label>
                    <input
                      type="text"
                      name="cardCVC"
                      placeholder="123"
                      value={formData.cardCVC}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        value = value.substring(0, 3);
                        setFormData((prev) => ({ ...prev, cardCVC: value }));
                      }}
                      className="input-base"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="btn-outline flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        Pay ${(finalTotal / 100).toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {/* Confirmation */}
            {step === 'confirmation' && orderData && (
              <motion.div className="card text-center space-y-6" variants={itemVariants}>
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-2">Order Confirmed!</h2>
                  <p className="text-slate-400">Thank you for your purchase.</p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-6 text-left space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Order Number:</span>
                    <span className="font-mono font-semibold">{orderData.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Paid:</span>
                    <span className="font-bold text-primary">${(finalTotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Delivery:</span>
                    <span className="font-semibold">
                      {orderData.estimatedDelivery.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-slate-400">
                  A confirmation email has been sent to <span className="font-semibold">{formData.email}</span>
                </p>

                <div className="flex gap-4 pt-4">
                  <Link href="/marketplace" className="btn-outline flex-1">
                    Continue Shopping
                  </Link>
                  <Link href={`/order/${orderData.id}`} className="btn-primary flex-1">
                    Track Order
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Order Summary Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="card sticky top-20 space-y-6">
              <h3 className="text-xl font-bold">Order Summary</h3>

              <div className="space-y-3 pb-6 border-b border-slate-700">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-400">
                      {item.title.substring(0, 20)}... × {item.quantity}
                    </span>
                    <span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>${(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `$${(shippingCost / 100).toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tax</span>
                  <span>${(tax / 100).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${(finalTotal / 100).toFixed(2)}</span>
              </div>

              {step === 'confirmation' && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm text-green-400">
                  ✓ Payment successful
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
