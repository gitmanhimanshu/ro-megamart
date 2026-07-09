// extract-products.mjs
// download.xml (sitemap) se sirf product-details URLs nikaal ke,
// romegamart.com prefix ensure karke, allproduct.json me store karta hai.
//
// Run:  node extract-products.mjs
import fs from 'node:fs'

const SRC = 'download.xml'
const OUT = 'allproduct.json'
const BASE = 'https://romegamart.com'

const xml = fs.readFileSync(SRC, 'utf8')

// saare <loc> nikaalo
const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1])

const seen = new Set()
const urls = []
for (let loc of locs) {
  if (!loc.includes('/product-details/')) continue       // sirf product pages

  // prefix ensure karo (agar relative slug ho to romegamart.com laga do)
  if (loc.startsWith('http')) {
    // host ko romegamart.com par normalize (www / http -> https://romegamart.com)
    loc = loc.replace(/^https?:\/\/[^/]+/, BASE)
  } else {
    loc = BASE + '/' + loc.replace(/^\/+/, '')
  }

  if (!seen.has(loc)) { seen.add(loc); urls.push(loc) }
}

fs.writeFileSync(OUT, JSON.stringify(urls, null, 2))
console.log(`Extracted ${urls.length} product URLs -> ${OUT}`)
console.log('Sample:', urls.slice(0, 3))
