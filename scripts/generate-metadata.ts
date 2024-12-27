import fs from 'fs';
import path from 'path';
import { calculatorMetadata } from '../src/app/calculators/metadata-configs';

const APP_DIR = path.join(process.cwd(), 'src', 'app');

// Function to create metadata file content
const createMetadataContent = (metadata: any) => {
  return `export const metadata = {
  title: '${metadata.title}',
  description: '${metadata.description}',
  keywords: ${JSON.stringify(metadata.keywords, null, 2)},
};`;
};

// Function to create layout file content
const createLayoutContent = () => {
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
};

// Main function to generate files
async function generateMetadataFiles() {
  for (const [calculator, metadata] of Object.entries(calculatorMetadata)) {
    const calculatorDir = path.join(APP_DIR, calculator);
    
    // Skip if directory doesn't exist
    if (!fs.existsSync(calculatorDir)) {
      console.log(`Skipping ${calculator} - directory doesn't exist`);
      continue;
    }

    // Create metadata.ts
    const metadataPath = path.join(calculatorDir, 'metadata.ts');
    fs.writeFileSync(metadataPath, createMetadataContent(metadata));
    console.log(`Created metadata.ts for ${calculator}`);

    // Create layout.tsx
    const layoutPath = path.join(calculatorDir, 'layout.tsx');
    fs.writeFileSync(layoutPath, createLayoutContent());
    console.log(`Created layout.tsx for ${calculator}`);
  }
}

// Run the generator
generateMetadataFiles().catch(console.error);
