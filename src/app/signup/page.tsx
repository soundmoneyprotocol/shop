'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/authContext';

export default function Signup() {
  const router = useRouter();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await signup(formData.email, formData.password, formData.firstName, formData.lastName);
      toast.success('Account created! Please check your email to confirm.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/" className="text-gray-600 hover:text-black transition">
                Home
              </Link>
              <ChevronRight size={18} className="text-gray-400" />
              <span className="text-black font-semibold">Sign Up</span>
            </div>
            <h1 className="text-4xl font-light mb-2">Create Account</h1>
            <p className="text-gray-600">Join our marketplace & Get Verified</p>
          </div>
        </motion.div>

        {/* Signup Form */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <div className="bg-white border border-gray-200 p-8 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className="input-base"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className="input-base"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="input-base"
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    className="input-base pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-600 hover:text-black transition"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    className="input-base pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-600 hover:text-black transition"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-black hover:underline font-semibold">
                  Sign in here
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
