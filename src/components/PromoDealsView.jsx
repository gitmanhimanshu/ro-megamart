import { ArrowLeft, PackageSearch, Sparkles, BadgePercent, Zap } from 'lucide-react'
import ProductCard from './ProductCard'
import LoopCarousel from './LoopCarousel'
import { PRODUCT_INDEX, PROMOS } from '../data'
import { Helmet } from 'react-helmet-async'

/**
 * PromoDealsView — dedicated landing page for a homepage promo card
 * ("What's New This Week", "Crazy Sale", ...), mirroring how
 * romegamart.com gives each offer banner its own page instead of just
 * scrolling to a homepage section.
 */
const BUILDERS = {
  flash: () =>
    Object.values(PRODUCT_INDEX)
      .filter((p) => p.discount)
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 30),
  'whats-new': () => {
    const all = Object.values(PRODUCT_INDEX)
    const fresh = all.filter((p) => p.new)
    const rest = all.filter((p) => !p.new).slice(-24).reverse()
    return [...fresh, ...rest].slice(0, 30)
  },
  'crazy-sale': () =>
    Object.values(PRODUCT_INDEX)
      .filter((p) => !p.enquiryOnly && p.discount)
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 24),
}

export default function PromoDealsView({ kind, onClose, isWished, onToggleWish, onView, onBuyNow, isLoggedIn, onRequireLogin }) {
  const promo = PROMOS.find((p) => p.target === kind) || PROMOS[0]
  const products = (BUILDERS[kind] || BUILDERS['whats-new'])()

  const isCrazySale = kind === 'crazy-sale'
  const isFlash = kind === 'flash'
  const maxDiscount = (isCrazySale || isFlash) ? Math.max(0, ...products.map((p) => p.discount || 0)) : 0
  const StatIcon = isCrazySale || isFlash ? BadgePercent : Sparkles
  const statValue = isCrazySale || isFlash ? `Up to ${maxDiscount}% OFF` : `${products.length}+ New`
  const statLabel = isCrazySale || isFlash ? 'Bulk pricing, limited stock — order now' : 'Added across every category this week'

  const seoTitle = isFlash ? 'Flash Sale — Wholesale RO Parts & Accessories | Romegamart'
    : isCrazySale ? 'Crazy Sale — Best B2B Deals on RO Parts | Romegamart'
    : `${promo.title} | Romegamart B2B Marketplace`
  const seoDesc = isFlash
    ? 'Grab limited-time flash sale deals on RO membranes, spares, and accessories. Best wholesale prices verified across 2000+ sellers.'
    : `${promo.title} — ${promo.subtitle}. Shop verified B2B wholesale deals at Romegamart, India's #1 RO marketplace.`

  const slides = [
    <div className={`relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br ${promo.gradient} p-5 text-white sm:p-8`}>
      {/* Full-bleed background photo + dark overlay for readable text */}
      {promo.image && (
        <>
          <img src={promo.image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/15" />
        </>
      )}
      <span className="relative z-10 inline-flex w-fit rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
        {promo.tag}
      </span>
      <div className="relative z-10">
        <h1 className="text-base font-bold leading-tight drop-shadow-sm sm:text-xl">{promo.title}</h1>
        <p className="mt-1 text-xs text-white/90 drop-shadow-sm sm:text-sm">{promo.subtitle}</p>
      </div>
    </div>,
    <div className={`relative flex h-full w-full flex-col justify-center overflow-hidden bg-gradient-to-tr ${promo.gradient} px-6 sm:px-10`}>
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <span className="relative inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
        <StatIcon className="h-3 w-3" /> {isCrazySale ? 'Best Deal' : 'Fresh Picks'}
      </span>
      <p className="relative mt-2 text-2xl font-extrabold text-white sm:text-4xl">{statValue}</p>
      <p className="relative mt-1 max-w-xs text-xs text-white/80 sm:text-sm">{statLabel}</p>
    </div>,
  ]

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-6">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://romegamart.com/deals/${kind}`} />
      </Helmet>
      <button onClick={onClose} className="mb-1 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-aqua-700">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to home
      </button>

      {/* Banner — same card style as the homepage promo tile, auto-rotating with a second stat slide */}
      <div className="mt-2">
        <LoopCarousel slides={slides} heightClass="h-[140px] sm:h-[170px]" />
      </div>

      {/* Product grid */}
      <div className="mt-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">{promo.title}</h2>
          <span className="text-sm text-slate-500">{products.length} {products.length === 1 ? 'product' : 'products'}</span>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-14 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400">
              <PackageSearch className="h-7 w-7" />
            </span>
            <p className="max-w-sm text-slate-500">No products available here right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
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
    </section>
  )
}
