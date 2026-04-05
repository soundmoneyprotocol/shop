'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-light mb-4 text-black">Terms of Service</h1>
          <p className="text-gray-600">Last updated: April 2026</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-8 text-gray-700 leading-relaxed"
        >
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing and using this marketplace ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, then you may not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on SoundMoney for personal, non-commercial transactional use only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on the platform</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">3. Disclaimer</h2>
            <p>
              The materials on SoundMoney's marketplace are provided on an 'as is' basis. SoundMoney makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">4. Limitations</h2>
            <p>
              In no event shall SoundMoney or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SoundMoney's marketplace, even if SoundMoney or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on SoundMoney's marketplace could include technical, typographical, or photographic errors. SoundMoney does not warrant that any of the materials on its marketplace are accurate, complete, or current. SoundMoney may make changes to the materials contained on its marketplace at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">6. Materials on SoundMoney</h2>
            <p>
              SoundMoney has not reviewed all of the sites linked to its marketplace and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by SoundMoney of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">7. Modifications</h2>
            <p>
              SoundMoney may revise these terms of service for its marketplace at any time without notice. By using this marketplace, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">8. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">9. User Conduct</h2>
            <p>
              Users agree not to use the marketplace to:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
              <li>Post unlawful, threatening, abusive, defamatory, obscene, or otherwise objectionable material</li>
              <li>Harass, abuse, or threaten other users</li>
              <li>Engage in fraudulent transactions or misrepresent products</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Spam or send unsolicited messages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">10. Payment and Transactions</h2>
            <p>
              All transactions are subject to payment processing through Stripe or cryptocurrency payment methods. Users agree to provide accurate payment information and authorize charges for products purchased. Refunds are processed according to our return policy.
            </p>
          </section>

          <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-sm text-gray-600">
              If you have any questions about these Terms of Service, please contact us at legal@soundmoneyprotocol.xyz
            </p>
          </section>
        </motion.div>

        {/* Link back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link href="/" className="text-black hover:underline font-semibold">
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
