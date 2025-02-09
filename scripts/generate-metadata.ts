import fs from 'fs';
import path from 'path';
import { calculatorMetadata } from '@/app/calculators/metadata-configs';

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

export const metadata: Metadata = pageMetadata;

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}`;
};

// Function to generate metadata files
async function generateMetadataFiles() {
  // Create directories if they don't exist
  Object.keys(calculatorMetadata).forEach((calculatorPath) => {
    const calculatorDir = path.join(APP_DIR, calculatorPath);
    
    if (!fs.existsSync(calculatorDir)) {
      fs.mkdirSync(calculatorDir, { recursive: true });
    }

    // Create metadata.ts
    const metadataPath = path.join(calculatorDir, 'metadata.ts');
    fs.writeFileSync(
      metadataPath,
      createMetadataContent(calculatorMetadata[calculatorPath])
    );

    // Create layout.tsx if it doesn't exist
    const layoutPath = path.join(calculatorDir, 'layout.tsx');
    if (!fs.existsSync(layoutPath)) {
      fs.writeFileSync(layoutPath, createLayoutContent());
    }
  });

  console.log('Metadata files generated successfully!');
}

// Run the generator
generateMetadataFiles().catch(console.error);
