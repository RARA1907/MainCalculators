const fs = require('fs');
const path = require('path');

// Import the metadata configurations
const { calculatorMetadata } = require('../src/app/calculators/metadata-configs.js');

const APP_DIR = path.join(__dirname, '..', 'src', 'app');

// Function to create metadata file content
function createMetadataContent(metadata) {
  return `import { Metadata } from 'next';
import { generateCalculatorStructuredData, generateCalculatorMetaTags } from '../utils/structured-data';

const structuredData = generateCalculatorStructuredData(
  '${metadata.title}',
  '${metadata.description}'
);

export const metadata: Metadata = generateCalculatorMetaTags(
  '${metadata.title}',
  '${metadata.description}',
  ${JSON.stringify(metadata.keywords)},
  structuredData
);`;
}

// Function to create layout file content
function createLayoutContent() {
  return `import { Metadata } from 'next';
import { metadata } from './metadata';
import StructuredDataScript from '../components/StructuredDataScript';

export { metadata };

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredDataScript data={metadata.other?.['structured-data']} />
      {children}
    </>
  );
}`;
}

// Main function to generate files
function generateMetadataFiles() {
  const created = [];
  const skipped = [];

  // Iterate through all calculator metadata
  for (const [calculatorPath, metadata] of Object.entries(calculatorMetadata)) {
    const calculatorDir = path.join(APP_DIR, calculatorPath);
    const metadataFile = path.join(calculatorDir, 'metadata.ts');
    const layoutFile = path.join(calculatorDir, 'layout.tsx');

    // Create calculator directory if it doesn't exist
    if (!fs.existsSync(calculatorDir)) {
      fs.mkdirSync(calculatorDir, { recursive: true });
    }

    // Create metadata.ts if it doesn't exist
    if (!fs.existsSync(metadataFile)) {
      fs.writeFileSync(metadataFile, createMetadataContent(metadata));
      created.push(metadataFile);
    } else {
      skipped.push(metadataFile);
    }

    // Create layout.tsx if it doesn't exist
    if (!fs.existsSync(layoutFile)) {
      fs.writeFileSync(layoutFile, createLayoutContent());
      created.push(layoutFile);
    } else {
      skipped.push(layoutFile);
    }
  }

  return { created, skipped };
}

// Run the generator
try {
  const { created, skipped } = generateMetadataFiles();
  console.log('\nMetadata generation completed successfully!');
  
  if (created.length > 0) {
    console.log('\nCreated files:');
    created.forEach(file => console.log(`- ${path.relative(APP_DIR, file)}`));
  }
  
  if (skipped.length > 0) {
    console.log('\nSkipped existing files:');
    skipped.forEach(file => console.log(`- ${path.relative(APP_DIR, file)}`));
  }
} catch (error) {
  console.error('Error generating metadata files:', error);
  process.exit(1);
}
