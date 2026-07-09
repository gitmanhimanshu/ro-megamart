import { TOP_BRANDS, PROMOS } from '../data'
import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * TopBrands — marquee-style logo row of leading brands.
 * Duplicated list creates a seamless infinite scroll.
 */
export default function TopBrands() {
  const ref = useScrollReveal()

  return (
    <section ref={ref} id="brands" className="reveal scroll-mt-28 border-y border-slate-200/70 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Optional large banner artwork (e.g. "Best Brand") */}
        {(() => {
          const promo = PROMOS.find((p) => p.tag === 'TOP' || p.title?.toLowerCase().includes('brand'))
          return promo && promo.image ? (
            <div className="mb-6 overflow-hidden rounded-2xl">
              <img src={promo.image} alt={promo.title || 'Top Brands'} className="h-36 w-full object-cover" />
            </div>
          ) : (
            <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-slate-400">
              Top Brands on Romegamart
            </p>
          )
        })()}

        <div className="no-scrollbar group relative overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-4 group-hover:[animation-play-state:paused]">
            {[...TOP_BRANDS, ...TOP_BRANDS].map((brand, i) => (
              <div
                key={`${brand}-${i}`}
                className="flex h-16 min-w-[180px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-6 text-center font-display text-lg font-semibold tracking-tight text-navy-700 transition-colors hover:border-aqua-300 hover:bg-white hover:text-aqua-700"
              >
                {brand}
              </div>
            ))}
          </div>
          {/* Edge fade masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>
    </section>
  )
}
