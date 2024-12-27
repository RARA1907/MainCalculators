const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', 'src', 'app');

// Get all directories with page.tsx
function getAllCalculatorDirs() {
    const result = [];
    const files = fs.readdirSync(APP_DIR, { withFileTypes: true });
    
    for (const file of files) {
        if (file.isDirectory()) {
            const dirPath = path.join(APP_DIR, file.name);
            const hasPageTsx = fs.existsSync(path.join(dirPath, 'page.tsx'));
            if (hasPageTsx) {
                result.push({
                    name: file.name,
                    path: dirPath
                });
            }
        }
    }
    
    return result;
}

// Check which files are missing
function checkMissingFiles() {
    const calculators = getAllCalculatorDirs();
    const missing = [];
    
    for (const calc of calculators) {
        const metadataPath = path.join(calc.path, 'metadata.ts');
        const layoutPath = path.join(calc.path, 'layout.tsx');
        
        const hasMetadata = fs.existsSync(metadataPath);
        const hasLayout = fs.existsSync(layoutPath);
        
        if (!hasMetadata || !hasLayout) {
            missing.push({
                name: calc.name,
                missingMetadata: !hasMetadata,
                missingLayout: !hasLayout
            });
        }
    }
    
    return missing;
}

// Run the check
const missingFiles = checkMissingFiles();
console.log('\nCalculators missing metadata files:');
console.log('==================================');

missingFiles.forEach(calc => {
    console.log(`\n${calc.name}:`);
    if (calc.missingMetadata) console.log('  - Missing metadata.ts');
    if (calc.missingLayout) console.log('  - Missing layout.tsx');
});

console.log(`\nTotal calculators with missing files: ${missingFiles.length}`);
