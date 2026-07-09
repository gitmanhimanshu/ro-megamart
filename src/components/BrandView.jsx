import { useMemo, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, PackageSearch, ChevronLeft, ChevronRight, Info, ShieldCheck, Truck, IndianRupee } from 'lucide-react'
import ProductCard from './ProductCard'
import SEOBlogSection from './SEOBlogSection'
import { REAL_BRANDS, PRODUCT_INDEX, BANNER_IMAGES } from '../data'
import { BRAND_BLOGS } from '../seoBlogData'

const BRAND_DESCRIPTIONS = {
  'LG': 'LG is a global leader in electronics and home appliances, known for innovative water purification technology. Their RO systems combine advanced filtration with smart features for clean, safe drinking water.',
  'Dow': 'Dow Water Solutions provides industry-leading reverse osmosis membranes and water treatment technologies. Trusted by professionals worldwide for reliable, high-performance filtration.',
  'Vontron': 'Vontron is a leading manufacturer of RO membranes and water treatment components. Known for durability and efficiency, their products serve domestic, commercial, and industrial applications.',
  'Kent': 'Kent is India\'s most trusted water purifier brand, offering RO, UV, and UF purification systems. Known for innovation and quality, Kent serves millions of homes across India.',
  'Aquaguard': 'Aquaguard by Eureka Forbes is India\'s leading water purifier brand with advanced RO+UV+UF purification. Trusted for over 35 years for safe drinking water solutions.',
  'CRI': 'CRI Pumps is a leading Indian manufacturer of pumps and motors for water treatment. Known for energy efficiency and durability, their products power RO systems nationwide.',
  'Toray': 'Toray is a Japanese multinational specializing in reverse osmosis membranes and water treatment. Their advanced membrane technology is used in industrial and municipal water treatment globally.',
  'Blue Hawk': 'Blue Hawk manufactures quality RO spare parts and accessories for domestic and commercial systems. Known for affordable, reliable components that keep water purifiers running.',
  'Eurofab': 'Eurofab produces high-quality RO cabinets, housings, and spare parts. Trusted by manufacturers and dealers for durable, well-designed components.',
}

const DEFAULT_DESCRIPTION = 'A trusted brand in the RO and water treatment industry, offering quality products for domestic, commercial, and industrial water purification needs.'

const BRAND_BANNERS = [
  'https://images.romegamart.com/media/front_image/TOP_BRANDS.webp',
  'https://images.romegamart.com/media/front_image/DOMESTIC_SPARES.webp',
  'https://images.romegamart.com/media/front_image/INDUSTRIAL_SPARES.webp',
]

function BrandBanner({ banner, alt }) {
  return (
    <div className="relative h-32 w-full overflow-hidden rounded-2xl sm:h-44 lg:h-52">
      <img src={banner} alt={alt} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
    </div>
  )
}

export default function BrandView({ brandName, onClose, isWished, onToggleWish, onView, onBuyNow, isLoggedIn, onRequireLogin }) {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [showAllProducts, setShowAllProducts] = useState(false)

  const brand = useMemo(
    () => REAL_BRANDS.find((b) => b.name.toLowerCase() === brandName?.toLowerCase()),
    [brandName]
  )

  const products = useMemo(() => {
    if (!brandName) return []
    const q = brandName.toLowerCase()
    return Object.values(PRODUCT_INDEX).filter(
      (p) => p.seller?.toLowerCase() === q || p.brand?.toLowerCase() === q
    )
  }, [brandName])

  const logo = brand?.logo || products[0]?.image || null
  const description = BRAND_DESCRIPTIONS[brandName] || DEFAULT_DESCRIPTION
  const visibleProducts = showAllProducts ? products : products.slice(0, 12)

  // Auto-rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BRAND_BANNERS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-6">
      <Helmet>
        <title>{brandName} — B2B Wholesale RO Products | Romegamart</title>
        <meta name="description" content={`Buy ${brandName} RO products at wholesale B2B prices on Romegamart. ${products.length} products verified from India's #1 RO marketplace.`} />
        <meta property="og:title" content={`${brandName} — Romegamart`} />
        <meta property="og:description" content={`${products.length} ${brandName} products at verified wholesale prices.`} />
        {logo && <meta property="og:image" content={logo} />}
        <link rel="canonical" href={`https://romegamart.com/brand/${encodeURIComponent(brandName?.toLowerCase().replace(/\s+/g, '-'))}`} />
      </Helmet>

      <button onClick={onClose} className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-aqua-700">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to brands
      </button>

      {/* Banner Carousel */}
      <div className="relative mb-6">
        <div className="overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentBanner * 100}%)` }}
          >
            {BRAND_BANNERS.map((banner, idx) => (
              <div key={idx} className="w-full shrink-0">
                <BrandBanner banner={banner} alt={`${brandName} banner ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Banner Navigation */}
        <button
          onClick={() => setCurrentBanner((prev) => (prev - 1 + BRAND_BANNERS.length) % BRAND_BANNERS.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-all hover:bg-white hover:scale-110"
        >
          <ChevronLeft className="h-4 w-4 text-navy-800" />
        </button>
        <button
          onClick={() => setCurrentBanner((prev) => (prev + 1) % BRAND_BANNERS.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-all hover:bg-white hover:scale-110"
        >
          <ChevronRight className="h-4 w-4 text-navy-800" />
        </button>

        {/* Banner Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {BRAND_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentBanner ? 'w-6 bg-white' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Brand Header + Description */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-start gap-4">
          {logo && (
            <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-100 sm:h-20 sm:w-20">
              <img src={logo} alt={brandName} className="h-full w-full object-contain p-1" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-lg font-bold text-navy-800 sm:text-xl">{brandName}</h1>
            <p className="mt-0.5 text-sm text-slate-500">{products.length} {products.length === 1 ? 'product' : 'products'} available</p>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-aqua-600" />
            <p className="text-sm leading-relaxed text-slate-600">{description}</p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-1.5 rounded-xl bg-aqua-50 p-3 text-center">
            <ShieldCheck className="h-5 w-5 text-aqua-600" />
            <span className="text-[10px] font-semibold text-aqua-700 sm:text-xs">Verified Brand</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 rounded-xl bg-purple-50 p-3 text-center">
            <Truck className="h-5 w-5 text-purple-600" />
            <span className="text-[10px] font-semibold text-purple-700 sm:text-xs">PAN India</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 rounded-xl bg-orange-50 p-3 text-center">
            <IndianRupee className="h-5 w-5 text-orange-600" />
            <span className="text-[10px] font-semibold text-orange-700 sm:text-xs">Wholesale</span>
          </div>
        </div>
      </div>

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-2 py-10 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-400">
            <PackageSearch className="h-6 w-6" />
          </span>
          <p className="text-sm font-medium text-navy-800">No products from {brandName} yet</p>
          <p className="text-xs text-slate-500">Check back soon — new inventory added daily.</p>
        </div>
      ) : (
        <>
          <h2 className="mt-6 text-lg font-bold text-navy-800 sm:text-xl">All {brandName} Products</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((product) => (
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
          {products.length > 12 && !showAllProducts && (
            <button
              onClick={() => setShowAllProducts(true)}
              className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-aqua-300 bg-aqua-50 px-6 py-2.5 text-sm font-semibold text-aqua-700 transition-all hover:bg-aqua-100"
            >
              View All {products.length} Products
            </button>
          )}
        </>
      )}

      {/* SEO Blog Section */}
      <SEOBlogSection
        title={BRAND_BLOGS[brandName]?.title || `${brandName} — RO Products at Wholesale Prices`}
        content={BRAND_BLOGS[brandName]?.content || `<p>Buy ${brandName} RO products at wholesale prices on Romegamart. ${products.length} products available from verified sellers across India.</p><h3>Why Buy ${brandName} from Romegamart?</h3><ul><li><strong>GST Verified Sellers</strong> — All sellers are registered</li><li><strong>Wholesale Prices</strong> — Best B2B deals</li><li><strong>PAN India Delivery</strong> — Ships to all states</li><li><strong>Quality Assured</strong> — Genuine products only</li></ul><p>Connect with verified sellers and get the best deals on ${brandName} products.</p>`}
      />
    </section>
  )
}
