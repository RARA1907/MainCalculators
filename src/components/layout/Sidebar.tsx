'use client';

import Link from 'next/link';
import { Calculator, HomeIcon, Percent, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  {
    title: 'Financial Calculators',
    items: [
      { name: 'Mortgage Calculator', href: '/calculators/mortgage', icon: HomeIcon },
      { name: 'Compound Interest', href: '/calculators/compound-interest', icon: Percent },
    ]
  },
  {
    title: 'Math Calculators',
    items: [
      { name: 'Scientific Calculator', href: '/calculators/scientific', icon: Calculator },
    ]
  }
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } w-72 bg-white dark:bg-gray-800 h-full overflow-y-auto transition-transform duration-300 ease-in-out z-30 lg:relative lg:translate-x-0`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Navigation</h2>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <span className="sr-only">Close sidebar</span>
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="px-4 py-4">
        {categories.map((category, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              {category.title}
            </h3>
            <ul className="space-y-2">
              {category.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      className="flex items-center px-2 py-2 text-base text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
