import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MainCalculators.com',
  description: 'Your one-stop destination for all financial calculations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <a href="/" className="mr-6 flex items-center space-x-2">
                <span className="font-bold">MainCalculators.com</span>
              </a>
              <nav className="flex space-x-4">
                <a href="/" className="text-sm font-medium hover:text-primary">
                  Home
                </a>
                <a href="/about" className="text-sm font-medium hover:text-primary">
                  About
                </a>
                <a href="/contact" className="text-sm font-medium hover:text-primary">
                  Contact
                </a>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="container py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t mt-auto">
            <div className="container flex flex-col gap-2 py-6 text-center md:flex-row md:justify-between md:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date().getFullYear()} MainCalculators.com - All rights reserved
              </p>
              <nav className="flex gap-4 justify-center md:justify-end">
                <a href="/about" className="text-sm text-gray-500 hover:underline">
                  About
                </a>
                <a href="/contact" className="text-sm text-gray-500 hover:underline">
                  Contact
                </a>
                <a href="/privacy" className="text-sm text-gray-500 hover:underline">
                  Privacy
                </a>
              </nav>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
