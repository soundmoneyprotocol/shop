'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-light mb-4 text-black">Privacy Policy</h1>
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
            <h2 className="text-2xl font-bold text-black mb-4">1. Introduction</h2>
            <p>
              SoundMoney ("we", "our", or "us") operates the SoundMoney marketplace. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">2. Information Collection and Use</h2>
            <p>
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>

            <h3 className="text-xl font-semibold text-black mt-6 mb-3">Types of Data Collected:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Personal Data:</strong> Name, email address, phone number, postal address, payment information</li>
              <li><strong>Transaction Data:</strong> Purchase history, seller information, product details</li>
              <li><strong>Technical Data:</strong> IP address, browser type, pages visited, cookies</li>
              <li><strong>Communication Data:</strong> Messages between buyers and sellers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">3. Use of Data</h2>
            <p>
              SoundMoney uses the collected data for various purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>To provide and maintain the Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information for service improvement</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent, and address technical and security issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">4. Security of Data</h2>
            <p>
              The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">5. Disclosure of Data</h2>
            <h3 className="text-lg font-semibold text-black mt-4 mb-2">Legal Requirements:</h3>
            <p>
              SoundMoney may disclose your personal data in the good faith belief that such action is necessary to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>Comply with a legal obligation</li>
              <li>Protect and defend the rights or property of SoundMoney</li>
              <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
              <li>Protect the personal safety of users of the Service or the public</li>
              <li>Protect against legal liability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">6. Cookies</h2>
            <p>
              Our Service uses cookies to distinguish you from other users. A cookie is a small file of letters and numbers that we store on your browser. This helps us provide you with a good experience when you browse our marketplace.
            </p>
            <p className="mt-3">
              We use both persistent cookies (which remain on your device) and session cookies (which expire when you close your browser).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">7. Links to Other Sites</h2>
            <p>
              Our Service may contain links to other sites that are not operated by us. This Privacy Policy applies only to information we collect. We strongly advise you to review the privacy policy of every site you visit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">9. Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent at any time</li>
              <li>Data portability</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us at privacy@soundmoneyprotocol.xyz
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-3">
              Email: privacy@soundmoneyprotocol.xyz<br />
              Address: SoundMoney, Inc.
            </p>
          </section>

          <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-sm text-gray-600">
              This Privacy Policy is effective as of April 2026 and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.
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
