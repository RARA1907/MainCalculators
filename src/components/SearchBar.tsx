'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Calculator = {
  name: string;
  href: string;
  category?: string;
};

type SearchBarProps = {
  allCalculators: Calculator[];
};

export function SearchBar({ allCalculators }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Calculator[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Handle clicks outside of search component
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchResults = allCalculators.filter(calculator =>
      calculator.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(searchResults);
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && results.length > 0) {
      router.push(results[0].href);
      setIsOpen(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search calculators..."
          className="w-full px-4 py-3 pl-12 rounded-lg bg-white "
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white ">
          {results.map((calculator, index) => (
            <Link
              key={calculator.href}
              href={calculator.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 hover:bg-gray-100 
                index !== results.length - 1 ? 'border-b border-gray-200 
              }`}
            >
              <div className="flex items-center">
                <Search className="h-4 w-4 mr-2 text-gray-400" />
                <span>{calculator.name}</span>
                {calculator.category && (
                  <span className="ml-2 text-sm text-gray-500 ">
                    in {calculator.category}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
