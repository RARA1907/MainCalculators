const fs = require('fs');
const path = require('path');

// The AdSense script to inject
const adsenseScript = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2588261835139404" crossorigin="anonymous"></script>`;

// Function to inject the script into HTML files
function injectAdsenseScript() {
  const buildDir = path.join(process.cwd(), '.next/server/app');
  
  // Check if the build directory exists
  if (!fs.existsSync(buildDir)) {
    console.error('Build directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  // Function to process HTML files recursively
  function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Recursively process subdirectories
        processDirectory(filePath);
      } else if (file.endsWith('.html')) {
        // Process HTML files
        let html = fs.readFileSync(filePath, 'utf8');
        
        // Check if the script is already injected
        if (!html.includes(adsenseScript)) {
          // Inject the script before the closing head tag
          html = html.replace('</head>', `${adsenseScript}</head>`);
          fs.writeFileSync(filePath, html);
          console.log(`Injected AdSense script into ${filePath}`);
        }
      }
    });
  }

  // Start processing from the build directory
  processDirectory(buildDir);
  console.log('AdSense script injection completed!');
}

// Run the injection
injectAdsenseScript(); 