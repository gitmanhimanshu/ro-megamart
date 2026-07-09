/**
 * SEO Blog content for categories, subcategories, brands, and sellers.
 * Matches real romegamart.com format with descriptions, benefits, and popular links.
 */

const STATES = ['Delhi', 'Maharashtra', 'Tamil Nadu', 'Karnataka', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Telangana', 'Punjab', 'Haryana', 'Kerala', 'Madhya Pradesh', 'Bihar', 'Odisha', 'Assam', 'Chhattisgarh', 'Jharkhand', 'Uttarakhand', 'Himachal Pradesh', 'Goa', 'Sikkim']

function popularLinks(categoryName, catId) {
  const links = STATES.map(st => `<li><a href="/category/${catId}">${categoryName} in ${st}</a></li>`).join('')
  return `<h3>Popular Links</h3><ul class="popular-links">${links}</ul>`
}

export const CATEGORY_BLOGS = {
  'domestic-spares': {
    title: 'Domestic RO Spare Parts — Wholesale B2B Supply Across India',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO industry. Browse a wide range of <strong>domestic RO spare parts</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every domestic spare parts listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Source Domestic Spare Parts on Romegamart?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    <h3>Popular Domestic RO Spare Parts</h3>
    <ul>
      <li><strong>RO Membranes</strong> — 50 GPD, 75 GPD, 100 GPD, 200 GPD membranes from top brands like Vontron, DOW, and LG</li>
      <li><strong>RO Pumps</strong> — Diaphragm pumps, booster pumps, and membrane pumps for domestic systems</li>
      <li><strong>SMPS</strong> — Switched-mode power supplies for RO systems</li>
      <li><strong>Filter Cartridges</strong> — PP spun filters, carbon filters, sediment filters</li>
      <li><strong>Cabinets</strong> — Domestic RO cabinets in various designs and colors</li>
      <li><strong>UV Lamps &amp; Barrels</strong> — UV purification components</li>
      <li><strong>TDS Controllers</strong> — Adjust water TDS levels</li>
      <li><strong>Solenoid Valves (SV)</strong> — Auto water shut-off valves</li>
    </ul>
    ${popularLinks('Domestic Spare Parts', 'domestic-spares')}`
  },

  'industrial-spares': {
    title: 'Industrial RO Spare Parts — Wholesale B2B Supply Across India',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO industry. Browse a wide range of <strong>industrial RO spare parts</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every industrial spare parts listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Source Industrial Spare Parts on Romegamart?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    <h3>Popular Industrial RO Components</h3>
    <ul>
      <li><strong>Industrial Membranes</strong> — 4040, 8040 RO membranes from Vontron, Toray, DOW</li>
      <li><strong>High Pressure Pumps</strong> — Vertical and horizontal multistage pumps</li>
      <li><strong>FRP Vessels</strong> — Fiber-reinforced plastic pressure vessels</li>
      <li><strong>Dosing Pumps</strong> — Chemical dosing systems for water treatment</li>
      <li><strong>RO Panels</strong> — Control panels with auto-flush and monitoring</li>
      <li><strong>Rota Meters</strong> — Flow measurement devices</li>
      <li><strong>Pressure Gauges</strong> — SS and brass pressure gauges</li>
      <li><strong>Carbon Media &amp; Resin</strong> — Activated carbon and ion exchange resin</li>
    </ul>
    ${popularLinks('Industrial Spare Parts', 'industrial-spares')}`
  },

  'domestic-systems': {
    title: 'Domestic Systems — Wholesale B2B Supply Across India',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO (reverse osmosis) industry. Browse a wide range of <strong>domestic systems</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every domestic systems listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Source Domestic Systems on Romegamart?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    <h3>Types of Domestic RO Systems</h3>
    <ul>
      <li><strong>RO Water Purifiers</strong> — Reverse osmosis purification for TDS reduction</li>
      <li><strong>RO+UV Purifiers</strong> — Double purification with UV sterilization</li>
      <li><strong>RO+UV+UF Purifiers</strong> — Triple purification for maximum safety</li>
      <li><strong>Gravity-based Purifiers</strong> — Non-electric water purifiers</li>
      <li><strong>Hot &amp; Cold Water Purifiers</strong> — Dispensers with temperature control</li>
    </ul>
    ${popularLinks('Domestic Systems', 'domestic-systems')}`
  },

  'industrial-systems': {
    title: 'Industrial Systems — Wholesale B2B Supply Across India',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO industry. Browse a wide range of <strong>industrial systems</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every industrial systems listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Source Industrial Systems on Romegamart?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    <h3>Industrial RO Plant Capacities</h3>
    <ul>
      <li><strong>100-500 LPH</strong> — Small commercial RO plants</li>
      <li><strong>500-2000 LPH</strong> — Medium-scale industrial systems</li>
      <li><strong>2000-10000 LPH</strong> — Large industrial RO plants</li>
      <li><strong>10000+ LPH</strong> — Heavy-duty water treatment plants</li>
    </ul>
    ${popularLinks('Industrial Systems', 'industrial-systems')}`
  },

  'water-softeners': {
    title: 'Water Softeners — Wholesale B2B Supply Across India',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO industry. Browse a wide range of <strong>water softeners</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every water softener listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Source Water Softeners on Romegamart?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    <h3>Types of Water Softeners</h3>
    <ul>
      <li><strong>Domestic Water Softeners</strong> — Compact systems for homes</li>
      <li><strong>Commercial Water Softeners</strong> — Heavy-duty systems for businesses</li>
      <li><strong>Industrial Water Softeners</strong> — Large-capacity softening plants</li>
      <li><strong>Inline Water Softeners</strong> — Install directly in water line</li>
    </ul>
    ${popularLinks('Water Softeners', 'water-softeners')}`
  },

  'water-atm': {
    title: 'Water ATM Machines — Wholesale B2B Supply Across India',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO industry. Browse a wide range of <strong>Water ATM machines</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every Water ATM listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Source Water ATM Machines on Romegamart?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    <h3>Water ATM Features</h3>
    <ul>
      <li><strong>RO + UV Purification</strong> — Multi-stage water treatment</li>
      <li><strong>Card/UPI Payment</strong> — Cashless transaction support</li>
      <li><strong>Remote Monitoring</strong> — Track water quality and sales</li>
      <li><strong>Multiple Dispensing Points</strong> — Serve multiple users simultaneously</li>
    </ul>
    ${popularLinks('Water ATM Machines', 'water-atm')}`
  },

  'bottling-plant': {
    title: 'Bottling Plant Machines — Wholesale B2B Supply Across India',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO industry. Browse a wide range of <strong>bottling plant machines</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every bottling plant listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Source Bottling Plant Machines on Romegamart?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    <h3>Bottling Plant Equipment</h3>
    <ul>
      <li><strong>Water Filling Machines</strong> — Automatic bottle filling systems</li>
      <li><strong>Capping Machines</strong> — Screw cap and ROPP capping</li>
      <li><strong>Labeling Machines</strong> — Front and back label application</li>
      <li><strong>Shrink Wrap Machines</strong> — Bundle wrapping for transport</li>
      <li><strong>Bottle Rinser</strong> — Pre-fill bottle cleaning</li>
    </ul>
    ${popularLinks('Bottling Plant Machines', 'bottling-plant')}`
  },

  'commercial-systems': {
    title: 'Commercial Systems — Wholesale B2B Supply Across India',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO industry. Browse a wide range of <strong>commercial systems</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every commercial systems listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Source Commercial Systems on Romegamart?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    <h3>Commercial RO Plant Capacities</h3>
    <ul>
      <li><strong>50-200 LPH</strong> — Small commercial setups</li>
      <li><strong>200-500 LPH</strong> — Medium commercial plants</li>
      <li><strong>500-1000 LPH</strong> — Large commercial systems</li>
      <li><strong>1000+ LPH</strong> — Heavy commercial installations</li>
    </ul>
    ${popularLinks('Commercial Systems', 'commercial-systems')}`
  },

  'water-treatment': {
    title: 'Water Treatment Plants — Wholesale B2B Supply Across India',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO industry. Browse a wide range of <strong>water treatment plants</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every water treatment listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Source Water Treatment Plants on Romegamart?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    <h3>Water Treatment Solutions</h3>
    <ul>
      <li><strong>STP (Sewage Treatment Plant)</strong> — Treat wastewater for reuse</li>
      <li><strong>ETP (Effluent Treatment Plant)</strong> — Industrial wastewater treatment</li>
      <li><strong>ZLD (Zero Liquid Discharge)</strong> — Zero discharge systems</li>
      <li><strong>DM Plants</strong> — Demineralization systems</li>
      <li><strong>UF &amp; MF Systems</strong> — Ultrafiltration and microfiltration</li>
    </ul>
    ${popularLinks('Water Treatment Plants', 'water-treatment')}`
  },

  'etp-stp-zld': {
    title: 'ETP, STP & ZLD Systems — Wholesale B2B Supply Across India',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO industry. Browse a wide range of <strong>ETP, STP &amp; ZLD systems</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every ETP/STP/ZLD listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Source ETP, STP &amp; ZLD on Romegamart?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    <h3>Wastewater Treatment Systems</h3>
    <ul>
      <li><strong>ETP</strong> — Effluent treatment for textile, pharma, and chemical industries</li>
      <li><strong>STP</strong> — Sewage treatment for residential and commercial complexes</li>
      <li><strong>ZLD</strong> — Zero liquid discharge for zero environmental impact</li>
      <li><strong>MBR Systems</strong> — Membrane bioreactor technology</li>
    </ul>
    ${popularLinks('ETP, STP & ZLD Systems', 'etp-stp-zld')}`
  },

  'cooling-ro': {
    title: 'Cooling RO Systems — Wholesale B2B Supply Across India',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO industry. Browse a wide range of <strong>cooling RO systems</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every cooling RO listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Source Cooling RO Systems on Romegamart?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    <h3>Cooling Water Treatment</h3>
    <ul>
      <li><strong>Cooling Tower Chemicals</strong> — Antiscalant, biocide, and corrosion inhibitors</li>
      <li><strong>Cooling Water RO</strong> — Makeup water treatment for cooling towers</li>
      <li><strong>Circulating Water Systems</strong> — Closed-loop cooling systems</li>
    </ul>
    ${popularLinks('Cooling RO Systems', 'cooling-ro')}`
  },

  'domestic-brands': {
    title: 'Domestic RO Brands — Wholesale B2B Supply Across India',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO industry. Browse a wide range of <strong>domestic RO brands</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every domestic brand listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Source Domestic RO Brands on Romegamart?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    <h3>Top Domestic RO Brands</h3>
    <ul>
      <li><strong>Kent</strong> — India's most trusted water purifier brand</li>
      <li><strong>Aquaguard</strong> — 35+ years of trust in water purification</li>
      <li><strong>Blue Star</strong> — Premium water purifiers</li>
      <li><strong>Havells</strong> — Quality water purification systems</li>
      <li><strong>AO Smith</strong> — Advanced RO technology</li>
    </ul>
    ${popularLinks('Domestic RO Brands', 'domestic-brands')}`
  },

  'industrial-brands': {
    title: 'Industrial RO Brands — Wholesale B2B Supply Across India',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO industry. Browse a wide range of <strong>industrial RO brands</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every industrial brand listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Source Industrial RO Brands on Romegamart?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    <h3>Top Industrial RO Brands</h3>
    <ul>
      <li><strong>DOW Filmtec</strong> — Industry-leading RO membranes</li>
      <li><strong>Hydranautics</strong> — High-performance membranes</li>
      <li><strong>Toray</strong> — Japanese quality RO membranes</li>
      <li><strong>CRI Pumps</strong> — Energy-efficient pumps</li>
      <li><strong>Kirloskar</strong> — Trusted industrial pumps</li>
    </ul>
    ${popularLinks('Industrial RO Brands', 'industrial-brands')}`
  },
}

export const SUBCATEGORY_BLOGS = {
  'membrane': {
    title: 'RO Membranes — Wholesale B2B Supply Across India',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO industry. Browse a wide range of <strong>RO membranes</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every RO membrane listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Source RO Membranes on Romegamart?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    <h3>Types of RO Membranes</h3>
    <ul>
      <li><strong>50 GPD Membranes</strong> — For domestic RO systems</li>
      <li><strong>75 GPD Membranes</strong> — Higher flow domestic systems</li>
      <li><strong>100 GPD Membranes</strong> — High-flow domestic systems</li>
      <li><strong>4040 Membranes</strong> — Commercial RO systems</li>
      <li><strong>8040 Membranes</strong> — Industrial RO systems</li>
    </ul>
    ${popularLinks('RO Membranes', 'domestic-spares')}`
  },
  'pumps': {
    title: 'RO Pumps — Wholesale B2B Supply Across India',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO industry. Browse a wide range of <strong>RO pumps</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every RO pump listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Source RO Pumps on Romegamart?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    <h3>RO Pump Types</h3>
    <ul>
      <li><strong>Diaphragm Pumps</strong> — For domestic RO systems</li>
      <li><strong>Booster Pumps</strong> — Increase water pressure</li>
      <li><strong>High Pressure Pumps</strong> — For industrial RO systems</li>
      <li><strong>Vertical Multistage Pumps</strong> — Commercial applications</li>
    </ul>
    ${popularLinks('RO Pumps', 'domestic-spares')}`
  },
  'cabinets': {
    title: 'RO Cabinets — Wholesale B2B Supply Across India',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO industry. Browse a wide range of <strong>RO cabinets</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every RO cabinet listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Source RO Cabinets on Romegamart?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    <h3>RO Cabinet Types</h3>
    <ul>
      <li><strong>Wall-mount Cabinets</strong> — Space-saving designs</li>
      <li><strong>Countertop Cabinets</strong> — Desktop water purifiers</li>
      <li><strong>Under-sink Cabinets</strong> — Hidden installation</li>
      <li><strong>Designer Cabinets</strong> — Premium looks</li>
    </ul>
    ${popularLinks('RO Cabinets', 'domestic-spares')}`
  },
}

export const BRAND_BLOGS = {
  'LG': {
    title: 'LG Water Purifiers — Wholesale B2B Supply Across India',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO industry. Browse a wide range of <strong>LG water purifiers</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every LG product listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Source LG Products on Romegamart?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    <h3>LG RO Features</h3>
    <ul>
      <li><strong>Multi-Stage Purification</strong> — RO + UV + UF</li>
      <li><strong>Smart Indicators</strong> — Filter change and water quality alerts</li>
      <li><strong>Stainless Steel Tank</strong> — Hygienic water storage</li>
      <li><strong>High Storage Capacity</strong> — 5-8 liters</li>
    </ul>
    ${popularLinks('LG Water Purifiers', 'domestic-systems')}`
  },
  'Kent': {
    title: 'Kent Water Purifiers — Wholesale B2B Supply Across India',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO industry. Browse a wide range of <strong>Kent water purifiers</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every Kent product listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Source Kent Products on Romegamart?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    <h3>Kent RO Range</h3>
    <ul>
      <li><strong>Kent Pearl</strong> — Wall-mount RO+UV+UF</li>
      <li><strong>Kent Ace</strong> — Under-sink RO system</li>
      <li><strong>Kent Prime</strong> — Premium RO+UV+UF+TDS</li>
      <li><strong>Kent Max</strong> — Commercial RO systems</li>
    </ul>
    ${popularLinks('Kent Water Purifiers', 'domestic-systems')}`
  },
  'Vontron': {
    title: 'Vontron RO Membranes — Wholesale B2B Supply Across India',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO industry. Browse a wide range of <strong>Vontron RO membranes</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every Vontron product listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Source Vontron Products on Romegamart?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    <h3>Vontron Membrane Range</h3>
    <ul>
      <li><strong>UTR Series</strong> — Ultra-thin membrane elements</li>
      <li><strong>UPE Series</strong> — High-rejection elements</li>
      <li><strong>USS Series</strong> — High-recovery elements</li>
      <li><strong>UPA Series</strong> — Low-pressure elements</li>
    </ul>
    ${popularLinks('Vontron RO Membranes', 'domestic-spares')}`
  },
}

export const SELLER_BLOGS = {
  'default': {
    title: 'Wholesale RO Products — Buy from Verified Sellers',
    content: `<p>Romegamart is India's 1st &amp; largest B2B marketplace for the RO industry. Browse a wide range of <strong>RO products</strong> from verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for businesses, water plants, service centres and bulk buyers across the country.</p>
    <p>Every listing comes from a <strong>GST-verified seller</strong> with genuine warranty, proper invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly with suppliers — no middlemen, no inflated retail margins.</p>
    <h3>Why Buy from Romegamart Sellers?</h3>
    <ul>
      <li>Verified manufacturers, dealers &amp; distributors</li>
      <li>Wholesale B2B pricing with bulk discounts</li>
      <li>Genuine products with warranty &amp; GST invoice</li>
      <li>PAN-India delivery, incl. Tier 2 &amp; Tier 3 cities</li>
    </ul>
    ${popularLinks('RO Products', 'domestic-spares')}`
  },
}
