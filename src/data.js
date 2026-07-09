// ============================================================================
//  Romegamart — structured site data
//  All product / category / brand content lives here so the UI stays generic.
//  Prices are illustrative placeholders (₹). Categories flagged `enquiryOnly`
//  render an "Enquire" CTA instead of a price.
// ============================================================================

// Real Romegamart CDN base for category imagery.
const CDN = 'https://images.romegamart.com/media/maincategory_image'

// Map each category id → its real category image on the Romegamart CDN.
const CAT_IMG = {
  'domestic-spares': `${CDN}/Domestic_Spares_Gkvh0Vw.webp`,
  'industrial-spares': `${CDN}/Industrial_Spares_B3fysOX.webp`,
  'domestic-systems': `${CDN}/Domestic_Systems_UBSwXGB_EkE01L7.png`,
  'industrial-systems': `${CDN}/Industrial_Systems_RVtaETN_FZmKrLZ.png`,
  'domestic-brands': `${CDN}/Domestic_Brands_6BD3SlG_7EbyAo0.png`,
  'industrial-brands': `${CDN}/Industrial_Brands_CudCOSB.png`,
  'water-softeners': `${CDN}/Water_Softener_cJCZ1tO.png`,
  'cooling-ro': `${CDN}/Cooling_RO_Rou9m4S.png`,
  'water-atm': `${CDN}/Water_ATM_Nxmoekh_leRo72I.png`,
  'commercial-systems': `${CDN}/Commercial_Systems_c0wiK40_407LBGn.png`,
  'bottling-plant': `${CDN}/Botteling_Plant_ktyrZjh.png`,
  'water-treatment': `${CDN}/Water_Treatement_j6KM1HP.png`,
  'etp-stp-zld': `${CDN}/ETP_STP_ZLD_XVKF1lv.png`,
}

// Tagline used across the hero / meta.
export const TAGLINE =
  "Romegamart: India's 1st and largest B2B Marketplace for the RO Industry — connecting manufacturers, dealers, distributors, retailers, and technicians."

// ---------------------------------------------------------------------------
//  CATEGORIES (13) — each with optional sub-categories + featured products
// ---------------------------------------------------------------------------
export const CATEGORIES = [
  {
    id: 'domestic-spares',
    name: 'Domestic Spares',
    tagline: 'Pumps, membranes, cabinets & cartridges for home RO systems',
    subCategories: ['Pumps', 'Membrane', 'Cabinet', 'Filter Cartridge'],
    products: [
      { name: 'Vontron 80 GPD 2500 TDS Polypropylene Membrane', seller: 'Wave RO Aqua Solution', price: 1499 },
      { name: 'Toyam Pure N+ 100 GPD Membrane (2000–2500 TDS)', seller: 'Wave RO Aqua Solution', price: 1799 },
      { name: 'V2 Life 80 GPD 2000 TDS High Flow Membrane', seller: 'Chandausi RO & Care Center', price: 1299 },
      { name: 'Olivar Cyclone Membrane Housing (Double O-Ring, White)', seller: 'RGV Enterprises', price: 349 },
      { name: 'Olivar International 100 GPD Cyclone Booster Pump', seller: 'Pawan Electronics', price: 899 },
      { name: 'FASTRACK FT Gold 100 GPD Booster Pump (Metal)', seller: 'Ruman Enterprises', price: 1099 },
      { name: 'Oxbow 24V Pump 80 GPD', seller: 'EARTH RO SYSTEM', price: 799 },
      { name: 'Purofic Silver 100 GPD Cast Iron Booster Pump (Black)', seller: 'Shree Nakoda Sales', price: 1199 },
      { name: 'Starlink 8 Liter Purple RO Cabinet', seller: 'Jazz Pure Water Solution', price: 1599 },
      { name: 'Pentair 10 Inch PP Spun Filter Cartridge', seller: 'DIVYA ENTERPRISES', price: 99 },
      { name: 'NEXUS PP Spun Filter Cartridge', seller: 'VATS AQUA RO SYSTEM', price: 89 },
      { name: 'Twinflow 100 GPD Membrane (Green, 13-layer, 2500 TDS)', seller: 'Dipayan Works & Products', price: 1699 },
      { name: 'ONTOZ Domestic 80 GPD RO Membrane (Orange, OT-1812)', seller: 'Velient Pec India Pvt Ltd', price: 1499, new: true },
      { name: 'BLUESMART Sediment Filter 15 GPM (Domestic RO)', seller: 'Ekta Aqua India', price: 149, new: true },
      { name: 'Aqua Vivo 12 Litre Top-Bottom Thermocol Domestic RO Cabinet', seller: 'Eurofab Electronics Pvt Ltd', price: 1899, new: true },
      { name: '75 GPD DOW Membrane (Blue, PP)', seller: 'Eurofab Electronics Pvt Ltd', price: 999, new: true },
      { name: 'Vontron 75 GPD Domestic RO Membrane', seller: 'Eurofab Electronics Pvt Ltd', price: 1099, new: true },
      { name: 'Dolphin Tap for Domestic RO (White/Blue, ABS)', seller: 'Eurofab Electronics Pvt Ltd', price: 149, new: true },
      { name: 'Philips 8W UV Lamp for Domestic RO', seller: 'Eurofab Electronics Pvt Ltd', price: 349, new: true },
      { name: '10 Inch Kemflo Spun Filter Candle', seller: 'Eurofab Electronics Pvt Ltd', price: 129, new: true },
      { name: 'E-Flow UF Membrane Filter (Domestic RO)', seller: 'Eurofab Electronics Pvt Ltd', price: 299, new: true },
      { name: 'Non-Return Valve (NRV) for Domestic RO', seller: 'Eurofab Electronics Pvt Ltd', price: 79, new: true },
      { name: 'CSM 80 GPD Domestic RO Membrane (Blue)', seller: 'Eurofab Electronics Pvt Ltd', price: 1199, new: true },
    ],
  },
  {
    id: 'industrial-spares',
    name: 'Industrial Spares',
    tagline: 'Heavy-duty membranes, housings & dosing pumps for plants',
    subCategories: ['Membrane', 'Filters Housing', 'High Pressure Pump', 'Dosing Pump'],
    products: [
      { name: 'DUPONT BW-30 4040 Industrial Membrane (2500 TDS)', seller: 'Jazz Pure Water Solutions', price: 8999 },
      { name: 'Captain Pure 8040 RO Membrane (3000 PPM TDS)', seller: 'Mindcool Aqua', price: 18999 },
      { name: 'Osprey BW-4040 Industrial Membrane (White, 3500 TDS)', seller: 'Osprey International', price: 7499 },
      { name: 'ELSA-100 1HP Raw Water Pump (1 Phase)', seller: 'Adarsh Enterprises', price: 5499 },
      { name: 'Hydronutics 4040 Industrial Membrane (White)', seller: 'Water Sun Energy Solution', price: 8499 },
      { name: '10 M3/HR Big Blue Jumbo Housing PP', seller: 'Chasten Water Components', price: 2299 },
      { name: '6 M3/HR Blue 20 Inch PP Jumbo Housing', seller: 'Chasten Water Components', price: 1899 },
      { name: 'FILT-X 20 Inch Jumbo Filter Housing', seller: 'Chasten Water Components', price: 1599 },
      { name: 'PPVS-2-50 Vertical Multistage High Pressure Pump 1HP', seller: 'Swift Pumps & Spares', price: 12499 },
      { name: 'Edose 6 LPH Chemical Dosing Pump', seller: 'Ocean Star Technologies Pvt Ltd', price: 4299 },
      { name: 'Fluxmax Ethos 6 LPH Dosing Pump (Orange/Black)', seller: 'Ions Robinson India Pvt. Ltd.', price: 4599 },
      { name: 'LCM Electronic Dosing Pump 15–20 LPH (Black)', seller: 'Ions Robinson India Pvt. Ltd.', price: 6999 },
      { name: 'APDP Anti-Scalant Chemical Dosing Pump', seller: 'Accord Power Digital Products', price: 3899 },
      { name: 'ONTOZ 8040 Industrial RO Membrane (White)', seller: 'Velient Pec India Pvt Ltd', price: 8999, new: true },
      { name: 'Toray 4040 Commercial RO Membrane 1000 GPD (White)', seller: 'NECSAL RO Services', price: 9499, new: true },
      { name: 'Dow 1000 GPD Industrial RO Membrane', seller: 'NECSAL RO Services', price: 9999, new: true },
    ],
  },
  {
    id: 'domestic-systems',
    name: 'Domestic Systems',
    tagline: 'Complete RO+UV+TDS purifiers for every home',
    products: [
      { name: 'Olivar Storm RO+UV+TDS+ALK+CU+ZN Purifier, 14L (White)', seller: 'RGV Enterprises', price: 6999 },
      { name: 'Olivar Cyclone RO+UV+TDS+ALK+CU+ZN Purifier, 11L (White)', seller: 'RGV Enterprises', price: 5999 },
      { name: 'Olivar Cyclone RO+UV+TDS+ALK+CU+ZN Purifier, 11L (Blue)', seller: 'RGV Enterprises', price: 5999 },
      { name: 'Olivar Volcano RO+UV+TDS+ALK+CU+ZN Purifier, 10L (White)', seller: 'RGV Enterprises', price: 5499 },
      { name: 'ClearFlow Compact RO+UV Purifier, 8L (White)', seller: 'ClearFlow Solutions', price: 4599 },
      { name: 'AquaPrime 10L Under-Sink RO System (White)', seller: 'Prime Water Tech', price: 5299 },
      { name: 'Aqua Fresh BlueSmart 15 Litre Domestic RO Purifier (Multicolor)', seller: 'Ekta Aqua India', price: 5499, new: true },
      { name: 'BLUESMART Water Ionizer 7 Plate', seller: 'Ekta Aqua India', price: 24999, new: true },
      { name: 'Aqua Platinum 10 Litre Domestic RO Purifier Cabinet', seller: 'Eurofab Electronics Pvt Ltd', price: 5299, new: true },
      { name: 'Eurofab Amara RO 12 Litre Domestic System', seller: 'Eurofab Electronics Pvt Ltd', price: 4999, new: true },
      { name: 'Eurofab Riva II RO+UV 9 Litre Domestic System', seller: 'Eurofab Electronics Pvt Ltd', price: 4599, new: true },
      { name: 'Eurofab Crown RO+UV 10 Litre Domestic Purifier', seller: 'Eurofab Electronics Pvt Ltd', price: 5299, new: true },
      { name: 'Aqua Platinum RO System 10 Litre Domestic', seller: 'Eurofab Electronics Pvt Ltd', price: 5199, new: true },
      { name: 'Aqua Vivo RO+UV 12 Litre Domestic System', seller: 'Eurofab Electronics Pvt Ltd', price: 5499, new: true },
      { name: 'Aqua Teal RO+UV 12 Litre Domestic System', seller: 'Eurofab Electronics Pvt Ltd', price: 5499, new: true },
      { name: 'Aprex P90 Basic White 12 Litre Domestic RO', seller: 'NECSAL RO Services', price: 4799, new: true },
      { name: 'Pure Jal White 10 Litre RO Water Purifier', seller: 'NECSAL RO Services', price: 4599, new: true },
      { name: 'Dolphino Magic RO+UV 9 Litre Domestic System', seller: 'Eurofab Electronics Pvt Ltd', price: 4499, new: true },
      { name: 'Eurofab Karizma 12 Litre RO System Domestic', seller: 'Eurofab Electronics Pvt Ltd', price: 5099, new: true },
      { name: 'Aqua Platinum AAA Copper 10 Litre Domestic RO', seller: 'Eurofab Electronics Pvt Ltd', price: 5999, new: true },
      { name: 'Aprex P90 Exclusive Black 12 Litre Domestic RO', seller: 'NECSAL RO Services', price: 5299, new: true },
      { name: 'Eurofab Platinum II RO 12 Litre Domestic', seller: 'Eurofab Electronics Pvt Ltd', price: 5399, new: true },
    ],
  },
  {
    id: 'industrial-systems',
    name: 'Industrial Systems',
    tagline: 'High-capacity RO plants from 1000 to 15000 LPH',
    products: [
      { name: '1000 LPH Industrial RO Plant (Blue, FRP)', seller: 'MAHAKAL Water Treatment', price: 145000 },
      { name: '1000 LPH Industrial RO Plant (Blue, FRP)', seller: 'DECCAN ENTERPRISES', price: 139000 },
      { name: '3000 LPH SS304 Reverse Osmosis Industrial RO Plant', seller: 'RO Cures', price: 389000 },
      { name: 'CWWS 15000 LPH Industrial RO Plant (Green, FRP)', seller: 'CWWS India Pvt Ltd', price: 985000 },
      { name: 'BLUESMART 1000 LPH Industrial RO Plant (Blue, FRP, Single Phase)', seller: 'Ekta Aqua India', price: 142000, new: true },
      { name: '500 LPH Fully Automatic Dual Vessel Industrial RO Plant', seller: 'Evergreen Tradelink', price: 119000, new: true },
    ],
  },
  {
    id: 'domestic-brands',
    name: 'Domestic Brands',
    tagline: 'Premium branded cabinets — the Canix Aqua Iris series',
    products: [
      { name: 'Canix Aqua Iris Elite Series Phantom Black Cabinet 7L', seller: 'CAN INDUSTRIES', price: 1899 },
      { name: 'Canix Aqua Iris Elite Series Pastel Green Cabinet 7L', seller: 'CAN INDUSTRIES', price: 1899 },
      { name: 'Canix Aqua Iris Nebula Series Lavender Cabinet 7L', seller: 'CAN INDUSTRIES', price: 1799 },
      { name: 'Canix Aqua Iris Nebula Series Blue Cabinet 7L', seller: 'CAN INDUSTRIES', price: 1799 },
    ],
  },
  {
    id: 'industrial-brands',
    name: 'Industrial Brands',
    tagline: 'Trusted industrial RO plants & SS skids',
    products: [
      { name: '3D Aqua 500 LPH Industrial RO Plant (SS Skid)', seller: '3D Aqua Water Treatment', price: 119000 },
      { name: 'Stainless Steel 500 LPH SS304 Industrial RO Plant', seller: 'Ions Robinson India Pvt. Ltd.', price: 129000 },
      { name: 'NSW Automatic 150 LPH Commercial RO Plant (Blue)', seller: 'Netsol Water Solutions Pvt Ltd', price: 64000 },
      { name: '5000 LPH Commercial & Industrial RO Plant (FRP)', seller: 'Netsol Water Solutions Pvt Ltd', price: 525000 },
    ],
  },
  {
    id: 'water-softeners',
    name: 'Water Softeners',
    tagline: 'FRP & steel softening plants from 250 to 5000 LPH',
    products: [
      { name: '1500 LPH Water Softening Plant (FRP)', seller: 'Aqua Safe Mine', price: 48000 },
      { name: '250 LPH RO Water Softener Plant (FRP)', seller: 'Aqua Safe Mine', price: 22000 },
      { name: '5000 LPH Water Softener (Blue, Steel)', seller: 'Pure Water Technology', price: 96000 },
      { name: '5000 LPH Domestic Water Softener (Steel)', seller: 'Pure Water Technology', price: 89000 },
    ],
  },
  {
    id: 'cooling-ro',
    name: 'Cooling RO',
    tagline: 'Water coolers & dispensers for offices and shops',
    products: [
      { name: 'Aqua TSS150150 Water Cooler 150L (SS)', seller: 'Yash Water World', price: 28500 },
      { name: 'Atlantis Big Plus Floor Standing Water Dispenser (3 Taps)', seller: 'Tea Coffee Vending Services', price: 14999 },
      { name: 'USHA SS4080 XL Water Cooler (SS, Silver)', seller: 'Ocean Star Technologies Pvt Ltd', price: 32999 },
      { name: 'IceDrop Foot Operated Water Dispenser (White, 3 Taps)', seller: 'Krishna Enterprise', price: 9999 },
      { name: 'BlueSmart Water Chiller 2 Ton (Stainless Steel)', seller: 'Ekta Aqua India', price: 28000, new: true },
    ],
  },
  {
    id: 'water-atm',
    name: 'Water ATM',
    tagline: 'Coin & RFID water vending machines',
    products: [
      { name: 'Multi Coin Acceptor Water Vending ATM Machine (Digital)', seller: 'MS Enterprises', price: 45000 },
      { name: 'Water Vending ATM Machine with Cooler (White)', seller: 'Aquatech Solution', price: 62000 },
      { name: 'Water Vending ATM Control Device GSM RFID + LCD', seller: 'Accord Power Digital Products', price: 18500 },
      { name: '300 Liter Stainless Steel Water Vending ATM Machine', seller: 'NECSAL RO Service', price: 78000 },
      { name: 'BLUESMART Water Vending ATM Machine (Coin & Card, LCD, Programmable)', seller: 'Ekta Aqua India', price: 52000, new: true },
    ],
  },
  {
    id: 'commercial-systems',
    name: 'Commercial Systems',
    tagline: 'Compact commercial RO from 25 to 250 LPH',
    products: [
      { name: '30 LPH Commercial RO Plant (Blue)', seller: 'MCLORD', price: 26000 },
      { name: 'Kenzo 100 LPH Commercial Water System (CTO/GAC/PPF)', seller: 'Supertech Water Solution', price: 38500 },
      { name: 'Aqua Ultra 25 LPH RO+UV+TDS Alkaline Purifier', seller: 'Mayur Enterprise', price: 18999 },
      { name: '250 LPH Fully Automatic Dual Vessel Commercial RO Plant', seller: 'Evergreen Tradelink', price: 72000 },
      { name: 'MiniServe 50 LPH Commercial RO Unit (Stainless)', seller: 'MiniServe Ltd', price: 34000 },
      { name: 'CanteenPro 40 LPH RO Dispenser (3 Tap)', seller: 'CanteenPro Systems', price: 22999 },
      { name: 'BLUESMART 100 LPH Commercial RO Plant (Blue, MS)', seller: 'Ekta Aqua India', price: 38500, new: true },
      { name: 'BLUESMART 250 LPH Commercial RO Plant (Blue, FRP, Single Phase)', seller: 'Ekta Aqua India', price: 68000, new: true },
    ],
  },
  {
    id: 'bottling-plant',
    name: 'Bottling Plant',
    tagline: 'Turnkey packaging & bottling lines',
    enquiryOnly: true,
    products: [
      { name: 'Pouch Packaging Machine 2000–3000 Pouch/Hr', seller: 'NECSAL RO Services' },
      { name: '2000 LPH Water Filtering System', seller: 'Urofobes Water Engineering' },
      { name: 'EARTH RO Bulk Shrink Machine', seller: 'EARTH RO SYSTEM' },
      { name: 'Mineral Water Bottling Plant BlueSmart', seller: 'Ekta Aqua India' },
      { name: 'Packaged Drinking Water Plant (BlueSmart)', seller: 'Ekta Aqua India', new: true },
    ],
  },
  {
    id: 'water-treatment',
    name: 'Water Treatment',
    tagline: 'UF, UV disinfection & specialty treatment plants',
    enquiryOnly: true,
    products: [
      { name: 'KOCH10 Ultra Filtration System', seller: 'AYUSH AQUA SYSTEM' },
      { name: 'EARTH RO UV Commercial Ultraviolet Disinfection System', seller: 'EARTH RO SYSTEM' },
      { name: '1000 LPH Demineralized Water Plant (FRP, Semi-Auto)', seller: 'Evergreen Tradelink' },
      { name: 'Arsenic Removal Water Treatment Plant 16 KLP (Blue)', seller: 'Necsal RO' },
    ],
  },
  {
    id: 'etp-stp-zld',
    name: 'ETP/STP/ZLD',
    tagline: 'Effluent, sewage & zero-liquid-discharge solutions',
    enquiryOnly: true,
    products: [
      { name: 'EARTH RO ETP Effluent Treatment Plant', seller: 'EARTH RO SYSTEM' },
      { name: 'Effluent Treatment Plant for Hospital', seller: 'NECSAL RO Services' },
      { name: 'Sewage Treatment Plant (STP)', seller: 'Ekta Aqua India' },
      { name: 'Effluent Treatment Plant (ETP)', seller: 'Ekta Aqua India' },
    ],
  },
]

// Real subcategory tree (with CDN images) scraped from romegamart.com,
// keyed by main-category slug — which matches our category ids exactly.
import SUBCATEGORIES from './subcategories.json'

// Real product photos (name → CDN image) scraped from romegamart.com.
import PRODUCT_IMAGES from './productImages.json'

// Stable key for a product (used by wishlist / cart state).
export const productKey = (catId, p) => `${catId}::${p.name}::${p.seller}`

// Flat index: key → product (with category context) for modals & cart/wishlist.
export const PRODUCT_INDEX = {}

// Tokenise a string → set of normalised words: keep numbers (e.g. "1000",
// "4040") and alpha words ≥3 chars, singularised (pumps→pump, filters→filter).
function tokenize(str) {
  return new Set(
    str
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => /^\d+$/.test(t) || t.length >= 3)
      .map((t) => (t.length > 3 && t.endsWith('s') ? t.slice(0, -1) : t)),
  )
}

// Tag a product to the best real subcategory: among subcategories whose every
// (kept) token appears in the product name+seller, pick the most specific
// (most tokens, then longest). Returns null if none match (shows under "All").
function matchSubSlug(product, subs) {
  const hay = tokenize(`${product.name} ${product.seller}`)
  let best = null
  let bestScore = [0, 0]
  for (const s of subs) {
    if (s.name.trim().toLowerCase() === 'other') continue
    const subTokens = [...tokenize(s.name)]
    if (subTokens.length === 0 || !subTokens.every((t) => hay.has(t))) continue
    const score = [subTokens.length, subTokens.join('').length]
    if (score[0] > bestScore[0] || (score[0] === bestScore[0] && score[1] > bestScore[1])) {
      best = s.slug
      bestScore = score
    }
  }
  return best
}

// Decorate every product: real category image on the banner, a unique Unsplash
// photo per product, a key, category context + matched subcategory.
// Deterministic hash so generated details stay stable across renders.
const hash = (s) => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

const pick = (h, arr) => arr[h % arr.length]
const find = (str, re) => (str.match(re) || [])[1]

// Spec/unit/material/color words that show up as the leading token of a
// product name but are never themselves a brand — skipped when scanning a
// name for its real brand token.
const BRAND_SKIP_WORDS = new Set([
  'GPD', 'LPH', 'HP', 'TDS', 'PPM', 'INCH', 'LITER', 'LITRE', 'PHASE',
  'WHITE', 'BLUE', 'BLACK', 'GREEN', 'PURPLE', 'SILVER', 'LAVENDER', 'ORANGE', 'RED', 'GREY', 'GRAY',
  'BIG', 'JUMBO', 'PP', 'VERTICAL', 'MULTISTAGE', 'HIGH', 'PRESSURE', 'STANDARD', 'RAW', 'WATER',
  'POLYPROPYLENE', 'SS304', 'STAINLESS', 'STEEL', 'FRP', 'ABS', 'CAST', 'IRON', 'METAL', 'PLASTIC',
])

// Scan the first few words of a product name for the real brand token —
// skipping spec/unit/material/color words and pure model-number codes
// (e.g. "ELSA-100", "10"). Returns null rather than guessing from the
// seller's company name when nothing brand-like is found, since a seller
// (e.g. "Adarsh Enterprises") is not the same thing as a product brand.
const brandOf = (name) =>
  name.split(/\s+/).slice(0, 4).find(
    (w) => /^[A-Za-z][A-Za-z0-9+]*$/.test(w) && w.length > 2 && !BRAND_SKIP_WORDS.has(w.toUpperCase()),
  ) || null

// Usage label from the category.
function usageOf(catId) {
  if (catId.startsWith('domestic')) return 'Domestic'
  if (catId.startsWith('industrial')) return 'Industrial'
  if (catId.startsWith('commercial')) return 'Commercial'
  return 'Commercial / Industrial'
}

// Build a realistic spec sheet + key features + description from the product name.
function enrich(p, cat) {
  const h = hash(p.key)
  const name = p.name

  // Parse real attributes out of the product name.
  const gpd = find(name, /(\d+)\s*GPD/i)
  const tds = find(name, /(\d+)\s*(?:TDS|PPM)/i)
  const lph = find(name, /(\d+)\s*LPH/i)
  const liters = find(name, /(\d+)\s*(?:L\b|Liter|Litre)/i)
  const hp = find(name, /(\d+(?:\.\d+)?)\s*HP/i)
  const color = find(name, /\b(White|Blue|Black|Green|Purple|Silver|Lavender|Orange|Red|Grey|Gray)\b/i)
  const material = find(name, /\b(Polypropylene|SS304|Stainless Steel|FRP|ABS|Cast Iron|Steel|Metal|Plastic)\b/i)

  // Brand: the real brand-style token from the product name, if present.
  const brand = brandOf(name)

  // Pricing: derive an MRP above the selling price → show a believable discount.
  if (!p.enquiryOnly && p.price) {
    const discount = 8 + (h % 35) // 8–42% off
    p.discount = discount
    p.mrp = Math.round((p.price / (1 - discount / 100)) / 10) * 10
  }

  // Rating + reviews (mostly populated, a few with none — like the real site).
  p.rating = ((38 + (h % 12)) / 10) // 3.8–4.9
  p.reviews = h % 7 === 0 ? 0 : 5 + (h % 180)
  p.productId = 10000 + (h % 89999)
  p.brand = brand
  p.color = color || null

  const usage = usageOf(cat.id)
  const model =
    gpd ? `${gpd} GPD` : lph ? `${lph} LPH` : liters ? `${liters} Litre` : hp ? `${hp} HP` : 'Standard'

  // Specification table (only include rows we actually have).
  p.specs = Object.entries({
    'Brand Name': brand,
    'Model Number': model,
    'Usage / Application': usage,
    Color: color,
    Material: material,
    GPD: gpd ? `${gpd} GPD` : null,
    'Works Upto': tds ? `${tds} TDS` : null,
    Capacity: lph ? `${lph} LPH` : liters ? `${liters} Litre` : null,
    Power: hp ? `${hp} HP` : null,
    Warranty: cat.id.includes('spares') ? '6 Months' : '1 Year',
    'Country of Origin': 'Made in India',
  }).filter(([, v]) => v)

  // Key features.
  p.features = [
    material && `Durable ${material} construction`,
    gpd && `${gpd} GPD output for steady flow`,
    tds && `Effectively works up to ${tds} TDS`,
    lph && `High ${lph} LPH capacity`,
    `Suitable for ${usage.toLowerCase()} use`,
    'Compatible with standard RO systems',
    'Verified seller — 100% genuine product',
  ].filter(Boolean).slice(0, 5)

  // Description.
  p.description =
    `The ${name} is a high-quality ${cat.name.toLowerCase()} product offered by ${p.seller} on Romegamart, ` +
    `India's largest B2B marketplace for the RO industry. ` +
    (material ? `Built from durable ${material.toLowerCase()} material, it ` : 'It ') +
    `delivers reliable, long-lasting performance` +
    (tds ? ` and handles water with TDS levels up to ${tds}, removing dissolved salts and impurities for clean, safe water. ` : '. ') +
    `Sourced from a GST-verified seller with genuine warranty, packaging and invoicing, it is ideal for ${usage.toLowerCase()} use and easy to install and maintain.`
}

CATEGORIES.forEach((cat) => {
  cat.image = CAT_IMG[cat.id]
  cat.subcategories = SUBCATEGORIES[cat.id] || []
  // subcategory slug → its real CDN image (image fallback for unmatched products).
  const subImg = Object.fromEntries(cat.subcategories.map((s) => [s.slug, s.image]))
  cat.products.forEach((p) => {
    p.key = productKey(cat.id, p)
    p.categoryImage = cat.image
    p.catId = cat.id
    p.catName = cat.name
    p.enquiryOnly = !!cat.enquiryOnly
    p.subSlug = matchSubSlug(p, cat.subcategories)
    // Image priority: exact real product photo → real sub-category image →
    // real category image. Everything stays authentic Romegamart imagery.
    p.image = PRODUCT_IMAGES[p.name] || (p.subSlug && subImg[p.subSlug]) || cat.image
    enrich(p, cat)
    PRODUCT_INDEX[p.key] = p
  })
})

// Lookup a category by id (used by the category drill-down view).
export const getCategory = (id) => CATEGORIES.find((c) => c.id === id)

// Latest products freshly added from romegamart.com — surfaced in the
// homepage "New Arrivals" strip and prioritised in the "What's New" page.
export const NEW_PRODUCTS = Object.values(PRODUCT_INDEX).filter((p) => p.new)

// Small deterministic string hash — used below so generated seller/brand
// details (city, rating, verified) stay stable across reloads instead of
// re-randomizing every render.
export function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

// States/UTs used for the programmatic-SEO "{Sub-category} Manufacturer in
// {State}" heading on category pages — mirrors the real site's per-location
// landing-page pattern (e.g. romegamart.com/product/domestic-spares/tap/).
export const INDIAN_STATES = [
  'Delhi', 'Maharashtra', 'Tamil Nadu', 'Karnataka', 'Gujarat', 'Rajasthan',
  'Uttar Pradesh', 'West Bengal', 'Telangana', 'Punjab', 'Haryana', 'Kerala',
  'Madhya Pradesh', 'Bihar', 'Odisha', 'Assam', 'Chhattisgarh', 'Jharkhand',
  'Uttarakhand', 'Himachal Pradesh', 'Goa', 'Sikkim', 'Daman',
]

// ---------------------------------------------------------------------------
//  SELLERS — directory derived from the seller names already embedded in
//  products. City / rating / verified status are illustrative but stable.
// ---------------------------------------------------------------------------
const SELLER_CITIES = [
  'Delhi', 'Mumbai', 'Bengaluru', 'Ahmedabad', 'Surat', 'Jaipur', 'Ludhiana',
  'Indore', 'Coimbatore', 'Kanpur', 'Rajkot', 'Nagpur', 'Vadodara', 'Faridabad',
  'Ghaziabad', 'Pune',
]
const SELLER_LOCALITIES = [
  'Industrial Area Phase 2', 'Okhla Industrial Estate', 'GIDC Industrial Estate',
  'Wazirpur Industrial Area', 'Peenya Industrial Area', 'MIDC Industrial Area',
  'Mayapuri Industrial Area', 'Naraina Industrial Area', 'Sector 63 Industrial Area',
]
const SELLER_TEAM_SIZES = ['1–10 People', '11–25 People', '26–50 People', '51–100 People', '100+ People']
const SELLER_BUSINESS_TYPES = ['Manufacturer', 'Wholesaler', 'Retailer', 'Distributor', 'Trading Company', 'Exporter']

const sellerMap = new Map()
Object.values(PRODUCT_INDEX).forEach((p) => {
  if (!sellerMap.has(p.seller)) {
    const h = hashStr(p.seller)
    sellerMap.set(p.seller, {
      name: p.seller,
      city: SELLER_CITIES[h % SELLER_CITIES.length],
      locality: SELLER_LOCALITIES[h % SELLER_LOCALITIES.length],
      rating: +(3.8 + (h % 12) / 10).toFixed(1), // 3.8 – 4.9
      verified: h % 5 !== 0, // ~80% verified
      yearEstablished: 2024 - (3 + (h % 19)), // 2003 – 2021
      responseRate: 80 + (h % 19), // 80 – 98%
      teamSize: SELLER_TEAM_SIZES[(h >> 3) % SELLER_TEAM_SIZES.length],
      businessType: SELLER_BUSINESS_TYPES[(h >> 5) % SELLER_BUSINESS_TYPES.length],
      reviewCount: 18 + (h % 165), // 18 – 182, mirrors the "190 reviews" stat seen on romegamart.com
      categories: new Set(),
      productCount: 0,
    })
  }
  const s = sellerMap.get(p.seller)
  s.categories.add(p.catName)
  s.productCount += 1
})

export const SELLERS = [...sellerMap.values()]
  .map((s) => ({ ...s, categories: [...s.categories] }))
  .sort((a, b) => b.productCount - a.productCount)

// Star-count breakdown for a seller's rating summary bar chart — a closed
// form skew toward their average rating instead of looping per review.
export function sellerRatingBreakdown(seller) {
  const fiveShare = Math.min(0.85, Math.max(0.35, (seller.rating - 3) / 2))
  const remaining = 1 - fiveShare
  const five = Math.round(seller.reviewCount * fiveShare)
  const four = Math.round(seller.reviewCount * remaining * 0.55)
  const three = Math.round(seller.reviewCount * remaining * 0.25)
  const two = Math.round(seller.reviewCount * remaining * 0.12)
  const one = Math.max(0, seller.reviewCount - five - four - three - two)
  return [
    { star: 5, count: five },
    { star: 4, count: four },
    { star: 3, count: three },
    { star: 2, count: two },
    { star: 1, count: one },
  ]
}

const REVIEWER_NAMES = [
  'Rajesh Kumar', 'Anita Sharma', 'Vikram Singh', 'Priya Patel', 'Suresh Gupta',
  'Manoj Verma', 'Deepak Yadav', 'Sunita Reddy', 'Arvind Mehta', 'Kavita Joshi',
  'Ramesh Iyer', 'Neha Agarwal', 'Sanjay Nair', 'Pooja Desai', 'Ashok Tiwari',
  'Ritu Malhotra', 'Vinod Chauhan', 'Geeta Bhatt', 'Mahesh Pillai', 'Shweta Saxena',
]
const REVIEW_COMMENTS_GOOD = [
  'Genuine product quality and timely dispatch. Membrane TDS performance matches what was promised.',
  'Bulk order ke liye best supplier — pricing competitive thi aur packaging bhi solid thi.',
  'Very responsive on calls, shared product samples before the full order. Will order again.',
  'Consistent quality across batches, GST invoice provided properly every time.',
  'Good after-sales support — replaced a defective unit without any hassle.',
  'On-time delivery to our service center, no damage in transit.',
]
const REVIEW_COMMENTS_MID = [
  'Product okay tha but delivery thodi late ho gayi compared to committed date.',
  'Quality is decent for the price, packaging could be better for long-distance shipping.',
  'Had to follow up a couple of times for the invoice, otherwise fine experience.',
]
const REVIEW_COMMENTS_LOW = [
  'One unit in the batch had a minor leak, raised a replacement request.',
  'Response time on WhatsApp enquiries could be faster during peak season.',
]

// Deterministic sample reviews for a seller's profile page — illustrative
// placeholder content (this is a static demo storefront with no live
// reviews backend), generated the same stable-hash way as city/rating above
// rather than scraped from any third-party source.
export function buildSellerReviews(seller, count = 6) {
  return Array.from({ length: Math.min(count, seller.reviewCount) }, (_, i) => {
    const h = hashStr(`${seller.name}::review::${i}`)
    const roll = h % 100
    const star = roll < 55 ? 5 : roll < 80 ? 4 : roll < 92 ? 3 : roll < 97 ? 2 : 1
    const pool = star >= 4 ? REVIEW_COMMENTS_GOOD : star === 3 ? REVIEW_COMMENTS_MID : REVIEW_COMMENTS_LOW
    return {
      name: REVIEWER_NAMES[h % REVIEWER_NAMES.length],
      star,
      comment: pool[(h >> 4) % pool.length],
      daysAgo: 2 + (h % 150),
      verifiedBuyer: h % 10 < 7,
    }
  })
}

// ---------------------------------------------------------------------------
//  BRANDS — sellers listed in the dedicated Domestic/Industrial Brands
//  categories, used by the full Brands directory page.
// ---------------------------------------------------------------------------
const BRAND_CATEGORY_IDS = ['domestic-brands', 'industrial-brands']
const brandMap = new Map()
Object.values(PRODUCT_INDEX)
  .filter((p) => BRAND_CATEGORY_IDS.includes(p.catId))
  .forEach((p) => {
    if (!brandMap.has(p.seller)) {
      brandMap.set(p.seller, { name: p.seller, catId: p.catId, catName: p.catName, productCount: 0, image: p.image })
    }
    brandMap.get(p.seller).productCount += 1
  })
export const BRANDS = [...brandMap.values()].sort((a, b) => b.productCount - a.productCount)

// ---------------------------------------------------------------------------
//  HERO CAROUSEL SLIDES — banners from /public/carausal (1024×288, ~3.56)
// ---------------------------------------------------------------------------
export const HERO_SLIDES = [
  { image: '/carausal/image.png', alt: "Romegamart — India's largest B2B marketplace for RO industry" },
  { image: '/carausal/image1.png', alt: 'Romegamart — RO products & offers' },
  { image: '/carausal/second.png', alt: 'Romegamart — wholesale RO deals' },
  { image: '/carausal/Gemini_Generated_Image_q3sv5sq3sv5sq3sv.png', alt: "Romegamart — India's B2B RO marketplace" },
]

// ---------------------------------------------------------------------------
//  PROMO / OFFER STRIPS
// ---------------------------------------------------------------------------
export const PROMOS = [
  {
    title: 'Flash Sale',
    subtitle: 'Limited-time wholesale deals on bestsellers',
    tag: 'FLASH',
    gradient: 'from-accent-600 to-red-500',
    image: 'https://images.romegamart.com/media/front_image/BEST_Prices_1.webp',
    target: 'flash',
  },
  {
    title: "What's New This Week",
    subtitle: 'Fresh arrivals across every category',
    tag: 'NEW',
    gradient: 'from-aqua-500 to-aqua-700',
    image: 'https://images.romegamart.com/media/front_image/Whats_new_this_week.webp',
    target: 'whats-new',
  },
  {
    title: 'Crazy Sale',
    subtitle: 'Limited-time blowout deals',
    tag: 'SALE',
    gradient: 'from-accent-500 to-aqua-600',
    image: 'https://images.romegamart.com/media/front_image/Crazy_sale.webp',
    target: 'crazy-sale',
  },
  {
    title: 'Best Brand',
    subtitle: 'Top-rated manufacturers, curated',
    tag: 'TOP',
    gradient: 'from-navy-700 to-aqua-700',
    image: 'https://images.romegamart.com/media/front_image/TOP_BRANDS.webp',
    target: 'all-brands',
  },
  {
    title: 'In Demand',
    subtitle: 'What buyers are ordering right now',
    tag: 'HOT',
    gradient: 'from-aqua-600 to-accent-500',
    image: 'https://images.romegamart.com/media/front_image/In-demand-2_4_1.webp',
    target: 'categories-grid',
  },
  { title: 'Suggested For You', subtitle: 'Picks based on the RO industry', tag: 'FOR YOU', gradient: 'from-aqua-700 to-navy-700', target: 'categories-grid' },
  { title: 'Best Price', subtitle: 'Lowest verified B2B prices', tag: 'VALUE', gradient: 'from-accent-600 to-aqua-700', target: 'categories-grid' },
  { title: 'Domestic Spares Kit', subtitle: 'Everything to service a home RO', tag: 'KIT', gradient: 'from-navy-800 to-aqua-600', image: 'https://images.romegamart.com/media/front_image/Domestic_Spares_kits.webp', target: 'domestic-spares' },
]

// Real per-category homepage banners (matched to the live romegamart.com sections).
const FRONT = 'https://images.romegamart.com/media/front_image'
export const BANNER_IMAGES = {
  'domestic-spares': `${FRONT}/Domestic_Spares_kits.webp`,
  'domestic-brands': `${FRONT}/Domestic-Brands-Banner_3_1.webp`,
  'industrial-brands': `${FRONT}/INdustrial-Brands-Banner.webp`,
  'cooling-ro': '/banners/coolingro.png',
  'domestic-systems': '/banners/domesticsystems.png',
  'industrial-spares': '/banners/industrialspares.png',
  'industrial-systems': '/banners/industrialsystems.png',
  'commercial-systems': '/banners/commercialsystem.png',
  'water-atm': '/banners/wateratm.png',
  'water-softeners': '/banners/watersoftner.png',
  'bottling-plant': '/banners/boilingplant.png',
  'water-treatment': '/banners/watertreatment.png',
  'etp-stp-zld': '/banners/ETP_STP_ZLD.png',
}

// ---------------------------------------------------------------------------
//  TOP BRANDS (logo row)
// ---------------------------------------------------------------------------
export const TOP_BRANDS = [
  'Sarah Aquasoft',
  'BLUE HAWK',
  'EUROFAB',
  'Ontoz',
  'Liv Drop',
  'BLUESMART',
  'Evergreen Tradelink',
  'ASTER INDUSTRIES',
  'Accord',
  'Pure Jal',
  'RSE',
  'Nextech',
  'LG',
  'Dow',
]

// ---------------------------------------------------------------------------
//  REAL BRANDS — scraped from romegamart.com/brands (141 brands with logos)
// ---------------------------------------------------------------------------
export const REAL_BRANDS = [
  { name: 'Sarah Aquasoft', logo: 'https://images.romegamart.com/media/brand_image/Sarah_Aquasoft_logo.png' },
  { name: 'BLUE HAWK', logo: 'https://images.romegamart.com/media/brand_image/BLUE_HAWK_logo.jpg' },
  { name: 'EUROFAB', logo: 'https://images.romegamart.com/media/brand_image/EUROFAB_logo.png' },
  { name: 'Ontoz', logo: 'https://images.romegamart.com/media/brand_image/Ontoz_logo_kkBgBV2.png' },
  { name: 'Liv Drop', logo: 'https://images.romegamart.com/media/brand_image/Liv_Drop_logo_N486K7j.jpg' },
  { name: 'BLUESMART', logo: 'https://images.romegamart.com/media/brand_image/BLUESMART_logo_4iOfswL.jpg' },
  { name: 'Evergreen Tradelink', logo: 'https://images.romegamart.com/media/brand_image/Evergreen_Tradelink_logo_7MlQF39.jpg' },
  { name: 'ASTER INDUSTRIES', logo: 'https://images.romegamart.com/media/brand_image/ASTER_INDUSTRIES_logo_IY4H7q3.jpg' },
  { name: 'Accord', logo: 'https://images.romegamart.com/media/brand_image/Accord_logo_alt69aq.jpg' },
  { name: 'Pure Jal', logo: 'https://images.romegamart.com/media/brand_image/Pure_Jal_qIuvld4.jpg' },
  { name: 'RSE', logo: 'https://images.romegamart.com/media/brand_image/RSE_logo_igbYk1e.jpg' },
  { name: 'Nextech', logo: 'https://images.romegamart.com/media/brand_image/Nextech_logo_KlPRIv5.png' },
  { name: 'LG', logo: 'https://images.romegamart.com/media/brand_image/LG_logo_2l1LsI0.png' },
  { name: 'Dow', logo: 'https://images.romegamart.com/media/brand_image/Dow_logo_G5QpzUG.png' },
  { name: 'Duken', logo: 'https://images.romegamart.com/media/brand_image/Duken_logo_e0XcA1E.png' },
  { name: 'Pio Pure', logo: 'https://images.romegamart.com/media/brand_image/Pio_Pure_logo_c4HRiZb.jpg' },
  { name: 'SAFE AQUA', logo: 'https://images.romegamart.com/media/brand_image/SAFE_AQUA_logo_ok8E2Q3.png' },
  { name: 'LIVE FLOW', logo: 'https://images.romegamart.com/media/brand_image/LIVE_FLOW_logo_h8kvClr.png' },
  { name: 'KELVIN', logo: 'https://images.romegamart.com/media/brand_image/KELVIN_logo_TlzXe8Q.png' },
  { name: 'AquaIndia', logo: 'https://images.romegamart.com/media/brand_image/AquaIndia_logo_hXvT5Xr.jpg' },
  { name: 'AQUA AXEL', logo: 'https://images.romegamart.com/media/brand_image/AQUA_AXEL_logo_LMo4MRH.jpg' },
  { name: 'Apple PLUS', logo: 'https://images.romegamart.com/media/brand_image/Apple_PLUS_logo_2SqrO9N.jpg' },
  { name: 'Purella', logo: 'https://images.romegamart.com/media/brand_image/Purella_logo_2LzOUJV.jpg' },
  { name: 'Shreyvart', logo: 'https://images.romegamart.com/media/brand_image/Shreyvart_logo_lHIzOvM.png' },
  { name: 'ALL PURE ULTRA', logo: 'https://images.romegamart.com/media/brand_image/ALL_PURE_ULTRA_logo_92FPXzw.png' },
  { name: 'AQUA JIL', logo: 'https://images.romegamart.com/media/brand_image/AQUA_JIL_logo_s2mKvLY.png' },
  { name: 'AQUA Roma', logo: 'https://images.romegamart.com/media/brand_image/AQUA_Roma_logo_0AK5DrE.png' },
  { name: 'AQUA SONNET', logo: 'https://images.romegamart.com/media/brand_image/AQUA_SONNET_logo_QtXcvT9.png' },
  { name: 'Aqua Touch', logo: 'https://images.romegamart.com/media/brand_image/Aqua_Touch_logo_5J1I6US.png' },
  { name: 'CLEAN WATER', logo: 'https://images.romegamart.com/media/brand_image/CLEAN_WATER_logo_KITmPw0.png' },
  { name: 'NOVA STAR', logo: 'https://images.romegamart.com/media/brand_image/NOVA_STAR_logo_36WnC6C.png' },
  { name: 'NOVEX PRO', logo: 'https://images.romegamart.com/media/brand_image/NOVEX_PRO_logo_bAR5Hb1_rJCWWF5.png' },
  { name: 'Waterllily', logo: 'https://images.romegamart.com/media/brand_image/Waterllily_logo_slMCLhj.png' },
  { name: 'Water Net', logo: 'https://images.romegamart.com/media/brand_image/Water_Net_logo_lRHj49P.png' },
  { name: 'SHAPURE', logo: 'https://images.romegamart.com/media/brand_image/SHAPURE_logo_XOhYUYR.png' },
  { name: 'CSM', logo: 'https://images.romegamart.com/media/brand_image/CSM_logo_ibwpBAH.png' },
  { name: 'Drink Pure Water', logo: 'https://images.romegamart.com/media/brand_image/Drink_Pure_Water_logo_rl5A8xi.jpg' },
  { name: 'Pournima', logo: 'https://images.romegamart.com/media/brand_image/Pournima_logo_wETdmjt.jpg' },
  { name: 'Pacific', logo: 'https://images.romegamart.com/media/brand_image/Pacific_logo_i5qLGk6.jpg' },
  { name: 'Aqua Ultra', logo: 'https://images.romegamart.com/media/brand_image/Aqua_Ultra_logo_COcLX7V.png' },
  { name: 'KENZO', logo: 'https://images.romegamart.com/media/brand_image/KENZO_logo_t2hGIBE.jpg' },
  { name: 'HM DIGITAL', logo: 'https://images.romegamart.com/media/brand_image/HM_DIGITAL_logo_MooKmCv.jpg' },
  { name: 'PUROXY', logo: 'https://images.romegamart.com/media/brand_image/PUROXY_logo_t0lrxuD.jpg' },
  { name: 'IPC Pumps', logo: 'https://images.romegamart.com/media/brand_image/IPC_Pumps_logo_5ktcHBl.png' },
  { name: 'Merlin', logo: 'https://images.romegamart.com/media/brand_image/Merlin_logo_VgTj0IV.png' },
  { name: 'Camlin', logo: 'https://images.romegamart.com/media/brand_image/Camlin_logo_xMzV88T.jpg' },
  { name: 'NetSol Water', logo: 'https://images.romegamart.com/media/brand_image/NetSol_Water_logo_CB1F3L7.jpg' },
  { name: 'Ions Robinson', logo: 'https://images.romegamart.com/media/brand_image/Ions_Robinson_logo_81a4roU.png' },
  { name: 'Aqua RO', logo: 'https://images.romegamart.com/media/brand_image/Aqua_RO_logo_mStShN0.png' },
  { name: 'VEPO', logo: 'https://images.romegamart.com/media/brand_image/VEPO_logo_UsvPKNp.jpg' },
  { name: 'PLATINUM WASSER', logo: 'https://images.romegamart.com/media/brand_image/PLATINUM_WASSER_logo_FxetvrD.png' },
  { name: 'Blue Filters', logo: 'https://images.romegamart.com/media/brand_image/Blue_Filters_logo_Pi1QuYY.png' },
  { name: 'Toray', logo: 'https://images.romegamart.com/media/brand_image/Toray_logo_2gBRCzP.jpg' },
  { name: 'THAI AQUA', logo: 'https://images.romegamart.com/media/brand_image/THAI_AQUA_logo_2heLXap.png' },
  { name: 'IceDrop', logo: 'https://images.romegamart.com/media/brand_image/ice_drop_logo_Aju5M41.png' },
  { name: 'MAXWAY', logo: 'https://images.romegamart.com/media/brand_image/maxway_logo_4wa5VGZ.png' },
  { name: 'P-Tech', logo: 'https://images.romegamart.com/media/brand_image/P-TECH_logo_MnSVFrS.jpg' },
  { name: 'Acuro', logo: 'https://images.romegamart.com/media/brand_image/acuro_logo_N5t9XO5.jpg' },
  { name: 'Blue Bell', logo: 'https://images.romegamart.com/media/brand_image/Blue_Bell_logo_R0j6Lkn.jpg' },
  { name: 'NEXLin', logo: 'https://images.romegamart.com/media/brand_image/nexlin_logo_twRlDYR.jpg' },
  { name: 'USHA', logo: 'https://images.romegamart.com/media/brand_image/usha_logo_tGjwzE5.jpg' },
  { name: 'Ocean Star', logo: 'https://images.romegamart.com/media/brand_image/ocean-star_logo_sHskknt.jpg' },
  { name: 'Organic Series', logo: 'https://images.romegamart.com/media/brand_image/organic-series_logo_cTvUn6s.jpg' },
  { name: 'NANSHE', logo: 'https://images.romegamart.com/media/brand_image/NANSHE_LOGO_05vS8yk.jpg' },
  { name: 'BNQS', logo: 'https://images.romegamart.com/media/brand_image/bnqs_logo_cWs09Yr.jpg' },
  { name: 'NECSAL', logo: 'https://images.romegamart.com/media/brand_image/necsal_logo_huQ904E_lNnH3Yi.png' },
  { name: '3D Aqua', logo: 'https://images.romegamart.com/media/brand_image/3d_aqua_logo_zPpwhID.jpg' },
  { name: 'Puriex', logo: 'https://images.romegamart.com/media/brand_image/pureix_logo_6KoVg6H.jpg' },
  { name: 'Acualine', logo: 'https://images.romegamart.com/media/brand_image/acualine__logo_f4spFOK.jpg' },
  { name: 'UWEK', logo: 'https://images.romegamart.com/media/brand_image/uwek_logo_dHqL29V.jpg' },
  { name: 'AMIKON', logo: 'https://images.romegamart.com/media/brand_image/Amikon_2ko9sXn.jpg' },
  { name: 'EARTH RO SYSTEM', logo: 'https://images.romegamart.com/media/brand_image/Earth_Ro_System_xehX2py.jpg' },
  { name: 'Pure Drop', logo: 'https://images.romegamart.com/media/brand_image/PURE_DROP_LOGO_OhDBDyJ_fMLG7RQ.jpg' },
  { name: 'Wave', logo: 'https://images.romegamart.com/media/brand_image/Wave_RO_cJTwA7o.png' },
  { name: 'APTITUDE', logo: 'https://images.romegamart.com/media/brand_image/Aptitude_logo_1pX9zPE.jpg' },
  { name: 'Kaveri', logo: 'https://images.romegamart.com/media/brand_image/kaveri_logo_1gc9GSx.jpg' },
  { name: 'PUROFIC', logo: 'https://images.romegamart.com/media/brand_image/purofic_logo_lRTWrw6.jpg' },
  { name: 'ROTEK', logo: 'https://images.romegamart.com/media/brand_image/ROTEK_LOGO_SrZ9Wkz.jpg' },
  { name: 'ZETTA', logo: 'https://images.romegamart.com/media/brand_image/zetta_logo_MA0E6sJ.jpg' },
  { name: 'DANFROST', logo: 'https://images.romegamart.com/media/brand_image/dan_frost_logo_MZ4hzds.jpg' },
  { name: 'RAINFORD', logo: 'https://images.romegamart.com/media/brand_image/WhatsApp_Image_2024-07-10_at_12_7OQtKsc.19.55_PM.jpeg' },
  { name: 'VATS', logo: 'https://images.romegamart.com/media/brand_image/vats_logo_1_KUheBiu.jpg' },
  { name: 'Aqua', logo: 'https://images.romegamart.com/media/brand_image/aqua_logo_7Fre7Rs.jpg' },
  { name: 'OSMOTECH', logo: 'https://images.romegamart.com/media/brand_image/osmotech_logo_copy_C46MLwt.jpg' },
  { name: 'PHILIPS', logo: 'https://images.romegamart.com/media/brand_image/philips_logo_fHgP7tn.jpg' },
  { name: 'Healthy', logo: 'https://images.romegamart.com/media/brand_image/Healthy_kBF9pe0_WxtZ3Sc.jpg' },
  { name: 'PITALIYA', logo: 'https://images.romegamart.com/media/brand_image/PITALIYA_WATERTECH_INDUSTRIES_xpcg4lH_fxhwhc3.jpg' },
  { name: 'Hydro', logo: 'https://images.romegamart.com/media/brand_image/Hydro_Wound_1_uQOAr6D.jpg' },
  { name: 'LAGOON', logo: 'https://images.romegamart.com/media/brand_image/Lagoon_1_79ux8uE.jpg' },
  { name: 'Oceanic', logo: 'https://images.romegamart.com/media/brand_image/mmp_ceanic_IZbZIWK.jpg' },
  { name: 'Pyoorite', logo: 'https://images.romegamart.com/media/brand_image/Pyoorite_oDBEktQ.jpg' },
  { name: 'R & G', logo: 'https://images.romegamart.com/media/brand_image/rg_logo_1_h9lKGtR.jpg' },
  { name: 'FASTRACK', logo: 'https://images.romegamart.com/media/brand_image/fastrack_0FBmwN6.jpg' },
  { name: 'YANA', logo: 'https://images.romegamart.com/media/brand_image/YANA_UtrAo0u.png' },
  { name: 'Bio +', logo: 'https://images.romegamart.com/media/brand_image/bio__54EkpFD.jpg' },
  { name: 'Flow Life', logo: 'https://images.romegamart.com/media/brand_image/Flow_Life_pg7YWYi.jpg' },
  { name: 'KALKI', logo: 'https://images.romegamart.com/media/brand_image/Kalki_POZs72k.jpg' },
  { name: 'SWIFT', logo: 'https://images.romegamart.com/media/brand_image/123_4vDMPVU.jpg' },
  { name: 'SBP', logo: 'https://images.romegamart.com/media/brand_image/SBP_uxMCNLs.jpg' },
  { name: 'AD TECK', logo: 'https://images.romegamart.com/media/brand_image/Aptitude_logo_copy_cXtXYmu.jpg' },
  { name: 'Lexpure', logo: 'https://images.romegamart.com/media/brand_image/lexpure_QSaYhbB_2HDxtNb.jpg' },
  { name: 'Vostok', logo: 'https://images.romegamart.com/media/brand_image/VOSTOK_cYB2KBt.jpg' },
  { name: 'Mercy', logo: 'https://images.romegamart.com/media/brand_image/MERCY_916szKT.jpg' },
  { name: 'Hi-Flo', logo: 'https://images.romegamart.com/media/brand_image/Hi-Flow_PJenct3.jpg' },
  { name: 'Lexcru', logo: 'https://images.romegamart.com/media/brand_image/Lexcru_pWF1gvd.jpg' },
  { name: 'Star X', logo: 'https://images.romegamart.com/media/brand_image/Stat_X_4GOmzYS.jpg' },
  { name: 'Aqua Grand', logo: 'https://images.romegamart.com/media/brand_image/AQUA_GRAND_vh2KCyh.png' },
  { name: 'AQUA LIFELINE', logo: 'https://images.romegamart.com/media/brand_image/INTEGRATION_AQUA_gOo3616.png' },
  { name: 'PUROSIS', logo: 'https://images.romegamart.com/media/brand_image/Purosis_JH8rWRr.png' },
  { name: 'DR AQUAGRAND', logo: 'https://images.romegamart.com/media/brand_image/DR_AQUAGARD_QeiYYAt.png' },
  { name: 'Ao Smith', logo: 'https://images.romegamart.com/media/brand_image/AO_SMITH__O0gBeQ3.png' },
  { name: 'CFCH Technology', logo: 'https://images.romegamart.com/media/brand_image/Call_For_Career_Healthcure_Pvt_Ltd_9vo3EiP_HxuOAkN.png' },
  { name: 'APPLE', logo: 'https://images.romegamart.com/media/brand_image/APPLE_WATRE_PURIFIER_v7LJyDM.png' },
  { name: 'AQUAX PRIME', logo: 'https://images.romegamart.com/media/brand_image/AQUA_X_PRIME_cTLsvwH.png' },
  { name: 'WATER X', logo: 'https://images.romegamart.com/media/brand_image/WATER_X_PLUS__sdIdJGM.png' },
  { name: 'AQUAX SERIES', logo: 'https://images.romegamart.com/media/brand_image/AQUA_X_SERIES_CABINET_csIQf7K.png' },
  { name: 'NEXUS', logo: 'https://images.romegamart.com/media/brand_image/NEXUSSERIES_WATER_PURIFIER_NZwP4oa.png' },
  { name: 'NEEL GUARD', logo: 'https://images.romegamart.com/media/brand_image/Neel_Guard_LCz6EXf.jpg' },
  { name: 'ATLANTIS', logo: 'https://images.romegamart.com/media/brand_image/ATLANTIS_C81NyzE.jpg' },
  { name: 'AQUAHOLIK', logo: 'https://images.romegamart.com/media/brand_image/AQUAHOLIK_kZeIN1L.png' },
  { name: 'APEX', logo: 'https://images.romegamart.com/media/brand_image/Apex_rqrE7zC.jpg' },
  { name: 'Nile', logo: 'https://images.romegamart.com/media/brand_image/NILE_wLoLLne.jpg' },
  { name: 'Osprey', logo: 'https://images.romegamart.com/media/brand_image/image_1_yQrvwN4_iRZZf9d.jpeg' },
  { name: 'Aquafresh', logo: 'https://images.romegamart.com/media/brand_image/image_9M4ke3I_GjXviwA.jpeg' },
  { name: 'KYK', logo: 'https://images.romegamart.com/media/brand_image/KYK_zsLFhFA.jpg' },
  { name: 'Meeraj', logo: 'https://images.romegamart.com/media/brand_image/Meeraj_1_i7JcfUh.jpg' },
  { name: 'ALKA PUMP', logo: 'https://images.romegamart.com/media/brand_image/AlKA_Pumps.jpg' },
  { name: 'KFLOW', logo: 'https://images.romegamart.com/media/brand_image/Kamflo_copy.jpg' },
  { name: 'KEMFLO', logo: 'https://images.romegamart.com/media/brand_image/Kamflow.jpg' },
  { name: 'LIQUID', logo: 'https://images.romegamart.com/media/brand_image/Liquid.jpg' },
  { name: 'Cruze', logo: 'https://images.romegamart.com/media/brand_image/Cruze.jpg' },
  { name: 'Cloud', logo: 'https://images.romegamart.com/media/brand_image/International_Cloud.jpg' },
  { name: 'Vontron', logo: 'https://images.romegamart.com/media/brand_image/Vontrow.jpg' },
  { name: 'CWWS', logo: 'https://images.romegamart.com/media/brand_image/logo-final.png' },
  { name: 'Olix', logo: 'https://images.romegamart.com/media/brand_image/Screenshot_2025-08-12_143926.png' },
  { name: 'Jet Aqua', logo: 'https://images.romegamart.com/media/brand_image/JET-AQUA-LOGO.png' },
  { name: 'NEXARO', logo: 'https://images.romegamart.com/media/brand_image/image_1.png' },
  { name: 'Captain Pure', logo: 'https://images.romegamart.com/media/brand_image/logo-captain-pure_g8HHzQ1.jpg' },
  { name: 'Olivar International', logo: 'https://images.romegamart.com/media/brand_image/olivar_internsiol.webp' },
  { name: 'CANIX', logo: 'https://images.romegamart.com/media/brand_image/Canixx-Logo.jpg' },
]

// ---------------------------------------------------------------------------
//  STATS BAND — animated count-up targets
// ---------------------------------------------------------------------------
export const STATS = [
  { label: 'Products Listed', value: 100000, suffix: '+' },
  { label: 'Verified Sellers', value: 2000, suffix: '+' },
  { label: 'Cities Served', value: 500, suffix: '+' },
]

// ---------------------------------------------------------------------------
//  ABOUT — real copy sourced from romegamart.com/about-us
// ---------------------------------------------------------------------------
export const ABOUT = {
  mission:
    "To build India's most reliable and complete B2B marketplace for the water purification industry — a single platform where every RO business can source quality products, connect with trusted suppliers, and scale efficiently.",
  vision:
    'To support the growth of RO manufacturers, wholesalers and technicians by offering a trustworthy ecosystem that simplifies procurement, reduces operational challenges and enhances business opportunities across India.',
  intro:
    "Romegamart is India's dedicated B2B marketplace built exclusively for the RO and water purification industry, connecting manufacturers, wholesalers, OEM suppliers and bulk buyers across the country to source genuine RO products at competitive wholesale prices.",
}

// "Why businesses choose us" — real points from the About page.
export const WHY_CHOOSE = [
  { title: 'Verified Suppliers', desc: 'Every manufacturer & supplier is pre-verified with GST, PAN and address proof.' },
  { title: 'Bulk B2B Pricing', desc: 'Wholesale pricing built for large-volume dealers and distributors.' },
  { title: 'PAN-India Delivery', desc: 'Logistics network reaching every state, including Tier 2 & Tier 3 cities.' },
  { title: 'Secure & Transparent', desc: 'Safe payments, clear invoicing, warranty and real-time order tracking.' },
  { title: 'Free Seller Listings', desc: 'List your products at zero listing fee and reach serious buyers.' },
  { title: 'Seller Growth Tools', desc: 'SEO-friendly product pages and analytics dashboards to grow sales.' },
]

// "Who we serve" — real audience list from the About page.
export const WHO_WE_SERVE = [
  'OEM Manufacturers',
  'RO Assemblers',
  'Wholesalers & Distributors',
  'Industrial & Commercial Buyers',
  'Field Technicians & Service Companies',
]
