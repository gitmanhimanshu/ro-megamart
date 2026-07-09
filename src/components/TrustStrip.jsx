import { ShieldCheck, Truck, Lock, BadgeIndianRupee } from 'lucide-react'

/**
 * TrustStrip — quick B2B credibility signals shown under the hero.
 */
const ITEMS = [
  { icon: ShieldCheck, title: 'Verified Sellers', sub: 'GST & PAN checked' },
  { icon: BadgeIndianRupee, title: 'Wholesale Pricing', sub: 'Bulk B2B rates' },
  { icon: Truck, title: 'PAN-India Delivery', sub: 'Tier 2 & 3 covered' },
  { icon: Lock, title: 'Secure Payments', sub: 'Safe & transparent' },
]

export default function TrustStrip() {
  return (
    <section className="mx-auto mt-6 max-w-7xl px-4">
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-soft md:grid-cols-4 md:gap-4 md:p-4">
        {ITEMS.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-aqua-50/60">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-aqua-50 text-aqua-600">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-navy-800">{title}</p>
              <p className="truncate text-xs text-slate-500">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
