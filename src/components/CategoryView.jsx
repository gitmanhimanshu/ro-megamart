import { useRef, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ChevronRight, ArrowLeft, PackageSearch, LayoutGrid } from 'lucide-react'
import ProductCard from './ProductCard'
import SmartImage from './SmartImage'
import CategoryBanner from './CategoryBanner'
import SEOBlogSection from './SEOBlogSection'
import { useCategoryFilters } from './CategoryFilterSidebar'
import { PRODUCT_INDEX, INDIAN_STATES, BANNER_IMAGES, hashStr } from '../data'
import { CATEGORY_BLOGS, SUBCATEGORY_BLOGS } from '../seoBlogData'

/**
 * CategoryView — the category drill-down, mirroring the real Romegamart site:
 * pick a main category → see its real sub-categories → products filter to the
 * selected sub-category. "All" shows every product in the category.
 */
export default function CategoryView({
  category, subSlug, onSelectSub, onClose, isWished, onToggleWish, onView, onBuyNow, isLoggedIn, onRequireLogin,
}) {
  const { id: catId, name, tagline, image, subcategories = [], products } = category
  const activeSub = subcategories.find((s) => s.slug === subSlug)
  const filtered = subSlug ? products.filter((p) => p.subSlug === subSlug) : products
  const productsRef = useRef(null)

  // Scroll to products section when subcategory changes
  useEffect(() => {
    if (subSlug && productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [subSlug])

  // Count products per sub-category, then list populated ones first so the
  // shopper immediately sees which sub-categories actually have stock.
  const countFor = (slug) => products.filter((p) => p.subSlug === slug).length
  const orderedSubs = [...subcategories]
    .map((s) => ({ ...s, count: countFor(s.slug) }))
    .sort((a, b) => b.count - a.count)

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-6">
      <Helmet>
        <title>{name} — Wholesale RO Spares &amp; Systems | Romegamart</title>
        <meta name="description" content={`Shop ${name} at wholesale B2B prices on Romegamart. Browse ${products.length} products from verified sellers across India.`} />
        <meta property="og:title" content={`${name} — Romegamart`} />
        <meta property="og:description" content={`Wholesale ${name} — ${products.length} products available.`} />
        <link rel="canonical" href={`https://romegamart.com/category/${catId}`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${name} — Romegamart`,
          description: `Wholesale ${name} at B2B prices`,
          url: `https://romegamart.com/category/${catId}`,
        })}</script>
      </Helmet>
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500" aria-label="Breadcrumb">
        <button onClick={onClose} className="font-medium text-aqua-700 hover:text-aqua-800">Home</button>
        <ChevronRight className="h-4 w-4" />
        <button
          onClick={() => onSelectSub(null)}
          className={subSlug ? 'font-medium text-aqua-700 hover:text-aqua-800' : 'font-semibold text-navy-800'}
        >
          {name}
        </button>
        {activeSub && (
          <>
            <ChevronRight className="h-4 w-4" />
            <span className="font-semibold text-navy-800">{activeSub.name}</span>
          </>
        )}
      </nav>

      {/* Slim header — title + back link, no large banner card */}
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <button onClick={onClose} className="mb-1 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-aqua-700">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </button>
          <h1 className="text-xl font-bold text-navy-900 sm:text-2xl">{name}</h1>
          <p className="mt-0.5 max-w-xl text-sm text-slate-500">{tagline}</p>
        </div>
      </div>

      {/* Sub-category picker */}
      <div className="mt-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Shop by Sub-Category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
          {/* "All" tile */}
          <button
            onClick={() => onSelectSub(null)}
            className={`group flex flex-col items-center gap-1 rounded-xl border p-2.5 pb-2 text-center transition-all ${
              !subSlug ? 'border-aqua-400 bg-aqua-50 ring-1 ring-aqua-300' : 'border-slate-200/80 bg-white hover:border-aqua-200 hover:shadow-soft'
            }`}
          >
            <span className="grid h-24 w-24 place-items-center rounded-lg bg-navy-800 text-white sm:h-28 sm:w-28">
              <LayoutGrid className="h-10 w-10 sm:h-12 sm:w-12" />
            </span>
            <span className="line-clamp-2 text-[10px] font-semibold leading-tight text-navy-800">All</span>
          </button>

          {orderedSubs.map((sub) => {
            const active = sub.slug === subSlug
            return (
              <button
                key={sub.slug}
                onClick={() => onSelectSub(sub.slug)}
                title={sub.name}
                className={`group relative flex flex-col items-center gap-1 rounded-xl border p-2.5 pb-2 text-center transition-all ${
                  active
                    ? 'border-aqua-400 bg-aqua-50 ring-1 ring-aqua-300'
                    : 'border-slate-200/80 bg-white hover:border-aqua-200 hover:shadow-soft'
                } ${sub.count === 0 ? 'opacity-60' : ''}`}
              >
                <SmartImage
                  src={sub.image}
                  fallback={image}
                  alt={sub.name}
                  className="h-24 w-24 rounded-lg bg-white sm:h-28 sm:w-28"
                  imgClassName="h-24 w-24 rounded-lg object-contain sm:h-28 sm:w-28"
                />
                <span className="line-clamp-2 text-[10px] font-semibold leading-tight text-navy-800">{sub.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Products — keyed by sub-category so filters/state-pill reset cleanly on switch */}
      <div ref={productsRef} className="scroll-mt-20">
        <SubCategoryProducts
          key={subSlug || 'all'}
          category={category}
          catId={catId}
          catName={name}
          activeSub={activeSub}
          products={filtered}
          onSelectSub={onSelectSub}
          isWished={isWished}
          onToggleWish={onToggleWish}
          onView={onView}
          onBuyNow={onBuyNow}
          isLoggedIn={isLoggedIn}
          onRequireLogin={onRequireLogin}
        />
      </div>

      {/* You May Also Like — other categories */}
      {subSlug && (
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h3 className="mb-4 text-base font-bold text-navy-800 sm:text-lg">You May Also Like</h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Object.values(PRODUCT_INDEX)
              .filter((p) => p.catId !== catId)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.key} product={p} wished={isWished(p.key)} onToggleWish={onToggleWish} onView={onView} onBuyNow={onBuyNow} isLoggedIn={isLoggedIn} onRequireLogin={onRequireLogin} />
              ))}
          </div>
        </div>
      )}
    </section>
  )
}

/**
 * SubCategoryProducts — the same banner carousel used on the homepage
 * category section (real photo + brand promo slide) + a programmatic-SEO H1
 * ("{Sub-category} Manufacturer in {State}", switchable via the state pill
 * row) + a Color/Brand/Rating/Price filter sidebar, mirroring the real
 * romegamart.com/product/{category}/{sub-category}/ page layout.
 */
function SubCategoryProducts({
  category, catId, catName, activeSub, products, onSelectSub,
  isWished, onToggleWish, onView, onBuyNow, isLoggedIn, onRequireLogin,
}) {
  const heading = activeSub ? activeSub.name : catName
  const bannerImage = BANNER_IMAGES[catId]
  const defaultState = INDIAN_STATES[hashStr(activeSub ? activeSub.slug : catId) % INDIAN_STATES.length]
  const [state, setState] = useState(defaultState)
  const { filtered, sidebar, activeCount } = useCategoryFilters(products)

  return (
    <div className="mt-8">
      {bannerImage && (
        <CategoryBanner category={category} bannerImage={bannerImage} onOpen={() => onSelectSub(null)} />
      )}

      {/* Programmatic-SEO H1 + state switcher */}
      <div className="mt-6">
        <h1 className="text-lg font-bold text-navy-900 sm:text-xl">{heading} Manufacturer in {state}</h1>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {INDIAN_STATES.map((st) => (
            <button
              key={st}
              onClick={() => setState(st)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                st === state ? 'border-aqua-400 bg-aqua-50 text-aqua-700' : 'border-slate-200 text-slate-600 hover:border-aqua-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Filters + grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-slate-200/80 bg-white p-4 lg:sticky lg:top-20 lg:self-start">
          {sidebar}
        </aside>

        <div>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">{heading}</h2>
            <span className="text-sm text-slate-500">{filtered.length} {filtered.length === 1 ? 'product' : 'products'}</span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-14 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400">
                <PackageSearch className="h-7 w-7" />
              </span>
              <p className="max-w-sm text-slate-500">
                {activeCount > 0 ? (
                  'No products match the selected filters.'
                ) : (
                  <>No products listed under <span className="font-semibold text-navy-800">{activeSub?.name}</span> yet.</>
                )}
              </p>
              {!activeCount && (
                <button onClick={() => onSelectSub(null)} className="rounded-full bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">
                  View all {catName}
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

      {/* SEO content + programmatic location links — mirrors the descriptive
          article + "Popular Link" block on romegamart.com category pages.
          Shown on every category / sub-category page; the location links
          re-target the "{heading} Manufacturer in {State}" H1 above. */}
      <div className="mt-12 border-t border-slate-100 pt-8">
        <h2 className="text-lg font-bold text-navy-900 sm:text-xl">
          {heading} — Wholesale B2B Supply Across India
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">
          <p>
            Romegamart is India's 1st &amp; largest B2B marketplace for the RO (reverse osmosis) industry.
            Browse a wide range of <span className="font-semibold text-navy-800">{heading.toLowerCase()}</span> from
            verified manufacturers, dealers and distributors — sourced at transparent wholesale prices for
            businesses, water plants, service centres and bulk buyers across the country.
          </p>
          <p>
            Every {heading.toLowerCase()} listing comes from a GST-verified seller with genuine warranty, proper
            invoicing and PAN-India delivery. Compare specifications, request bulk quotes and connect directly
            with suppliers — no middlemen, no inflated retail margins.
          </p>
        </div>

        <h3 className="mt-5 text-sm font-bold text-navy-800">Why source {heading} on Romegamart?</h3>
        <ul className="mt-2 grid gap-1.5 text-sm text-slate-600 sm:grid-cols-2">
          {[
            'Verified manufacturers, dealers & distributors',
            'Wholesale B2B pricing with bulk discounts',
            'Genuine products with warranty & GST invoice',
            'PAN-India delivery, incl. Tier 2 & Tier 3 cities',
          ].map((point) => (
            <li key={point} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aqua-500" /> {point}
            </li>
          ))}
        </ul>

        {/* Popular Links — one per state, re-targets the location H1 above */}
        <h3 className="mt-7 text-sm font-bold uppercase tracking-wider text-slate-500">Popular Links</h3>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs leading-relaxed">
          {INDIAN_STATES.map((st) => (
            <button
              key={st}
              onClick={() => { setState(st); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className={`text-left transition-colors hover:text-aqua-800 hover:underline ${
                st === state ? 'font-semibold text-aqua-700' : 'text-slate-500'
              }`}
            >
              {heading} in {st}
            </button>
          ))}
        </div>
      </div>

      {/* SEO Blog Section */}
      <SEOBlogSection
        title={activeSub ? SUBCATEGORY_BLOGS[activeSub.slug]?.title : CATEGORY_BLOGS[catId]?.title}
        content={activeSub ? SUBCATEGORY_BLOGS[activeSub.slug]?.content : CATEGORY_BLOGS[catId]?.content}
      />
    </div>
  )
}
