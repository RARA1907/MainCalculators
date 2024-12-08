import React from 'react';
import { ChevronDown, ChevronRight, Calculator } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TreeNode {
  id: string;
  name: string;
  link?: string;
  children?: TreeNode[];
}

interface TreeItemProps {
  node: TreeNode;
  level: number;
}

const calculatorCategories: TreeNode[] = [
  {
    id: '1',
    name: 'Financial Calculators',
    children: [
      {
        id: '1-1',
        name: 'Loan Calculator',
        link: '/loan-calculator'
      },
      {
        id: '1-2',
        name: 'Investment Calculator',
        link: '/investment-calculator'
      },
      {
        id: '1-3',
        name: 'Mortgage Calculator',
        link: '/mortgage-calculator'
      }
    ]
  },
  {
    id: '2',
    name: 'Tax Calculators',
    children: [
      {
        id: '2-1',
        name: 'Income Tax Calculator',
        link: '/income-tax-calculator'
      },
      {
        id: '2-2',
        name: 'Sales Tax Calculator',
        link: '/sales-tax-calculator'
      }
    ]
  }
];

const TreeItem: React.FC<TreeItemProps> = ({ node, level }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = node.children && node.children.length > 0;
  
  return (
    <div className="w-full">
      <div 
        className={cn(
          "flex items-center w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
          level > 0 && "pl-" + (level * 4 + 4)
        )}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown className="w-4 h-4 mr-2" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-2" />
          )
        ) : (
          <Calculator className="w-4 h-4 mr-2" />
        )}
        
        {node.link ? (
          <Link href={node.link} className="text-sm hover:text-blue-500">
            {node.name}
          </Link>
        ) : (
          <span className="text-sm font-medium">{node.name}</span>
        )}
      </div>
      
      {hasChildren && isOpen && (
        <div className="w-full">
          {node.children.map((child) => (
            <TreeItem key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 shadow-xl",
          "transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          "border-r border-gray-200 dark:border-gray-800",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:sticky lg:top-16"
        )}
      >
        <div className="h-full overflow-y-auto py-4">
          <div className="px-4 mb-4">
            <h2 className="text-lg font-semibold">Calculators</h2>
          </div>
          
          <nav className="space-y-1">
            {calculatorCategories.map((category) => (
              <TreeItem key={category.id} node={category} level={0} />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
