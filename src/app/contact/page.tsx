'use client'

import Link from 'next/link';
import { Mail, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Contact <span className="text-blue-600">Us</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We'd love to hear from you. Reach out with your questions, suggestions, or feedback.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Email Address</p>
                    <a 
                      href="mailto:info@vayns.com" 
                      className="text-xl font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      info@vayns.com
                    </a>
                    <p className="text-slate-600 mt-1">We typically respond within 24-48 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Response Time</p>
                    <p className="text-lg font-semibold text-slate-900">24-48 Hours</p>
                    <p className="text-slate-600 mt-1">During business days</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-white rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">What we can help with:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Calculator suggestions and feature requests
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Technical support and troubleshooting
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Feedback and improvement ideas
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Partnership and collaboration opportunities
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Right Column - Decorative Element */}
            <div className="bg-blue-600 rounded-2xl p-8 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
              <p className="text-lg opacity-90 mb-8">We value your feedback and inquiries</p>
              
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold mb-2">24h</div>
                  <div className="text-sm opacity-90">Response Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-2">100%</div>
                  <div className="text-sm opacity-90">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">How Can We Help?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl">+</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Suggestions</h3>
              <p className="text-slate-600 mb-4">
                Have ideas for new calculators or features? We'd love to hear your suggestions and implement them to improve our platform.
              </p>
              <a href="mailto:info@vayns.com?subject=Suggestion" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                Send Suggestion →
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Support</h3>
              <p className="text-slate-600 mb-4">
                Need help using our calculators? Our expert team is here to assist you with any technical issues or questions.
              </p>
              <a href="mailto:info@vayns.com?subject=Support" className="text-purple-600 font-medium hover:text-purple-700 transition-colors">
                Get Support →
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl">★</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Feedback</h3>
              <p className="text-slate-600 mb-4">
                Your input helps us improve. Share your experience with us and help us make our calculators even better.
              </p>
              <a href="mailto:info@vayns.com?subject=Feedback" className="text-yellow-600 font-medium hover:text-yellow-700 transition-colors">
                Share Feedback →
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to explore our calculators?</h2>
          <p className="text-lg text-blue-100 mb-8">Discover our comprehensive suite of calculation tools</p>
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-slate-50 transition-colors">
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
