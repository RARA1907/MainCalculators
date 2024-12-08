'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand section */}
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
              Main Calculators
            </Link>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Your trusted source for all types of calculations. Making complex calculations simple and accessible.
            </p>
          </div>

          {/* Navigation sections */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Navigation</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} Main Calculators. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
