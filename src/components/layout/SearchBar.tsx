'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  name: string;
  link: string;
  category: string;
}

interface SearchBarProps {
  allCalculators: SearchResult[];
}

export const SearchBar = ({ allCalculators }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = allCalculators.filter(calc =>
      calc.name.toLowerCase().includes(query.toLowerCase()) ||
      calc.category.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
    setIsOpen(true);
  };

  return (
    <div ref={searchRef} className="relative w-full px-4 py-3">
      <div className="relative">
        <input
          type="text"
          placeholder="Search calculators..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchQuery && setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                   bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent
                   placeholder-gray-400 dark:placeholder-gray-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#0EA5E9]" />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute left-4 right-4 top-full mt-1 max-h-60 overflow-y-auto rounded-lg border 
                      border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50">
          {results.map((result) => (
            <Link
              key={result.id}
              href={result.link}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 hover:bg-[#7DD3FC]/10 active:bg-[#F59E0B]/10 transition-colors duration-200"
            >
              <div className="text-sm font-medium text-[#0EA5E9]">{result.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{result.category}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
