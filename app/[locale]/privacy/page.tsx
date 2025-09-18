'use client';

import { Shield, Eye, Lock, Database, UserCheck, FileText } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import { getTranslations } from '@/lib/translations';

export default function PrivacyPolicy({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const translations = getTranslations(locale);
  
  return (
    <div className="min-h-screen gradient-bg">
      {/* hreflang标签 */}
      <head>
        <link rel="alternate" hrefLang="en" href="https://tinycompressor.com/privacy" />
        <link rel="alternate" hrefLang="zh" href="https://tinycompressor.com/zh/privacy" />
        <link rel="alternate" hrefLang="x-default" href="https://tinycompressor.com/privacy" />
      </head>
      
      <ClientHeader 
        currentLanguage={locale}
        translations={translations}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-200/50 p-8">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">Privacy Policy</h1>
            <p className="text-xl text-neutral-600">
              Your privacy is our priority. Here's how we protect your data.
            </p>
            <p className="text-sm text-neutral-500 mt-2">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Key Points */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
              <Eye className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-primary-900 mb-2">No Data Collection</h3>
              <p className="text-sm text-primary-700">We don't collect, store, or transmit your images</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl">
              <Lock className="w-8 h-8 text-accent-600 mx-auto mb-3" />
              <h3 className="font-semibold text-accent-900 mb-2">Local Processing</h3>
              <p className="text-sm text-accent-700">All compression happens in your browser</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-success-50 to-success-100 rounded-xl">
              <Database className="w-8 h-8 text-success-600 mx-auto mb-3" />
              <h3 className="font-semibold text-success-900 mb-2">No Servers</h3>
              <p className="text-sm text-success-700">Your files never leave your device</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center">
                <FileText className="w-6 h-6 text-primary-600 mr-3" />
                Information We Don't Collect
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <p className="text-red-800 font-medium mb-2">Important: We do NOT collect any of the following:</p>
                <ul className="list-disc list-inside text-red-700 space-y-1">
                  <li>Your images or files</li>
                  <li>Personal information</li>
                  <li>Usage data or analytics</li>
                  <li>IP addresses or location data</li>
                  <li>Device information</li>
                  <li>Browsing history</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center">
                <Lock className="w-6 h-6 text-primary-600 mr-3" />
                How TinyCompressor Works
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-green-800 font-medium mb-4">Client-Side Processing:</p>
                <ol className="list-decimal list-inside text-green-700 space-y-2">
                  <li>You upload images directly in your web browser</li>
                  <li>All compression algorithms run locally on your device</li>
                  <li>Compressed images are generated and downloaded to your computer</li>
                  <li>No data is sent to our servers or any third parties</li>
                </ol>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center">
                <UserCheck className="w-6 h-6 text-primary-600 mr-3" />
                What We Do Track (Minimal)
              </h2>
              <p className="text-neutral-700 mb-4">
                We only collect basic, anonymous usage statistics to improve our service:
              </p>
              <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
                <li>Page views (anonymized)</li>
                <li>Browser type and version (for compatibility)</li>
                <li>General geographic region (country level only)</li>
                <li>Error reports (no personal data included)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Third-Party Services</h2>
              <p className="text-neutral-700 mb-4">
                We use the following third-party services that may collect some data:
              </p>
              <div className="bg-neutral-50 rounded-lg p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">Vercel (Hosting)</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Our website is hosted on Vercel. They may collect basic analytics data. 
                  <a href="https://vercel.com/legal/privacy-policy" className="text-primary-600 hover:underline ml-1">
                    View Vercel's Privacy Policy
                  </a>
                </p>
                
                <h3 className="font-semibold text-neutral-900 mb-2">No Other Third Parties</h3>
                <p className="text-sm text-neutral-600">
                  We don't use any analytics, advertising, or tracking services. 
                  No Google Analytics, Facebook Pixel, or similar tracking tools.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Cookies</h2>
              <p className="text-neutral-700 mb-4">
                We use minimal cookies for essential functionality:
              </p>
              <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
                <li><strong>Language preference:</strong> Remembers your selected language</li>
                <li><strong>No tracking cookies:</strong> We don't use advertising or analytics cookies</li>
                <li><strong>No personal data:</strong> Cookies don't contain any personal information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Data Security</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-800 font-medium mb-2">Security Measures:</p>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                  <li>HTTPS encryption for all connections</li>
                  <li>No server-side storage of user data</li>
                  <li>Regular security updates and monitoring</li>
                  <li>Client-side processing ensures maximum privacy</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Your Rights</h2>
              <p className="text-neutral-700 mb-4">
                Since we don't collect personal data, you have complete control:
              </p>
              <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
                <li>Your images never leave your device</li>
                <li>No data to request, modify, or delete</li>
                <li>No account required - use anonymously</li>
                <li>Clear your browser data anytime to remove any stored preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Children's Privacy</h2>
              <p className="text-neutral-700">
                TinyCompressor is safe for users of all ages. Since we don't collect personal data, 
                there are no special considerations for children. The service can be used by anyone 
                without parental consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Changes to This Policy</h2>
              <p className="text-neutral-700">
                We may update this privacy policy occasionally. Any changes will be posted on this page 
                with an updated "Last modified" date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Contact Us</h2>
              <p className="text-neutral-700 mb-4">
                If you have any questions about this privacy policy, please contact us:
              </p>
              <div className="bg-neutral-50 rounded-lg p-6">
                <p className="text-neutral-700">
                  <strong>Email:</strong> privacy@tinycompressor.com<br/>
                  <strong>Website:</strong> <a href="/" className="text-primary-600 hover:underline">tinycompressor.com</a>
                </p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-200 pt-8 mt-12">
            <div className="text-center">
              <p className="text-neutral-500 text-sm">
                This privacy policy is effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
              </p>
              <div className="flex justify-center space-x-6 mt-4">
                <a href="/" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Home
                </a>
                <a href="/terms" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer translations={translations} locale={locale} />
    </div>
  );
}
