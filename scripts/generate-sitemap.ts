import fs from 'fs'
import path from 'path'
import { globby } from 'globby'
import * as prettier from 'prettier'

// Domaininizi buraya girin
const SITE_URL = 'https://www.maincalculators.com'

// Sitemap oluşturma fonksiyonu
async function generateSitemap() {
  // Tüm sayfaları bul
  const pages = await globby([
    'src/app/**/*.tsx',
    '!src/app/**/_*.tsx',
    '!src/app/**/layout.tsx',
    '!src/app/**/loading.tsx',
    '!src/app/**/error.tsx',
    '!src/app/**/not-found.tsx',
  ])

  // Sayfa URL'lerini oluştur
  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => {
          const path = page
            .replace('src/app', '')
            .replace('/page.tsx', '')
            .replace('/index.tsx', '')
          return `
            <url>
              <loc>${SITE_URL}${path}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>daily</changefreq>
              <priority>0.7</priority>
            </url>
          `
        })
        .join('')}
    </urlset>
  `

  // Sitemap'i formatla
  const formatted = await prettier.format(sitemap, {
    parser: 'html',
  })

  // Sitemap'i kaydet
  fs.writeFileSync('public/sitemap.xml', formatted)
}

generateSitemap()
  .catch(err => {
    console.error('❌ Sitemap oluşturulurken hata oluştu:', err)
    process.exit(1)
  }) 