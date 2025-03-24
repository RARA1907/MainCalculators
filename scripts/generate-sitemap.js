const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

// Domaininizi buraya girin
const DOMAIN = 'https://www.maincalculators.com';
const SITE_ROOT = process.cwd();

/**
 * Belirtilen desenlerle eşleşen dizinleri bulur
 * @param {string} baseDir - Taranacak temel dizin
 * @param {Array<string>} patterns - Eşleştirilecek glob desenleri
 * @returns {Array<string>} - Bulunan dizinlerin tam yolları
 */
function findMatchingDirectories(baseDir, patterns) {
  const results = [];

  function scanDirectory(dir) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Dizinin herhangi bir desene uyup uymadığını kontrol et
          const relativePath = fullPath.replace(SITE_ROOT + '/', '');
          if (patterns.some(pattern => {
            // Basit glob desenine dönüştür (* -> .*)
            const regexPattern = pattern
              .replace(/\//g, '\\/') // / karakterini escape et
              .replace(/\./g, '\\.') // . karakterini escape et
              .replace(/\*/g, '.*'); // * yerine .* kullan
            return new RegExp(`^${regexPattern}$`).test(relativePath);
          })) {
            results.push(fullPath);
          }
          
          // Alt dizinleri tara
          scanDirectory(fullPath);
        }
      }
    } catch (error) {
      console.error(`Dizin taranamadı: ${dir}`, error);
    }
  }

  scanDirectory(baseDir);
  return results;
}

/**
 * Tüm hesaplayıcı sayfalarını bulan ve sitemap.xml oluşturan fonksiyon
 */
async function generateSitemap() {
  console.log('Sitemap oluşturuluyor...');

  // Dizin desenlerini tanımla
  const directoryPatterns = [
    'src/app/*-calculator*',
    'src/app/calculators/*',
    'src/app/currency-calculator',
    'src/app/random-number-generator',
    'src/app/password-generator',
    'src/app/unit-converter',
    'src/app/jsonl-*',
    'src/app/*-counter',
    'src/app/*-converter',
    'src/app/*-generator',
    'src/app/dice-roller',
    'src/app/love-calculator',
    'src/app/how-many-days',
  ];

  // src/app dizininde tüm hesaplayıcı dizinlerini bul
  const appDir = path.join(SITE_ROOT, 'src', 'app');
  const directories = fs.readdirSync(appDir)
    .filter(dir => {
      // node_modules ve . ile başlayan dizinleri hariç tut
      if (dir === 'node_modules' || dir.startsWith('.')) {
        return false;
      }
      
      // Sadece dizinleri al
      const stats = fs.statSync(path.join(appDir, dir));
      if (!stats.isDirectory()) {
        return false;
      }
      
      // Hesaplayıcı benzeri dizinleri filtreleme
      return (
        dir.includes('-calculator') || 
        dir.includes('-counter') || 
        dir.includes('-converter') || 
        dir.includes('-generator') ||
        dir === 'calculators' ||
        dir === 'dice-roller' ||
        dir === 'love-calculator' ||
        dir === 'how-many-days' ||
        dir === 'unit-converter' ||
        dir === 'currency-calculator' ||
        dir === 'random-number-generator' ||
        dir === 'password-generator' ||
        dir.startsWith('jsonl-')
      );
    })
    .map(dir => path.join('src', 'app', dir));

  console.log(`${directories.length} hesaplayıcı dizini bulundu.`);

  // Dizinleri URL'lere dönüştür
  const urls = directories.map(dir => {
    // src/app/ kısmını kaldır ve trailing slashları temizle
    const cleanPath = dir.replace('src/app/', '').replace(/\/$/, '');
    return `${DOMAIN}/${cleanPath}`;
  });

  // Ana sayfayı ekle
  urls.unshift(DOMAIN);
  
  // Kategorileri ekle
  const categories = [
    '/calculators',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-and-conditions',
  ];
  
  categories.forEach(category => {
    urls.push(`${DOMAIN}${category}`);
  });

  // Tekrarlanan URL'leri kaldır
  const uniqueUrls = Array.from(new Set(urls));

  console.log(`${uniqueUrls.length} benzersiz URL bulundu.`);

  const currentDate = new Date().toISOString();

  // XML sitemap formatında veriler
  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${uniqueUrls
        .map(url => {
          return `
            <url>
              <loc>${url}</loc>
              <lastmod>${currentDate}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>${url === DOMAIN ? '1.0' : '0.8'}</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  // XML'i formatla
  const formattedSitemap = await prettier.format(sitemap, {
    parser: 'html',
  });

  // Çıktı dosyasını yaz
  const sitemapPath = path.join(SITE_ROOT, 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, formattedSitemap);

  console.log(`✅ Sitemap başarıyla oluşturuldu: ${sitemapPath}`);
  console.log(`✅ Toplam ${uniqueUrls.length} URL eklendi.`);
  console.log('✅ robots.txt dosyasındaki sitemap URL\'sinin doğru olduğundan emin olun!');
}

// Script'i çalıştır
generateSitemap()
  .catch(err => {
    console.error('❌ Sitemap oluşturulurken hata oluştu:', err);
    process.exit(1);
  }); 