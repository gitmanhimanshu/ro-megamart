import { SearchX, ArrowLeft, Search, SlidersHorizontal } from 'lucide-react'
import ProductCard from './ProductCard'
import { useCategoryFilters } from './CategoryFilterSidebar'

/**
 * SearchResults — shown in place of the browse content while a query is active.
 * Uses the same sidebar filter design as CategoryView (Color/Brand/Rating/Price).
 */
export default function SearchResults({ query, results, onClear, isWished, onToggleWish, onView, onBuyNow, isLoggedIn, onRequireLogin }) {
  const { filtered, sidebar, activeCount } = useCategoryFilters(results)

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onClear}
          className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-aqua-700 hover:text-aqua-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back to browse
        </button>
        <h2 className="flex items-center gap-2 text-xl font-bold text-navy-800 sm:text-2xl">
          <Search className="h-5 w-5 text-aqua-500" />
          Results for "{query}"
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {results.length} {results.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400">
            <SearchX className="h-7 w-7" />
          </span>
          <p className="max-w-sm text-slate-500">
            No products match <span className="font-semibold text-navy-800">"{query}"</span>. Try a different
            membrane, pump, brand or category.
          </p>
          <button
            onClick={onClear}
            className="rounded-full bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          {/* Sidebar — same design as CategoryView */}
          <aside className="rounded-2xl border border-slate-200/80 bg-white p-4 lg:sticky lg:top-20 lg:self-start">
            {sidebar}
          </aside>

          {/* Product grid */}
          <div>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Results</h2>
              <span className="text-sm text-slate-500">{filtered.length} {filtered.length === 1 ? 'product' : 'products'}</span>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-14 text-center">
                <p className="text-sm text-slate-500">
                  {activeCount > 0
                    ? 'No products match the selected filters.'
                    : 'No products found.'}
                </p>
                {activeCount > 0 && (
                  <button onClick={onClear} className="rounded-full bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.key}
                    product={product}
                    wished={isWished(product.key)}
                    onToggleWish={onToggleWish}
                    onView={onView}
                    onBuyNow={onBuyNow}
                    isLoggedIn={isLoggedIn}
                    onRequireLogin={onRequireLogin}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
