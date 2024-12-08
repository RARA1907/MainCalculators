import { categories } from '@/app/page';

export type Calculator = {
  name: string;
  href: string;
  category: string;
};

export function getAllCalculators(): Calculator[] {
  const allCalculators: Calculator[] = [];

  categories.forEach(mainCategory => {
    mainCategory.subcategories.forEach(subcategory => {
      subcategory.items.forEach(calculator => {
        allCalculators.push({
          name: calculator.name,
          href: calculator.href,
          category: `${mainCategory.title} > ${subcategory.title}`
        });
      });
    });
  });

  return allCalculators;
}
