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
    name: 'Finance',
    children: [
      {
        id: '1-1',
        name: 'Mortgage and Real Estate',
        children: [
          { id: '1-1-1', name: 'Mortgage Calculator', link: '/mortgage-calculator' },
          { id: '1-1-2', name: 'Amortization Calculator', link: '/amortization-calculator' },
          { id: '1-1-3', name: 'Mortgage Payoff Calculator', link: '/mortgage-payoff-calculator' },
          { id: '1-1-4', name: 'House Affordability Calculator', link: '/house-affordability-calculator' },
          { id: '1-1-5', name: 'Rent Calculator', link: '/rent-calculator' },
          { id: '1-1-6', name: 'Debt-to-Income Ratio Calculator', link: '/debt-to-income-calculator' },
          { id: '1-1-7', name: 'Real Estate Calculator', link: '/real-estate-calculator' },
          { id: '1-1-8', name: 'Refinance Calculator', link: '/refinance-calculator' },
          { id: '1-1-9', name: 'Rental Property Calculator', link: '/rental-property-calculator' },
          { id: '1-1-10', name: 'APR Calculator', link: '/apr-calculator' },
          { id: '1-1-11', name: 'FHA Loan Calculator', link: '/fha-loan-calculator' },
          { id: '1-1-12', name: 'VA Mortgage Calculator', link: '/va-mortgage-calculator' },
          { id: '1-1-13', name: 'Down Payment Calculator', link: '/down-payment-calculator' },
          { id: '1-1-14', name: 'Rent vs. Buy Calculator', link: '/rent-vs-buy-calculator' }
        ]
      },
      {
        id: '1-2',
        name: 'Auto',
        children: [
          { id: '1-2-1', name: 'Auto Loan Calculator', link: '/auto-loan-calculator' },
          { id: '1-2-2', name: 'Cash Back or Low Interest Calculator', link: '/cash-back-calculator' },
          { id: '1-2-3', name: 'Auto Lease Calculator', link: '/auto-lease-calculator' }
        ]
      },
      {
        id: '1-3',
        name: 'Investment',
        children: [
          { id: '1-3-1', name: 'Interest Calculator', link: '/interest-calculator' },
          { id: '1-3-2', name: 'Investment Calculator', link: '/investment-calculator' },
          { id: '1-3-3', name: 'Finance Calculator', link: '/finance-calculator' },
          { id: '1-3-4', name: 'Compound Interest Calculator', link: '/compound-interest-calculator' },
          { id: '1-3-5', name: 'Interest Rate Calculator', link: '/interest-rate-calculator' },
          { id: '1-3-6', name: 'Savings Calculator', link: '/savings-calculator' },
          { id: '1-3-7', name: 'Simple Interest Calculator', link: '/simple-interest-calculator' },
          { id: '1-3-8', name: 'CD Calculator', link: '/cd-calculator' },
          { id: '1-3-9', name: 'Bond Calculator', link: '/bond-calculator' },
          { id: '1-3-10', name: 'Average Return Calculator', link: '/average-return-calculator' },
          { id: '1-3-11', name: 'ROI Calculator', link: '/roi-calculator' },
          { id: '1-3-12', name: 'Payback Period Calculator', link: '/payback-period-calculator' },
          { id: '1-3-13', name: 'Present Value Calculator', link: '/present-value-calculator' },
          { id: '1-3-14', name: 'Future Value Calculator', link: '/future-value-calculator' }
        ]
      },
      {
        id: '1-4',
        name: 'Retirement',
        children: [
          { id: '1-4-1', name: 'Retirement Calculator', link: '/retirement-calculator' },
          { id: '1-4-2', name: '401K Calculator', link: '/401k-calculator' },
          { id: '1-4-3', name: 'Pension Calculator', link: '/pension-calculator' },
          { id: '1-4-4', name: 'Social Security Calculator', link: '/social-security-calculator' },
          { id: '1-4-5', name: 'Annuity Calculator', link: '/annuity-calculator' },
          { id: '1-4-6', name: 'Annuity Payout Calculator', link: '/annuity-payout-calculator' },
          { id: '1-4-7', name: 'Roth IRA Calculator', link: '/roth-ira-calculator' },
          { id: '1-4-8', name: 'IRA Calculator', link: '/ira-calculator' },
          { id: '1-4-9', name: 'RMD Calculator', link: '/rmd-calculator' }
        ]
      },
      {
        id: '1-5',
        name: 'Tax and Salary',
        children: [
          { id: '1-5-1', name: 'Income Tax Calculator', link: '/income-tax-calculator' },
          { id: '1-5-2', name: 'Salary Calculator', link: '/salary-calculator' },
          { id: '1-5-3', name: 'Marriage Tax Calculator', link: '/marriage-tax-calculator' },
          { id: '1-5-4', name: 'Estate Tax Calculator', link: '/estate-tax-calculator' },
          { id: '1-5-5', name: 'Take-Home-Paycheck Calculator', link: '/take-home-paycheck-calculator' }
        ]
      },
      {
        id: '1-6',
        name: 'Other',
        children: [
          { id: '1-6-1', name: 'Loan Calculator', link: '/loan-calculator' },
          { id: '1-6-2', name: 'Payment Calculator', link: '/payment-calculator' },
          { id: '1-6-3', name: 'Currency Calculator', link: '/currency-calculator' },
          { id: '1-6-4', name: 'Inflation Calculator', link: '/inflation-calculator' },
          { id: '1-6-5', name: 'Sales Tax Calculator', link: '/sales-tax-calculator' },
          { id: '1-6-6', name: 'Credit Card Calculator', link: '/credit-card-calculator' },
          { id: '1-6-7', name: 'Credit Cards Payoff Calculator', link: '/credit-cards-payoff-calculator' },
          { id: '1-6-8', name: 'Debt Payoff Calculator', link: '/debt-payoff-calculator' },
          { id: '1-6-9', name: 'Debt Consolidation Calculator', link: '/debt-consolidation-calculator' },
          { id: '1-6-10', name: 'Repayment Calculator', link: '/repayment-calculator' },
          { id: '1-6-11', name: 'Student Loan Calculator', link: '/student-loan-calculator' },
          { id: '1-6-12', name: 'College Cost Calculator', link: '/college-cost-calculator' },
          { id: '1-6-13', name: 'VAT Calculator', link: '/vat-calculator' },
          { id: '1-6-14', name: 'Depreciation Calculator', link: '/depreciation-calculator' },
          { id: '1-6-15', name: 'Margin Calculator', link: '/margin-calculator' },
          { id: '1-6-16', name: 'Discount Calculator', link: '/discount-calculator' },
          { id: '1-6-17', name: 'Business Loan Calculator', link: '/business-loan-calculator' },
          { id: '1-6-18', name: 'Personal Loan Calculator', link: '/personal-loan-calculator' },
          { id: '1-6-19', name: 'Lease Calculator', link: '/lease-calculator' },
          { id: '1-6-20', name: 'Budget Calculator', link: '/budget-calculator' },
          { id: '1-6-21', name: 'Commission Calculator', link: '/commission-calculator' }
        ]
      }
    ]
  }
];

const TreeItem: React.FC<TreeItemProps> = ({ node, level }) => {
  const [isOpen, setIsOpen] = React.useState(level === 0);
  const hasChildren = node.children && node.children.length > 0;
  
  return (
    <div className="w-full">
      <div 
        className={cn(
          "flex items-center w-full py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-lg",
          level > 0 && "ml-" + (level * 2),
          "transition-colors duration-200"
        )}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown className="w-4 h-4 mr-2 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-2 flex-shrink-0" />
          )
        ) : (
          <Calculator className="w-4 h-4 mr-2 flex-shrink-0" />
        )}
        
        {node.link ? (
          <Link 
            href={node.link} 
            className="text-sm hover:text-blue-500 truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {node.name}
          </Link>
        ) : (
          <span className="text-sm font-medium truncate">{node.name}</span>
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
          "fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-900 shadow-xl",
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
          
          <nav className="px-2">
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
