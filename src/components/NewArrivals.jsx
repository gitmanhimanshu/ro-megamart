import { ArrowRight, Sparkles } from 'lucide-react'
import ProductCard from './ProductCard'

/**
 * NewArrivals — homepage strip highlighting the latest products freshly added
 * from romegamart.com, each carrying a "NEW" badge on its card. Gives new
 * stock prominent, picture-forward placement near the top of the page.
 */
export default function NewArrivals({
  products,
  onViewAll,
  isWished,
  onToggleWish,
  onView,
  onBuyNow,
  isLoggedIn,
  onRequireLogin,
}) {
  if (!products || products.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-aqua-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            <Sparkles className="h-3.5 w-3.5" /> New
          </span>
          <h2 className="text-lg font-bold text-navy-900 sm:text-2xl">New Arrivals</h2>
        </div>
        <button
          onClick={onViewAll}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-aqua-700 transition-colors hover:text-aqua-800"
        >
          View all
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.slice(0, 10).map((product) => (
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
    </section>
  )
}
