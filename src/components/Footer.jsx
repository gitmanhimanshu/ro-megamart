import { useState } from 'react'
import { PhoneCall, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube, Send, CheckCircle2 } from 'lucide-react'
import { CATEGORIES } from '../data'

// Sitewide footer link farm — category → sub-type links, mirroring
// romegamart.com's footer. Each sub-item opens a product search for that term;
// the heading opens the full category page.
const FOOTER_LINKS = [
  { cat: 'Domestic Spares', id: 'domestic-spares', items: ['Cabinets', 'Membrane', 'Pumps', 'Membranes Housing', 'Carbon Filter', 'Filters', 'Filter Cartridge', 'PP Spun Filter', 'Filter Housing', 'UV Lamp', 'UV Barrel', 'UV Chock', 'SMPS', 'Stands', 'SV', 'Tap', 'Electrolizer', 'TDS Meter', 'Float', 'TDS Adjuster', 'Spanner', 'Flow Restrictor', 'Pipe Roll', 'Fitting', 'Teflon Tape', 'Clamp', 'Pressure Tank', 'Other'] },
  { cat: 'Industrial Spares', id: 'industrial-spares', items: ['Membranes', 'High Pressure Pump', 'Filters', 'Housing', 'SS Stand', 'FRV Vessel', 'Raw Water Pump', 'Filter Housing', 'Dosing Pump', 'RO Panel', 'LPS/HPS', 'Rota Meter', 'Pressure Gauge', 'Multiple Valve', 'Carbon Media', 'Resin', 'TDS/PH Meter', 'SS Vessel', 'Chemicals', 'UV Set', 'SS Filter House', 'SV', 'Sand Media', 'RO Skid', 'SS Membrane HSG', 'Water Testing Kit', 'Float', 'Other'] },
  { cat: 'Domestic Systems', id: 'domestic-systems', items: ['Wall Mount', 'Table Tab RO', 'Under Sink RO', 'Water Purifiers', 'Non-Electric', 'Imported RO', 'Ionizer', 'Other'] },
  { cat: 'Industrial Systems', id: 'industrial-systems', items: ['50 LPH RO', '100 LPH RO', '120 LPH RO', '150 LPH RO', '250 LPH RO', '400 LPH RO', '500 LPH RO', '600 LPH RO', '1000 LPH RO', '2000 LPH RO', '3000 LPH RO', '4000 LPH RO', '5000 LPH RO', '6000 LPH RO', '7000 LPH RO', '8000 LPH RO', '9000 LPH RO', '10000 LPH RO', '1000 LPH SS RO', '2000 LPH SS RO', '3000 LPH SS RO', '4000 LPH SS RO', '5000 LPH SS RO', '6000 LPH SS RO', '7000 LPH SS RO', '8000 LPH SS RO', '9000 LPH SS RO', '10000 LPH SS RO', '250 LPH SS', '500 LPH SS', 'Other'] },
  { cat: 'Domestic Brands', id: 'domestic-brands', items: ['Purella', 'Merlin', 'Camlin', 'Kenzo', 'VEPO', 'SHAPURE', 'AquaIndia', 'SAFE AQUA', 'BLUESMART', 'ACUALINE', 'Pio Pure', 'NANSHE', 'EARTH RO SYSTEM', 'Wave', 'CANIX'] },
  { cat: 'Industrial Brands', id: 'industrial-brands', items: ['NetSol Water', 'BLUESMART', 'BLUE HAWK', 'Ions Robinson', '3D AQUA', 'Evergreen Tradelink', 'EARTH RO SYSTEM', 'AD TECK'] },
  { cat: 'Water Softeners', id: 'water-softeners', items: ['200 LPH WS', '500 LPH WS', '1000 LPH WS', '1500 LPH WS', '2000 LPH WS', '3000 LPH WS', '4000 LPH WS', 'Other'] },
  { cat: 'Cooling RO', id: 'cooling-ro', items: ['Dispenser', 'Dispenser With RO', 'Water Cooler', 'Water Cooler With RO', 'Online Chiller', 'SS Chiller', 'Other'] },
  { cat: 'Water ATM', id: 'water-atm', items: ['WVM Device', 'Coin Acceptor', 'SV', 'Flow Sensor', '100 LPH WVM', '250 LPH WVM', '500 LPH WVM', '1000 LPH WVM', 'Porta Cabin', 'KIOSK', 'Other'] },
  { cat: 'Commercial Systems', id: 'commercial-systems', items: ['25 LPH', '30 LPH', '50 LPH', '60 LPH', '100 LPH', '120 LPH', '150 LPH', '200 LPH', '250 LPH', '500 LPH', '1000 LPH', '250 LPH SS', '500 LPH SS', '1000 LPH SS', '100 LPH UV', '250 LPH UV', '500 LPH UV', '750 LPH', 'Other'] },
  { cat: 'Bottling Plant', id: 'bottling-plant', items: ['SS Plant', 'Filling Machine', 'Bottle Blowing', 'Batch Coding Machine', 'Glass Packaging', 'Other'] },
]

/* Newsletter signup — self-contained (client-only). */
function Newsletter() {
  const [done, setDone] = useState(false)
  return (
    <div className="border-b border-white/10 bg-navy-800/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <h3 className="text-lg font-bold text-white">Stay in the loop 💧</h3>
          <p className="mt-1 text-sm text-aqua-100/70">Get new arrivals, B2B deals & RO industry updates in your inbox.</p>
        </div>
        {done ? (
          <p className="inline-flex items-center gap-2 rounded-lg bg-accent-500/15 px-4 py-3 text-sm font-semibold text-accent-400">
            <CheckCircle2 className="h-4 w-4" /> Subscribed — thank you!
          </p>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setDone(true) }}
            className="flex w-full max-w-md gap-2"
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-aqua-100/50 focus:border-aqua-400 focus:bg-white/15"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-gradient-to-r from-aqua-500 to-accent-500 px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
            >
              <Send className="h-4 w-4" /> Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

/**
 * Footer — brand info, category links, contact details,
 * app store badges and social icons.
 */
export default function Footer({ onSeller, onTrack, onOpenCategory, onBlogs, onSellers, onBrands, onContact }) {
  // Company links: some open modals/views, the rest are plain anchors.
  const companyLinks = [
    { label: 'About Us', href: '#about' },
    { label: 'Become a Seller', onClick: onSeller },
    { label: 'Seller Login', onClick: onSeller },
    { label: 'All Sellers', onClick: onSellers },
    { label: 'All Brands', onClick: onBrands },
    { label: 'Blogs', onClick: onBlogs },
    { label: 'Contact Us', onClick: onContact },
    { label: 'Track Order', onClick: onTrack },
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms & Conditions', href: '#terms' },
  ]

  return (
    <footer id="about" className="bg-navy-900 text-aqua-100/80">
      <Newsletter />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/romegamart-logo.webp" alt="Romegamart" className="h-11 w-11 rounded-full" />
            <span className="font-display text-xl font-bold tracking-tight text-white">
              ROME<span className="text-aqua-400">GAMART</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            India's 1st &amp; largest B2B marketplace for the RO industry — connecting manufacturers,
            dealers, distributors, retailers &amp; technicians.
          </p>

          {/* Social */}
          <div className="mt-5 flex gap-2">
            {[
              { Icon: Facebook, label: 'Facebook' },
              { Icon: Instagram, label: 'Instagram' },
              { Icon: Linkedin, label: 'LinkedIn' },
              { Icon: Youtube, label: 'YouTube' },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#social"
                aria-label={`Romegamart on ${label}`}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-aqua-500"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Categories</h3>
          <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <button onClick={() => onOpenCategory(c.id)} className="text-left transition-colors hover:text-white">
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Company</h3>
          <ul className="space-y-2 text-sm">
            {companyLinks.map((item) => (
              <li key={item.label}>
                {item.onClick ? (
                  <button onClick={item.onClick} className="transition-colors hover:text-white">
                    {item.label}
                  </button>
                ) : (
                  <a href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + apps */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Get in touch</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="tel:18008898529" className="flex items-center gap-2 transition-colors hover:text-white">
                <PhoneCall className="h-4 w-4 text-accent-400" />
                Helpline 1800-889-8529
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent-400" />
              support@romegamart.com
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
              Romegamart, India
            </li>
          </ul>

          {/* App store badges — real Romegamart assets */}
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="https://play.google.com/store/apps/details?id=com.ro_mart.ro_mart" target="_blank" rel="noopener noreferrer" aria-label="Get it on Google Play">
              <img src="/play_store-img.webp" alt="Get it on Google Play" className="h-11 w-auto rounded-md transition-transform hover:-translate-y-0.5" />
            </a>
            <a href="https://apps.apple.com/us/app/romegamart/id6550910373" target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store">
              <img src="/app_store-img.webp" alt="Download on the App Store" className="h-11 w-auto rounded-md transition-transform hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Sitewide category link farm — every sub-type is a clickable link
          (opens a product search), like romegamart.com's footer. */}
      <div className="border-t border-white/10 bg-navy-900/60">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">Browse by Category</h3>
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {FOOTER_LINKS.map((group) => (
              <div key={group.id}>
                <button
                  onClick={() => onOpenCategory(group.id)}
                  className="mb-2 text-left text-[13px] font-bold text-aqua-300 transition-colors hover:text-white"
                >
                  {group.cat}
                </button>
                <p className="text-xs leading-relaxed text-aqua-100/55">
                  {group.items.map((item, i) => (
                    <span key={item}>
                      {i > 0 && <span className="px-1 text-white/20">|</span>}
                      <button
                        onClick={() => onOpenCategory(group.id)}
                        className="transition-colors hover:text-white hover:underline"
                      >
                        {item}
                      </button>
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-aqua-100/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Romegamart. All rights reserved.</p>
          <p>Made for the RO industry of India 💧</p>
        </div>
      </div>
    </footer>
  )
}
