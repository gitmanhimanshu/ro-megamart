import { Boxes, Factory, ArrowRight, BadgePercent, Headset } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * CtaBlocks — two conversion-focused promo CTAs: Bulk Orders and Industrial
 * Solutions. Both open the AquaBot enquiry form via onEnquire.
 */
export default function CtaBlocks({ onEnquire }) {
  const ref = useScrollReveal()

  return (
    <section ref={ref} className="reveal mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-5 md:grid-cols-2">
        {/* Bulk Orders */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-aqua-600 to-navy-800 p-7 text-white shadow-soft sm:p-9">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <Boxes className="h-9 w-9 text-aqua-200" />
          <h3 className="mt-4 text-2xl font-bold">Bulk &amp; Wholesale Orders</h3>
          <p className="mt-2 max-w-md text-sm text-white/85">
            Buying in volume? Get special wholesale pricing, dedicated support and faster fulfilment for large quantities.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/90">
            <li className="inline-flex items-center gap-1.5"><BadgePercent className="h-4 w-4 text-accent-400" /> Best B2B rates</li>
            <li className="inline-flex items-center gap-1.5"><Headset className="h-4 w-4 text-accent-400" /> Dedicated manager</li>
          </ul>
          <button
            onClick={onEnquire}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-navy-800 transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            Get Bulk Quote <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Industrial Solutions */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900 to-aqua-700 p-7 text-white shadow-soft sm:p-9">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <Factory className="h-9 w-9 text-aqua-200" />
          <h3 className="mt-4 text-2xl font-bold">Industrial RO Solutions</h3>
          <p className="mt-2 max-w-md text-sm text-white/85">
            Need a turnkey plant? From 250 LPH to 15000 LPH — get a custom RO/ETP/STP solution engineered for your site.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/90">
            <li className="inline-flex items-center gap-1.5"><Factory className="h-4 w-4 text-accent-400" /> Custom capacity</li>
            <li className="inline-flex items-center gap-1.5"><Headset className="h-4 w-4 text-accent-400" /> Free consultation</li>
          </ul>
          <button
            onClick={onEnquire}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-navy-800 transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            Request a Quote <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
