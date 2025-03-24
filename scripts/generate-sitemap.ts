import fs from 'fs'
import path from 'path'
import { globby } from 'globby'
import prettier from 'prettier'

// Domaininizi buraya girin
const DOMAIN = 'https://www.maincalculators.com'
const SITE_ROOT = process.cwd()

/**
 * Tüm hesaplayıcı sayfalarını bulan ve sitemap.xml oluşturan fonksiyon
 */
async function generateSitemap() {
  console.log('Sitemap oluşturuluyor...')

  // App router yapısındaki tüm sayfa dosyalarını bul
  const pages = await globby([
    // Ana sayfa ve diğer root sayfalar
    'src/app/page.tsx',
    'src/app/*/page.tsx',
    'src/app/*/*/page.tsx',
    // Hesaplayıcı sayfaları
    'src/app/*-calculator*/page.tsx',
    'src/app/*/*-calculator*/page.tsx',
    // Diğer özel sayfalar
    'src/app/*/page.tsx',
    // Hariç tutulacak dosyaları belirt
    '!src/app/api',
    '!src/app/**/components',
    '!src/app/**/utils',
    '!src/app/**/hooks',
    '!src/app/**/lib',
    '!src/app/**/styles',
    '!**/node_modules/**',
  ])

  // Tüm dizinleri bul (hesaplayıcı dizinleri)
  const directories = await globby([
    'src/app/*-calculator*',
    'src/app/*/*-calculator*',
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
  ], { onlyDirectories: true })

  console.log(`${directories.length} hesaplayıcı dizini bulundu.`)

  // Dizinleri URL'lere dönüştür
  const urls = directories.map(dir => {
    // src/app/ kısmını kaldır ve trailing slashları temizle
    const cleanPath = dir.replace('src/app/', '').replace(/\/$/, '')
    return `${DOMAIN}/${cleanPath}`
  })

  // Ana sayfayı ekle
  urls.unshift(DOMAIN)
  
  // Kategorileri ekle
  const categories = [
    '/calculators',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-and-conditions',
  ]
  
  categories.forEach(category => {
    urls.push(`${DOMAIN}${category}`)
  })

  // Tekrarlanan URL'leri kaldır
  const uniqueUrls = Array.from(new Set(urls))

  console.log(`${uniqueUrls.length} benzersiz URL bulundu.`)

  const currentDate = new Date().toISOString()

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
          `
        })
        .join('')}
    </urlset>
  `

  // XML'i formatla
  const formattedSitemap = await prettier.format(sitemap, {
    parser: 'html',
  })

  // Çıktı dosyasını yaz
  const sitemapPath = path.join(SITE_ROOT, 'public', 'sitemap.xml')
  fs.writeFileSync(sitemapPath, formattedSitemap)

  console.log(`✅ Sitemap başarıyla oluşturuldu: ${sitemapPath}`)
  console.log(`✅ Toplam ${uniqueUrls.length} URL eklendi.`)
  console.log('✅ robots.txt dosyasını kontrol etmeyi unutmayın!')
}

// Script'i çalıştır
generateSitemap()
  .catch(err => {
    console.error('❌ Sitemap oluşturulurken hata oluştu:', err)
    process.exit(1)
  }) 