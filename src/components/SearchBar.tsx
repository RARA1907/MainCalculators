'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  // Debug logging
  useEffect(() => {
    console.log('Search query:', query);
    console.log('Results:', results);
    console.log('Is open:', isOpen);
  }, [query, results, isOpen]);

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
    console.log('Handling search for:', searchQuery); // Debug log
    setQuery(searchQuery);
    
    if (!searchQuery || searchQuery.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const allCalculators = getAllCalculators();
    console.log('All calculators:', allCalculators); // Debug log

    const searchResults = allCalculators.filter(calculator => {
      const matchName = calculator.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = calculator.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchName || matchCategory;
    });

    console.log('Search results:', searchResults); // Debug log
    setResults(searchResults.slice(0, 6));
    setIsOpen(true);
  };

  const handleSelect = (calculator: Calculator) => {
    setQuery('');
    setIsOpen(false);
    router.push(calculator.href);
  };

  return (
    <>
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
      </div>

      {/* Floating Results Container */}
      {isOpen && results.length > 0 && (
        <div 
          className="fixed left-0 right-0 mx-auto bg-white rounded-lg shadow-xl border mt-1"
          style={{
            width: searchRef.current ? searchRef.current.offsetWidth : 'auto',
            maxWidth: '32rem',
            top: searchRef.current ? 
              searchRef.current.getBoundingClientRect().bottom + window.scrollY + 4 : 0,
            left: searchRef.current ? 
              searchRef.current.getBoundingClientRect().left : 0,
            zIndex: 9999,
          }}
        >
          <ul className="py-1 max-h-[300px] overflow-auto">
            {results.map((calculator) => (
              <li key={calculator.href}>
                <button
                  onClick={() => handleSelect(calculator)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{calculator.name}</div>
                    <div className="text-sm text-gray-500">{calculator.category}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
