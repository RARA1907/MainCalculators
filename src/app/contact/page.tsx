'use client'

import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-b from-white to-slate-50 min-h-[80vh] flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-blue-100 transform -skew-y-6"></div>
          <div className="absolute right-0 bottom-0 w-2/3 h-1/3 bg-blue-200 rounded-tl-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">Contact <span className="text-blue-600">Us</span></h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              We'd love to hear from you. Reach out with your questions, suggestions, or feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="flex-grow py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-50 p-8 md:p-12 rounded-xl shadow-lg">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Column - Contact Info */}
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Email Us</h2>
                  <div className="flex items-center">
                    <div className="w-12 h-12 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Email Address</p>
                      <a 
                        href="mailto:info@vayns.com" 
                        className="text-xl font-medium text-blue-600 hover:text-blue-700 transition duration-300"
                      >
                        info@vayns.com
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="prose prose-lg">
                  <p>
                    Our team typically responds within 24-48 hours during business days. 
                    We look forward to connecting with you!
                  </p>
                </div>
              </div>
              
              {/* Right Column - Decorative Element */}
              <div className="hidden md:block relative h-64">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-80 rounded-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center p-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <h3 className="text-2xl font-bold mb-2">Get in Touch</h3>
                    <p>We value your feedback and inquiries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Contact Information */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Suggestions</h3>
              <p className="text-slate-600">Have ideas for new calculators or features? We'd love to hear!</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Support</h3>
              <p className="text-slate-600">Need help using our calculators? Our team is here to assist you.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Feedback</h3>
              <p className="text-slate-600">Your input helps us improve. Share your experience with us.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">Ready to explore our calculators?</h2>
          <p className="text-lg mb-8 text-slate-600">Discover our comprehensive suite of calculation tools</p>
          <Link href="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition duration-300">
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
