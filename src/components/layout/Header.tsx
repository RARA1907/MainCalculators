'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm fixed w-full top-0 z-10">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
              Swift Calculators Hub
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
