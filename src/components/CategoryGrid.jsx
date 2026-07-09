import { CATEGORIES } from '../data'
import { useScrollReveal } from '../hooks/useScrollReveal'
import SmartImage from './SmartImage'

/**
 * CategoryGrid — shows category cards.
 * - compact=true (default): simple grid for homepage
 * - compact=false: full layout with subcategories for /category page
 */
export default function CategoryGrid({ onOpenCategory, compact = true }) {
  const ref = useScrollReveal()

  if (compact) {
    // Homepage — simple grid of category cards
    return (
      <section ref={ref} id="categories-grid" className="reveal mx-auto max-w-7xl scroll-mt-28 px-4 py-12">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-aqua-600">Browse</p>
          <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">Shop by Category</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            Explore {CATEGORIES.length} categories of RO products from verified sellers across India.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onOpenCategory(cat.id)}
              className="group flex flex-col items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-3 text-center shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-aqua-300 hover:shadow-lift sm:p-4"
            >
              <span className="relative block aspect-square w-full overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-100 transition-all group-hover:ring-aqua-200">
                <SmartImage
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full"
                  imgClassName="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                />
              </span>
              <span className="text-xs font-bold leading-tight text-navy-800 group-hover:text-aqua-700 sm:text-sm">
                {cat.name}
              </span>
              <span className="hidden text-[11px] text-slate-400 sm:block">{cat.subcategories?.length || 0} sub-categories</span>
            </button>
          ))}
        </div>
      </section>
    )
  }

  // /category page — full layout with subcategories below each category
  return (
    <section ref={ref} id="categories-grid" className="reveal mx-auto max-w-7xl scroll-mt-28 px-4 py-12">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-aqua-600">Browse</p>
        <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">All Categories</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
          Explore {CATEGORIES.length} categories of RO products from verified sellers across India.
        </p>
      </div>

      <div className="space-y-6">
        {CATEGORIES.map((cat) => {
          const subcategories = cat.subcategories || []

          return (
            <div key={cat.id} className="rounded-2xl border border-slate-200/80 bg-white shadow-soft overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => onOpenCategory(cat.id)}
                className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-slate-50 group"
              >
                <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-100 transition-all group-hover:ring-aqua-200 sm:h-16 sm:w-16">
                  <SmartImage
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full"
                    imgClassName="h-full w-full object-contain p-1.5 transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-navy-800 group-hover:text-aqua-700 sm:text-base">
                    {cat.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {subcategories.length} sub-categories
                  </p>
                </div>
                <svg className="h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:text-aqua-600 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>

              {/* Subcategories */}
              {subcategories.length > 0 && (
                <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {subcategories.map((sub) => (
                      <button
                        key={sub.slug}
                        onClick={() => onOpenCategory(cat.id, sub.slug)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600 transition-all hover:border-aqua-300 hover:bg-aqua-50 hover:text-aqua-700 sm:text-xs"
                      >
                        {sub.image && (
                          <img src={sub.image} alt="" className="h-4 w-4 rounded-sm object-contain" />
                        )}
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
