'use client';

import { FileText, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import { getTranslations } from '@/lib/translations';


export default function TermsOfService({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const translations = getTranslations(locale);
  
  return (
    <div className="min-h-screen gradient-bg">
      {/* hreflang标签 */}
      <head>
        <link rel="alternate" hrefLang="en" href="https://tinycompressor.com/terms" />
        <link rel="alternate" hrefLang="zh" href="https://tinycompressor.com/zh/terms" />
        <link rel="alternate" hrefLang="x-default" href="https://tinycompressor.com/terms" />
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
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">Terms of Service</h1>
            <p className="text-xl text-neutral-600">
              Please read these terms carefully before using TinyCompressor.
            </p>
            <p className="text-sm text-neutral-500 mt-2">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Key Points */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-900 mb-2">Free to Use</h3>
              <p className="text-sm text-green-700">No charges, no hidden fees</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-900 mb-2">Privacy First</h3>
              <p className="text-sm text-blue-700">Your data stays on your device</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-orange-900 mb-2">Use Responsibly</h3>
              <p className="text-sm text-orange-700">Follow these guidelines</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-neutral-700 mb-4">
                By accessing and using TinyCompressor ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. Description of Service</h2>
              <p className="text-neutral-700 mb-4">
                TinyCompressor is a web-based image compression tool that allows users to reduce the file size of images while maintaining quality. The service operates entirely in your web browser and does not require account registration.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Key Features:</h3>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                  <li>Client-side image compression (no server uploads)</li>
                  <li>Support for multiple image formats (JPEG, PNG, WebP, etc.)</li>
                  <li>Batch processing capabilities</li>
                  <li>Quality and dimension adjustments</li>
                  <li>Free to use with no limitations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. User Responsibilities</h2>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    What You Can Do:
                  </h3>
                  <ul className="list-disc list-inside text-green-700 space-y-1">
                    <li>Use the service for personal and commercial purposes</li>
                    <li>Compress images you own or have permission to modify</li>
                    <li>Share compressed images freely</li>
                    <li>Use the service as often as needed</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="font-semibold text-red-900 mb-2 flex items-center">
                    <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    What You Cannot Do:
                  </h3>
                  <ul className="list-disc list-inside text-red-700 space-y-1">
                    <li>Upload copyrighted images without permission</li>
                    <li>Use the service for illegal activities</li>
                    <li>Attempt to reverse engineer or copy our technology</li>
                    <li>Upload malicious files or attempt to harm the service</li>
                    <li>Use automated tools to overload our servers</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Privacy and Data Handling</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-green-800 font-medium mb-2">Privacy-First Approach:</p>
                <ul className="list-disc list-inside text-green-700 space-y-1">
                  <li>All image processing happens locally in your browser</li>
                  <li>No images are uploaded to our servers</li>
                  <li>No personal data is collected or stored</li>
                  <li>No tracking or analytics on your images</li>
                  <li>Your files never leave your device</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. Intellectual Property</h2>
              <p className="text-neutral-700 mb-4">
                You retain all rights to your original images. By using TinyCompressor, you grant us no rights to your content. The compressed images generated are yours to use as you see fit.
              </p>
              <div className="bg-neutral-50 rounded-lg p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">Our Rights:</h3>
                <ul className="list-disc list-inside text-neutral-700 space-y-1">
                  <li>TinyCompressor software and technology remain our intellectual property</li>
                  <li>You may not copy, modify, or distribute our code without permission</li>
                  <li>Our brand name and logo are protected trademarks</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Service Availability</h2>
              <p className="text-neutral-700 mb-4">
                We strive to maintain high service availability, but we cannot guarantee uninterrupted access. The service may be temporarily unavailable due to:
              </p>
              <ul className="list-disc list-inside text-neutral-700 space-y-1 ml-4">
                <li>Maintenance and updates</li>
                <li>Technical issues or server problems</li>
                <li>Internet connectivity issues</li>
                <li>Force majeure events</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Limitation of Liability</h2>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <p className="text-orange-800 font-medium mb-2">Important Disclaimer:</p>
                <p className="text-orange-700 mb-2">
                  TinyCompressor is provided "as is" without warranties of any kind. We are not liable for:
                </p>
                <ul className="list-disc list-inside text-orange-700 space-y-1">
                  <li>Loss of data or images</li>
                  <li>Quality degradation of compressed images</li>
                  <li>Incompatibility with your device or browser</li>
                  <li>Any damages arising from use of the service</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">8. Prohibited Uses</h2>
              <p className="text-neutral-700 mb-4">You may not use TinyCompressor:</p>
              <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">9. Changes to Terms</h2>
              <p className="text-neutral-700">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">10. Termination</h2>
              <p className="text-neutral-700">
                We may terminate or suspend your access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">11. Governing Law</h2>
              <p className="text-neutral-700">
                These terms shall be interpreted and governed by the laws of the jurisdiction in which TinyCompressor operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">12. Contact Information</h2>
              <p className="text-neutral-700 mb-4">
                If you have any questions about these terms, please contact us:
              </p>
              <div className="bg-neutral-50 rounded-lg p-6">
                <p className="text-neutral-700">
                  <strong>Email:</strong> legal@tinycompressor.com<br/>
                  <strong>Website:</strong> <a href="/" className="text-primary-600 hover:underline">tinycompressor.com</a>
                </p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-200 pt-8 mt-12">
            <div className="text-center">
              <p className="text-neutral-500 text-sm">
                These terms of service are effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
              </p>
              <div className="flex justify-center space-x-6 mt-4">
                <a href="/" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Home
                </a>
                <a href="/privacy" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Privacy Policy
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
