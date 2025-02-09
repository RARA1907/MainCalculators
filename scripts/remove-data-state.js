const fs = require('fs');
const path = require('path');

function removeDataStateClosed(directory) {
  const files = fs.readdirSync(directory);

  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      // Recursively process subdirectories
      removeDataStateClosed(filePath);
    } else if (stats.isFile() && (file.endsWith('.tsx') || file.endsWith('.jsx'))) {
      // Process TypeScript/React files
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove data-state="closed" with various quotation marks and spacing
      const patterns = [
        /data-state="closed"/g,
        /data-state='closed'/g,
        /data-state={"closed"}/g,
        /data-state={'closed'}/g
      ];

      let modified = false;
      patterns.forEach(pattern => {
        if (pattern.test(content)) {
          content = content.replace(pattern, '');
          modified = true;
        }
      });

      if (modified) {
        console.log(`Modified: ${filePath}`);
        fs.writeFileSync(filePath, content);
      }
    }
  });
}

// Start from the src directory
const srcDir = path.join(__dirname, '..', 'src');
console.log('Starting to remove data-state="closed" attributes...');
removeDataStateClosed(srcDir);
console.log('Finished removing data-state="closed" attributes.');
