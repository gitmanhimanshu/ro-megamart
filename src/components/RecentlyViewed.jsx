import { useRef, useState, useEffect, useCallback } from 'react'
import { History, ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react'
import ProductCard from './ProductCard'

/**
 * RecentlyViewed — horizontally scrollable strip of the buyer's last-viewed
 * products (max 10, newest first, sourced from App's `recentlyViewed` —
 * persisted to localStorage). Renders nothing until there's at least one
 * viewed product.
 */
export default function RecentlyViewed({
  products, isWished, onToggleWish, onView, onBuyNow, isLoggedIn, onRequireLogin, onRemove, onClear,
}) {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    updateScrollState()
  }, [products, updateScrollState])

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  if (!products.length) return null

  return (
    <section id="recently-viewed" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-100 text-slate-500">
            <History className="h-4 w-4" />
          </span>
          <h2 className="text-lg font-bold text-navy-800">Recently Viewed</h2>
          <span className="text-xs text-slate-400">({products.length}/10)</span>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear all
          </button>
        )}
      </div>

      <div className="relative">
        {/* Left edge fade + scroll button (desktop) */}
        {canScrollLeft && (
          <>
            <div className="pointer-events-none absolute -left-1 top-0 z-10 h-full w-10 bg-gradient-to-r from-slate-50 to-transparent" />
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="absolute -left-2 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-navy-800 shadow-lift transition-transform hover:scale-110 sm:grid"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </>
        )}
        {/* Right edge fade + scroll button (desktop) */}
        {canScrollRight && (
          <>
            <div className="pointer-events-none absolute -right-1 top-0 z-10 h-full w-10 bg-gradient-to-l from-slate-50 to-transparent" />
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="absolute -right-2 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-navy-800 shadow-lift transition-transform hover:scale-110 sm:grid"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
        >
          {products.map((product) => (
            <div key={product.key} className="relative w-40 shrink-0 snap-start sm:w-48">
              {onRemove && (
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(product.key) }}
                  aria-label={`Remove ${product.name} from recently viewed`}
                  className="absolute left-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-slate-500 shadow-soft backdrop-blur transition-all hover:scale-110 hover:text-red-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <ProductCard
                product={product}
                wished={isWished(product.key)}
                onToggleWish={onToggleWish}
                onView={onView}
                onBuyNow={onBuyNow}
                isLoggedIn={isLoggedIn}
                onRequireLogin={onRequireLogin}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
