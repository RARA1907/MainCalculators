'use client';

import Link from 'next/link';
import { Calculator, HomeIcon, Percent } from 'lucide-react';

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
      } lg:translate-x-0 z-30 w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out overflow-y-auto`}
    >
      <div className="p-4">
        <nav className="space-y-8">
          {categories.map((category) => (
            <div key={category.title}>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {category.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {category.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
