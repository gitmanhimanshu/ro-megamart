import { ArrowRight } from 'lucide-react'
import ProductCard from './ProductCard'
import CategoryBanner from './CategoryBanner'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { BANNER_IMAGES } from '../data'

/**
 * CategorySection — one homepage category block:
 *  - heading row (category name + "View All Offer")
 *  - a wide banner image
 *  - 4 featured product cards
 */
export default function CategorySection({ category, onOpenCategory, isWished, onToggleWish, onView, onBuyNow, isLoggedIn, onRequireLogin }) {
  const ref = useScrollReveal()
  const { id, name, products } = category
  const bannerImage = BANNER_IMAGES[id]
  const hasBanner = !!bannerImage
  const featured = products.slice(0, 4)

  return (
    <section ref={ref} id={id} className="reveal mx-auto max-w-7xl scroll-mt-28 px-4 py-8">
      {/* Heading + View All */}
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-navy-900 sm:text-2xl">{name}</h2>
        <button
          onClick={() => onOpenCategory(id)}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-aqua-700 transition-colors hover:text-aqua-800"
        >
          View All Offer
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Wide banner carousel — real photo + a generated brand promo slide. */}
      {hasBanner && (
        <CategoryBanner category={category} bannerImage={bannerImage} onOpen={() => onOpenCategory(id)} />
      )}

      {/* Featured products — full cards with price, Buy Now & wishlist */}
      <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {featured.map((product) => (
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
