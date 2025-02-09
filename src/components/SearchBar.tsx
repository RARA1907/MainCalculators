'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { getAllCalculators } from '@/utils/getAllCalculators';
import type { Calculator } from '@/utils/getAllCalculators';

type SearchBarProps = {
  className?: string;
};

export function SearchBar({ className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Calculator[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    
    if (!searchQuery || searchQuery.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const allCalculators = getAllCalculators();
    const searchResults = allCalculators.filter(calculator => {
      const matchName = calculator.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = calculator.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchName || matchCategory;
    });

    setResults(searchResults.slice(0, 6));
    setIsOpen(true);
  };

  const handleSelect = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.trim().length > 0 && setIsOpen(true)}
          placeholder="Search calculators..."
          className={`w-full py-2 pl-10 pr-4 text-sm border rounded-lg focus:outline-none focus:border-blue-500 ${className}`}
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      </div>

      {isOpen && results.length > 0 && (
        <div 
          className="absolute left-0 right-0 w-full bg-white rounded-md shadow-lg border-gray-100 border mt-1"
          style={{
            zIndex: 9999,
          }}
        >
          <ul className="py-1 max-h-[280px] overflow-auto">
            {results.map((calculator) => (
              <li key={calculator.href}>
                <Link
                  href={calculator.href}
                  onClick={handleSelect}
                  className="block w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 group"
                >
                  <Search className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-700 truncate group-hover:text-gray-900">
                      {calculator.name}
                    </div>
                    <div className="text-xs text-gray-400 truncate group-hover:text-gray-600">
                      {calculator.category}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
