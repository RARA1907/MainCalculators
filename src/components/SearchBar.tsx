'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllCalculators } from '@/utils/getAllCalculators';

type Calculator = {
  name: string;
  href: string;
  category?: string;
};

type SearchBarProps = {
  className?: string;
};

export function SearchBar({ className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Calculator[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const allCalculators = getAllCalculators();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchResults = allCalculators.filter((calculator) =>
      calculator.name.toLowerCase().includes(query.toLowerCase())
    );

    setResults(searchResults.slice(0, 6));
    setIsOpen(true);
  }, [query, allCalculators]);

  const handleSelect = (calculator: Calculator) => {
    router.push(calculator.href);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Hesap makinesi ara..."
          className="w-full py-2 pl-10 pr-4 text-sm border rounded-lg focus:outline-none focus:border-blue-500"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border">
          <ul className="py-1">
            {results.map((calculator) => (
              <li key={calculator.href}>
                <button
                  onClick={() => handleSelect(calculator)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                >
                  <Search className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{calculator.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
