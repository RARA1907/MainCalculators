const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', 'src', 'app');

// Metadata configurations for all calculators
const calculatorMetadata = {
  'age-calculator': {
    title: 'Age Calculator | Calculate Age Between Dates',
    description: 'Calculate exact age between two dates, including years, months, and days with our precise age calculator.',
    keywords: ['age calculator', 'date calculator', 'birthday calculator', 'calculate age', 'age difference calculator']
  },
  'apr-calculator': {
    title: 'APR Calculator | Annual Percentage Rate Calculator',
    description: 'Calculate Annual Percentage Rate (APR) for loans and credit cards with our easy-to-use APR calculator.',
    keywords: ['APR calculator', 'annual percentage rate', 'loan APR', 'credit card APR', 'interest rate calculator']
  },
  'army-body-fat-calculator': {
    title: 'Army Body Fat Calculator | Military Body Fat Calculator',
    description: 'Calculate body fat percentage using the U.S. Army body fat calculation method.',
    keywords: ['army body fat calculator', 'military body fat', 'tape test calculator', 'military fitness calculator']
  },
  'bandwidth-calculator': {
    title: 'Bandwidth Calculator | Network Speed Calculator',
    description: 'Calculate network bandwidth and convert between different data transfer units.',
    keywords: ['bandwidth calculator', 'network speed', 'data transfer calculator', 'internet speed calculator']
  },
  'binary-calculator': {
    title: 'Binary Calculator | Binary Number Converter',
    description: 'Convert between binary, decimal, hexadecimal, and octal numbers.',
    keywords: ['binary calculator', 'binary converter', 'decimal to binary', 'hex calculator']
  },
  'bmi-calculator': {
    title: 'BMI Calculator | Body Mass Index Calculator',
    description: 'Calculate your Body Mass Index (BMI) and determine your healthy weight range.',
    keywords: ['BMI calculator', 'body mass index', 'healthy weight calculator', 'weight status calculator']
  },
  'bmr-calculator': {
    title: 'BMR Calculator | Basal Metabolic Rate Calculator',
    description: 'Calculate your Basal Metabolic Rate (BMR) to determine daily calorie needs.',
    keywords: ['BMR calculator', 'basal metabolic rate', 'calorie calculator', 'metabolism calculator']
  },
  'budget-calculator': {
    title: 'Budget Calculator | Personal Budget Calculator',
    description: 'Plan your personal budget and track income and expenses.',
    keywords: ['budget calculator', 'personal finance', 'expense calculator', 'income calculator']
  },
  'calories-burned-calculator': {
    title: 'Calories Burned Calculator | Exercise Calorie Calculator',
    description: 'Calculate calories burned during different types of physical activities.',
    keywords: ['calories burned calculator', 'exercise calculator', 'activity calculator', 'workout calculator']
  },
  'circle-calculator': {
    title: 'Circle Calculator | Circle Measurement Calculator',
    description: 'Calculate circle measurements including area, circumference, diameter, and radius.',
    keywords: ['circle calculator', 'circle area calculator', 'circumference calculator', 'geometry calculator']
  },
  'concrete-calculator': {
    title: 'Concrete Calculator | Concrete Volume Calculator',
    description: 'Calculate the amount of concrete needed for your construction project.',
    keywords: ['concrete calculator', 'concrete volume', 'construction calculator', 'cement calculator']
  },
  'electricity-calculator': {
    title: 'Electricity Calculator | Electric Bill Calculator',
    description: 'Calculate electricity usage and estimate your electric bill costs.',
    keywords: ['electricity calculator', 'electric bill calculator', 'power consumption calculator', 'energy calculator']
  },
  'fat-intake-calculator': {
    title: 'Fat Intake Calculator | Daily Fat Calculator',
    description: 'Calculate recommended daily fat intake based on your caloric needs.',
    keywords: ['fat intake calculator', 'dietary fat calculator', 'nutrition calculator', 'diet calculator']
  },
  'gfr-calculator': {
    title: 'GFR Calculator | Kidney Function Calculator',
    description: 'Calculate Glomerular Filtration Rate (GFR) to assess kidney function.',
    keywords: ['GFR calculator', 'kidney function calculator', 'creatinine calculator', 'eGFR calculator']
  },
  'half-life-calculator': {
    title: 'Half Life Calculator | Decay Calculator',
    description: 'Calculate half-life and decay rates for various substances.',
    keywords: ['half life calculator', 'decay calculator', 'radioactive decay', 'exponential decay calculator']
  },
  'healthy-weight-calculator': {
    title: 'Healthy Weight Calculator | Ideal Weight Calculator',
    description: 'Calculate your healthy weight range based on height, age, and body frame.',
    keywords: ['healthy weight calculator', 'ideal weight calculator', 'weight range calculator', 'BMI calculator']
  },
  'inflation-calculator': {
    title: 'Inflation Calculator | Price Change Calculator',
    description: 'Calculate the effects of inflation on purchasing power over time.',
    keywords: ['inflation calculator', 'price change calculator', 'purchasing power calculator', 'cost calculator']
  },
  'ip-subnet-calculator': {
    title: 'IP Subnet Calculator | Network Calculator',
    description: 'Calculate IP subnets, network addresses, and host ranges.',
    keywords: ['IP subnet calculator', 'network calculator', 'CIDR calculator', 'IP address calculator']
  },
  'loan-calculator': {
    title: 'Loan Calculator | Payment Calculator',
    description: 'Calculate loan payments, interest, and amortization schedules.',
    keywords: ['loan calculator', 'payment calculator', 'amortization calculator', 'interest calculator']
  },
  'margin-calculator': {
    title: 'Margin Calculator | Profit Margin Calculator',
    description: 'Calculate profit margins and markup percentages for your business.',
    keywords: ['margin calculator', 'profit calculator', 'markup calculator', 'retail calculator']
  },
  'mass-calculator': {
    title: 'Mass Calculator | Weight Conversion Calculator',
    description: 'Convert between different units of mass and weight.',
    keywords: ['mass calculator', 'weight calculator', 'mass conversion', 'weight conversion calculator']
  },
  'molecular-weight-calculator': {
    title: 'Molecular Weight Calculator | Molar Mass Calculator',
    description: 'Calculate molecular weight and molar mass of chemical compounds.',
    keywords: ['molecular weight calculator', 'molar mass calculator', 'chemical calculator', 'formula weight calculator']
  },
  'molarity-calculator': {
    title: 'Molarity Calculator | Solution Concentration Calculator',
    description: 'Calculate molarity and concentration of chemical solutions.',
    keywords: ['molarity calculator', 'concentration calculator', 'solution calculator', 'chemistry calculator']
  },
  'password-generator': {
    title: 'Password Generator | Secure Password Creator',
    description: 'Generate strong, secure passwords with customizable options.',
    keywords: ['password generator', 'secure password', 'random password generator', 'password creator']
  },
  'quadratic-formula-calculator': {
    title: 'Quadratic Formula Calculator | Equation Solver',
    description: 'Solve quadratic equations and find roots using the quadratic formula.',
    keywords: ['quadratic formula calculator', 'equation solver', 'root calculator', 'algebra calculator']
  },
  'ratio-calculator': {
    title: 'Ratio Calculator | Proportion Calculator',
    description: 'Calculate ratios, proportions, and scale factors.',
    keywords: ['ratio calculator', 'proportion calculator', 'scale calculator', 'math calculator']
  },
  'retirement-calculator': {
    title: 'Retirement Calculator | Retirement Planning Calculator',
    description: 'Plan for retirement by calculating savings and future income needs.',
    keywords: ['retirement calculator', 'retirement planning', 'pension calculator', 'savings calculator']
  },
  'square-footage-calculator': {
    title: 'Square Footage Calculator | Area Calculator',
    description: 'Calculate square footage and area measurements for rooms and buildings.',
    keywords: ['square footage calculator', 'area calculator', 'room size calculator', 'floor space calculator']
  },
  'tile-calculator': {
    title: 'Tile Calculator | Flooring Calculator',
    description: 'Calculate the number of tiles needed for your flooring project.',
    keywords: ['tile calculator', 'flooring calculator', 'tile estimator', 'floor tile calculator']
  },
  'voltage-drop-calculator': {
    title: 'Voltage Drop Calculator | Electrical Calculator',
    description: 'Calculate voltage drop in electrical circuits and wiring.',
    keywords: ['voltage drop calculator', 'electrical calculator', 'wire size calculator', 'circuit calculator']
  },
  'weight-calculator': {
    title: 'Weight Calculator | Weight Conversion Calculator',
    description: 'Convert between different units of weight and mass.',
    keywords: ['weight calculator', 'weight converter', 'mass calculator', 'unit converter']
  }
};

// Function to create metadata file content
function createMetadataContent(metadata) {
  return `export const metadata = {
  title: '${metadata.title}',
  description: '${metadata.description}',
  keywords: ${JSON.stringify(metadata.keywords, null, 2)},
};`;
}

// Function to create layout file content
function createLayoutContent() {
  return `import { Metadata } from 'next';
import { metadata as pageMetadata } from './metadata';

export const metadata: Metadata = {
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}`;
}

// Main function to generate files
function generateMetadataFiles() {
  // Get all calculator directories
  const directories = fs.readdirSync(APP_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  let created = 0;
  let skipped = 0;

  // Process each calculator
  directories.forEach(dir => {
    // Skip if not in our metadata config
    if (!calculatorMetadata[dir]) {
      console.log(`Skipping ${dir} - no metadata config found`);
      skipped++;
      return;
    }

    const calculatorDir = path.join(APP_DIR, dir);
    const metadata = calculatorMetadata[dir];

    try {
      // Check and create metadata.ts
      const metadataPath = path.join(calculatorDir, 'metadata.ts');
      if (!fs.existsSync(metadataPath)) {
        fs.writeFileSync(metadataPath, createMetadataContent(metadata));
        console.log(`Created metadata.ts for ${dir}`);
        created++;
      } else {
        console.log(`Skipping metadata.ts for ${dir} - file already exists`);
        skipped++;
      }

      // Check and create layout.tsx
      const layoutPath = path.join(calculatorDir, 'layout.tsx');
      if (!fs.existsSync(layoutPath)) {
        fs.writeFileSync(layoutPath, createLayoutContent());
        console.log(`Created layout.tsx for ${dir}`);
        created++;
      } else {
        console.log(`Skipping layout.tsx for ${dir} - file already exists`);
        skipped++;
      }
    } catch (error) {
      console.error(`Error processing ${dir}:`, error);
    }
  });

  return { created, skipped };
}

// Run the generator
try {
  const { created, skipped } = generateMetadataFiles();
  console.log(`\nMetadata generation completed successfully!`);
  console.log(`Created ${created} new files`);
  console.log(`Skipped ${skipped} existing files`);
} catch (error) {
  console.error('Error generating metadata:', error);
}
