import { ArrowUpRight } from 'lucide-react'
import { PROMOS } from '../data'
import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * PromoStrip — a responsive grid of offer/promo cards
 * (What's New, Crazy Sale, Best Brand, In Demand, etc.).
 */
export default function PromoStrip({ onNavigate }) {
  const ref = useScrollReveal()

  return (
    <section ref={ref} id="promos" className="reveal mx-auto max-w-7xl scroll-mt-28 px-4 py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-aqua-600">Offers</p>
          <h2 className="text-2xl font-bold text-navy-900">Deals across the marketplace</h2>
        </div>
      </div>

      {/* Wider cards (1–2 per row) — the promo artwork is an ultra-wide
          banner, so narrow grid cells crop it heavily. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PROMOS.map((promo) => (
          <PromoBanner key={promo.title} {...promo} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  )
}

/** PromoBanner — single gradient offer card. */
export function PromoBanner({ title, subtitle, tag, gradient, image, target, onNavigate }) {
  const handleClick = (e) => {
    e.preventDefault()
    if (onNavigate && target) {
      onNavigate(target)
    } else {
      document.getElementById(target || 'categories-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <a
      href={`#${target || 'categories-grid'}`}
      onClick={handleClick}
      className={`group relative flex min-h-[120px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift`}
    >
      {/* Full-bleed background photo (when provided) with a left→right dark
          overlay so the text stays readable on top. Falls back to the
          gradient card when no image is set. */}
      {image && (
        <>
          <img
            src={image}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-center opacity-95 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />
        </>
      )}

      <span className="relative z-10 inline-flex w-fit rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
        {tag}
      </span>
      <div className="relative z-10">
        <h3 className="text-base font-bold leading-tight drop-shadow-sm">{title}</h3>
        <p className="mt-1 text-xs text-white/90 drop-shadow-sm">{subtitle}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold">
          Shop now
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  )
}
