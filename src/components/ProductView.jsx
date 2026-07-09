import { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  Heart, ShoppingCart, Zap, Star, Store, ChevronRight, ArrowLeft,
  CheckCircle2, ShieldCheck, MapPin, MessageSquare, Truck, Lock,
  Package, BadgePercent, Send, Mail, Twitter, Facebook, Linkedin, MessageCircle,
} from 'lucide-react'
import SmartImage from './SmartImage'
import ProductCard from './ProductCard'
import { getCategory, PRODUCT_INDEX, SELLERS } from '../data'

const rupee = (n) => `₹${Number(n).toLocaleString('en-IN')}`

function Stars({ value = 0, className = 'h-4 w-4' }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${className} ${i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
      ))}
    </span>
  )
}

export default function ProductView({
  product, onClose, onAddToCart, onBuyNow, wished, onToggleWish, onView, isWished,
  isLoggedIn = false, onRequireLogin, onViewStore,
}) {
  const [qty, setQty] = useState(1)
  const [mainImage, setMainImage] = useState(product?.image)
  // Tracks whether the scroll auto-popup has already fired for the product
  // currently being viewed — kept in a ref (not state) so it survives
  // re-renders without re-arming, and reset only when the product changes.
  const autoPromptedRef = useRef(false)
  // App.jsx passes a fresh onRequireLogin function identity on every render;
  // routing it through a ref keeps the scroll-listener effect below from
  // re-running (and resetting) on those unrelated parent re-renders — e.g.
  // closing the popup itself triggers a parent re-render.
  const onRequireLoginRef = useRef(onRequireLogin)
  onRequireLoginRef.current = onRequireLogin

  // Reset the gallery selection + quantity whenever the buyer navigates to a
  // different product (this view isn't remounted, so state would otherwise
  // carry over from the previously viewed product).
  useEffect(() => {
    setMainImage(product?.image)
    setQty(1)
    autoPromptedRef.current = false
  }, [product?.key])

  // Mirrors romegamart.com: a logged-out shopper who opens a product and
  // scrolls a little doesn't have to click "Get Wholesale Price" — the same
  // mobile-number gate popup opens on its own, once per product visit, and
  // stays quiet afterwards even if the popup is closed and they scroll more.
  useEffect(() => {
    if (isLoggedIn || product?.enquiryOnly) return
    // Opening a product runs window.scrollTo({ top: 0, behavior: 'smooth' }),
    // which fires its own 'scroll' events while animating down from wherever
    // the shopper previously was — that animated pass-through must not count
    // as "the shopper scrolled". Require the page to actually settle near
    // the top first; only a scroll past the threshold *after* that counts.
    let reachedTop = window.scrollY < 50
    const onScroll = () => {
      if (autoPromptedRef.current) return
      if (!reachedTop) {
        if (window.scrollY < 50) reachedTop = true
        return
      }
      if (window.scrollY < 300) return
      autoPromptedRef.current = true
      onRequireLoginRef.current?.()
      window.removeEventListener('scroll', onScroll)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isLoggedIn, product?.key, product?.enquiryOnly])

  if (!product) return null
  const showPrice = isLoggedIn || product.enquiryOnly

  const {
    name, seller, price, mrp, discount, image, categoryImage, enquiryOnly,
    brand, productId, rating, reviews, catName, catId, specs = [], features = [], description,
    moq, wholesaleTiers,
  } = product

  const related = getCategory(catId)?.products.filter((p) => p.key !== product.key).slice(0, 8) || []
  // Suggested: products from other categories
  const suggested = Object.values(PRODUCT_INDEX).filter((p) => p.catId !== catId).slice(0, 4)

  const sellerData = SELLERS.find((s) => s.name === seller)
  const sellerCity = sellerData?.city || ''

  // Gallery thumbnails — since each product only has one real photo, fill
  // out a small gallery with photos from closely related items (same
  // sub-category first) so the buyer still gets a multi-image browsing feel.
  const galleryImages = [...new Set([
    image,
    ...related.filter((p) => p.subSlug === product.subSlug).map((p) => p.image),
    ...related.map((p) => p.image),
    categoryImage,
  ].filter(Boolean))].slice(0, 5)

  // Generate wholesale tiers from base price if not provided
  const tiers = wholesaleTiers || (price ? [
    { min: 1, max: 9, price: price, label: '1-9 pcs', discount: 0 },
    { min: 10, max: 49, price: Math.round(price * 0.92), label: '10-49 pcs', discount: 8 },
    { min: 50, max: null, price: Math.round(price * 0.85), label: '50+ pcs', discount: 15 },
  ] : [])

  // Which tier the current quantity falls into — drives both the displayed
  // unit price and which tier card is highlighted as "active".
  const activeTier = tiers.length > 0
    ? tiers.find((t) => qty >= t.min && (t.max === null || qty <= t.max)) || tiers[tiers.length - 1]
    : null
  const effectivePrice = activeTier ? activeTier.price : price
  // The actual product passed to cart/buy — carries the tier-adjusted price
  // so totals in the cart reflect the bulk discount the buyer selected.
  const cartProduct = activeTier && activeTier.price !== price ? { ...product, price: effectivePrice } : product

  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <Helmet>
        <title>{name} | Romegamart</title>
        <meta name="description" content={`Buy ${name} at wholesale B2B price from ${seller} on Romegamart. ${catName} — India's #1 RO marketplace.`} />
        <meta property="og:title" content={`${name} — Romegamart`} />
        <meta property="og:description" content={`Wholesale price: ₹${price?.toLocaleString('en-IN') || 'Enquiry'} — ${seller}`} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="product" />
        <link rel="canonical" href={`https://romegamart.com/product/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name,
          image,
          description: `${name} from ${seller}`,
          brand: { '@type': 'Brand', name: brand || seller },
          offers: price ? { '@type': 'Offer', priceCurrency: 'INR', price, availability: 'https://schema.org/InStock' } : undefined,
          aggregateRating: rating ? { '@type': 'AggregateRating', ratingValue: rating, reviewCount: reviews } : undefined,
        })}</script>
      </Helmet>
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500" aria-label="Breadcrumb">
        <button onClick={onClose} className="font-medium text-aqua-700 hover:text-aqua-800">Home</button>
        <ChevronRight className="h-4 w-4" />
        <span>{catName}</span>
        <ChevronRight className="h-4 w-4" />
        <span className="line-clamp-1 max-w-[60vw] font-semibold text-navy-800">{name}</span>
      </nav>

      <button onClick={onClose} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-aqua-700 hover:text-aqua-800">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Gallery + buy box */}
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <div>
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
            <SmartImage src={mainImage} fallback={categoryImage} alt={name} className="aspect-square w-full" imgClassName="h-full w-full object-cover" />
            {discount > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-white shadow-soft">
                {discount}% OFF
              </span>
            )}
            {!enquiryOnly && price && (
              <span className="absolute right-4 top-4 rounded-full bg-navy-800/90 px-3 py-1 text-[10px] font-bold text-white backdrop-blur">
                wholesale
              </span>
            )}
          </div>
          {galleryImages.length > 1 && (
            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMainImage(img)}
                  aria-label={`View image ${i + 1}`}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all ${
                    mainImage === img ? 'border-aqua-400 ring-2 ring-aqua-100' : 'border-slate-200 hover:border-aqua-300'
                  }`}
                >
                  <SmartImage src={img} fallback={categoryImage} alt="" className="h-full w-full" imgClassName="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-xl font-bold leading-snug text-navy-800 sm:text-2xl">{name}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Stars value={rating} />
              <span className="font-semibold text-navy-800">{rating.toFixed(1)}</span>
            </span>
            <span className="text-slate-400">({reviews} {reviews === 1 ? 'review' : 'reviews'})</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600">
            <span>Product ID: <span className="font-semibold text-navy-800">{productId}</span></span>
            {brand && <span>Brand: <span className="font-semibold text-navy-800">{brand}</span></span>}
          </div>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-600">
            <Store className="h-4 w-4 text-aqua-500" /> Sold by <span className="font-semibold text-navy-800">{seller}</span>
            <button
              onClick={() => onViewStore?.(seller)}
              className="ml-1 inline-flex items-center gap-1 rounded-full border border-aqua-200 bg-aqua-50 px-2.5 py-0.5 text-[11px] font-semibold text-aqua-700 transition-colors hover:bg-aqua-100"
            >
              <Store className="h-3 w-3" /> See Store
            </button>
          </p>

          {/* Price block */}
          <div className="mt-4 rounded-2xl bg-slate-50 p-4">
            {enquiryOnly ? (
              <span className="text-xl font-bold text-aqua-700">Price on request</span>
            ) : showPrice ? (
              <div>
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-bold text-navy-800">{rupee(effectivePrice)}</span>
                  {activeTier && activeTier.discount > 0 ? (
                    <>
                      <span className="text-lg text-slate-400 line-through">{rupee(price)}</span>
                      <span className="rounded-md bg-accent-500/15 px-2 py-0.5 text-sm font-bold text-accent-600">
                        Save {activeTier.discount}%
                      </span>
                    </>
                  ) : mrp > price && (
                    <>
                      <span className="text-lg text-slate-400 line-through">{rupee(mrp)}</span>
                      <span className="rounded-md bg-accent-500/15 px-2 py-0.5 text-sm font-bold text-accent-600">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {activeTier && activeTier.discount > 0
                    ? `Wholesale rate for ${activeTier.label} · per unit`
                    : 'Inclusive of all taxes · B2B wholesale price'}
                </p>
              </div>
            ) : (
              <button onClick={onRequireLogin} className="inline-flex items-center gap-2 text-xl font-bold text-aqua-700 hover:text-aqua-800">
                <Lock className="h-5 w-5" /> Login to view price
              </button>
            )}
            {!enquiryOnly && !showPrice && <p className="mt-1 text-xs text-slate-500">Sign in to see wholesale B2B pricing.</p>}
          </div>

          {/* Wholesale pricing tiers — shown to everyone so the panel never
              looks empty for guests; per-unit prices stay locked until login
              (tapping a locked tier opens the same phone-gate popup). */}
          {!enquiryOnly && tiers.length > 0 && (
            <div className="mt-4 rounded-2xl border border-aqua-200 bg-aqua-50/50 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BadgePercent className="h-4 w-4 text-aqua-600" />
                  <h3 className="text-sm font-bold text-navy-800">Wholesale Pricing</h3>
                </div>
                {!showPrice && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-aqua-700">
                    <Lock className="h-3 w-3" /> Login to view
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {tiers.map((t, i) => {
                  const isActive = showPrice && activeTier === t
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => (showPrice ? setQty(t.min) : onRequireLogin())}
                      aria-pressed={isActive}
                      className={`rounded-xl p-2.5 text-center transition-all ${
                        isActive
                          ? 'border-2 border-aqua-400 bg-white shadow-sm ring-2 ring-aqua-100'
                          : 'border border-slate-200 bg-white hover:-translate-y-0.5 hover:border-aqua-300 hover:shadow-sm'
                      }`}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.label}</p>
                      {showPrice ? (
                        <>
                          <p className="mt-1 text-lg font-extrabold text-navy-800">{rupee(t.price)}</p>
                          {t.discount > 0 && (
                            <span className="mt-1 inline-block rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-bold text-accent-700">
                              Save {t.discount}%
                            </span>
                          )}
                        </>
                      ) : (
                        <p className="mt-1 inline-flex items-center gap-1 text-lg font-extrabold text-slate-300">
                          <Lock className="h-3.5 w-3.5" /> ₹•••
                        </p>
                      )}
                    </button>
                  )
                })}
              </div>
              <p className="mt-2 text-center text-[11px] text-slate-400">
                {showPrice ? 'Tap a tier to set quantity, or adjust manually below' : 'Sign in to unlock bulk rates for every quantity slab'}
              </p>
              {moq && (
                <p className="mt-2 text-center text-[11px] text-slate-500">
                  MOQ: <span className="font-bold text-navy-800">{moq}</span> units
                </p>
              )}
            </div>
          )}

          {/* Quantity + actions */}
          {!enquiryOnly && showPrice && (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500">Qty</span>
              <div className="inline-flex items-center rounded-full border border-slate-200">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-9 w-9 place-items-center text-slate-600 hover:text-navy-800">−</button>
                <span className="w-8 text-center text-sm font-semibold text-navy-800">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="grid h-9 w-9 place-items-center text-slate-600 hover:text-navy-800">+</button>
              </div>
              {activeTier && activeTier.discount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-bold text-accent-700">
                  <BadgePercent className="h-3 w-3" /> {activeTier.discount}% bulk discount applied
                </span>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            {enquiryOnly ? (
              <button onClick={() => onBuyNow(product, 1)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-aqua-500 to-navy-800 px-4 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
                <MessageSquare className="h-4 w-4" /> Send Enquiry
              </button>
            ) : showPrice ? (
              <>
                <button onClick={() => onAddToCart(cartProduct, qty)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-navy-800 px-4 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-navy-700">
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </button>
                <button onClick={() => onBuyNow(cartProduct, qty)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-aqua-500 to-navy-800 px-4 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
                  <Zap className="h-4 w-4" /> Buy Now
                </button>
              </>
            ) : (
              <button onClick={onRequireLogin} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-aqua-500 to-navy-800 px-4 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
                <Lock className="h-4 w-4" /> Login to Buy
              </button>
            )}
            <button
              onClick={() => onToggleWish(product.key)}
              aria-pressed={wished}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-navy-700 transition-colors hover:border-accent-400 hover:text-accent-600"
            >
              <Heart className={`h-4 w-4 ${wished ? 'fill-accent-500 text-accent-500' : ''}`} />
            </button>
          </div>

          {/* Get Wholesale Price button — always opens the same
              mobile-number gate popup (PhoneGatePopup via onRequireLogin),
              same as romegamart.com. */}
          {!enquiryOnly && (
            <button
              onClick={onRequireLogin}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-aqua-300 bg-aqua-50/50 px-4 py-3 text-sm font-bold text-aqua-700 transition-all hover:-translate-y-0.5 hover:border-aqua-400 hover:bg-aqua-50 hover:shadow-md"
            >
              <Send className="h-4 w-4" /> Get Wholesale Price
            </button>
          )}

          {/* Trust row */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
            {[[ShieldCheck, 'Verified Seller'], [Truck, 'PAN-India Delivery'], [Package, 'Bulk Available']].map(([Icon, t]) => (
              <div key={t} className="flex flex-col items-center gap-1 rounded-lg bg-slate-50 py-2">
                <Icon className="h-4 w-4 text-aqua-600" />
                {t}
              </div>
            ))}
          </div>

          {/* Share */}
          <div className="mt-4 border-t border-slate-100 pt-4">
            <ShareRow name={name} />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {features.length > 0 && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
              <h2 className="mb-3 text-lg font-bold text-navy-800">Key Features</h2>
              <ul className="space-y-2">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <h2 className="mb-3 text-lg font-bold text-navy-800">Description</h2>
            <p className="text-sm leading-relaxed text-slate-600">{description}</p>
          </div>

          {/* Reviews */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <h2 className="mb-3 text-lg font-bold text-navy-800">Reviews & Ratings</h2>
            {reviews === 0 ? (
              <p className="text-sm text-slate-500">There have been no reviews for this product yet.</p>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-navy-800">{rating.toFixed(1)}</div>
                  <Stars value={rating} />
                  <div className="mt-1 text-xs text-slate-500">{reviews} reviews</div>
                </div>
                <p className="text-sm text-slate-500">Rated by verified B2B buyers across India.</p>
              </div>
            )}
          </div>
        </div>

        {/* Specs + seller */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <h2 className="mb-3 text-lg font-bold text-navy-800">Specifications</h2>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {specs.map(([k, v], i) => (
                    <tr key={k} className={i % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="w-1/2 border border-slate-200 px-3 py-2.5 align-top text-slate-500">{k}</td>
                      <td className="border border-slate-200 px-3 py-2.5 align-top font-semibold text-navy-800">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <h2 className="mb-2 text-lg font-bold text-navy-800">Sold By</h2>
            <p className="font-semibold text-navy-800">{seller}</p>
            <span className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-4 w-4 shrink-0 text-aqua-500" /> {sellerCity || 'India'}
            </span>
            <div className="mt-2 inline-flex items-center gap-1.5 text-sm">
              <Stars value={4.6} className="h-3.5 w-3.5" />
              <span className="text-slate-500">Trusted manufacturer / dealer</span>
            </div>
            {/* Opens the seller's full storefront page (their listed products,
                reviews, business details), not an external map. */}
            <button
              onClick={() => onViewStore?.(seller)}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-aqua-200 px-4 py-2.5 text-sm font-bold text-aqua-700 transition-colors hover:border-aqua-400 hover:bg-aqua-50"
            >
              <Store className="h-4 w-4" /> View Store
            </button>
          </div>

          {/* Wholesale enquiry card */}
          {!enquiryOnly && (
            <div className="rounded-2xl border border-aqua-200 bg-gradient-to-br from-aqua-50 to-white p-5">
              <h2 className="text-lg font-bold text-navy-800">Need Bulk Quantity?</h2>
              <p className="mt-2 text-sm text-slate-600">Get special wholesale pricing for orders above 50 units. Custom packaging and PAN-India delivery available.</p>
              <button
                onClick={onRequireLogin}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-aqua-500 to-navy-800 px-4 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <Send className="h-4 w-4" /> Get Wholesale Price
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-lg font-bold text-navy-800 sm:text-xl">Related Products</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.key} product={p} wished={isWished(p.key)} onToggleWish={onToggleWish} onView={onView} onBuyNow={onBuyNow} isLoggedIn={isLoggedIn} onRequireLogin={onRequireLogin} />
            ))}
          </div>
        </div>
      )}

      {/* You May Also Like */}
      {suggested.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-navy-800 sm:text-xl">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {suggested.map((p) => (
              <ProductCard key={p.key} product={p} wished={isWished(p.key)} onToggleWish={onToggleWish} onView={onView} onBuyNow={onBuyNow} isLoggedIn={isLoggedIn} onRequireLogin={onRequireLogin} />
            ))}
          </div>
        </div>
      )}

    </section>
  )
}

/**
 * ShareRow — social share buttons for the current product page, mirroring the
 * Email / Twitter / Facebook / LinkedIn / WhatsApp row on romegamart.com.
 * Shares the live page URL; each opens the platform's prefilled share dialog
 * in a new tab.
 */
function ShareRow({ name }) {
  const url = typeof window !== 'undefined' ? window.location.href : 'https://romegamart.com'
  const text = `Check out "${name}" on Romegamart`
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(text)

  const links = [
    { label: 'Email', href: `mailto:?subject=${t}&body=${t}%0A${u}`, Icon: Mail, color: 'bg-aqua-500 hover:bg-aqua-600' },
    { label: 'Twitter', href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, Icon: Twitter, color: 'bg-sky-500 hover:bg-sky-600' },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, Icon: Facebook, color: 'bg-[#1877f2] hover:bg-[#1466d6]' },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, Icon: Linkedin, color: 'bg-[#0a66c2] hover:bg-[#0954a3]' },
    { label: 'WhatsApp', href: `https://wa.me/?text=${t}%20${u}`, Icon: MessageCircle, color: 'bg-[#25d366] hover:bg-[#1eb858]' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold text-slate-500">Share</span>
      <div className="flex flex-wrap gap-2">
        {links.map(({ label, href, Icon, color }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${label}`}
            title={`Share on ${label}`}
            className={`grid h-9 w-9 place-items-center rounded-lg text-white shadow-soft transition-all hover:-translate-y-0.5 ${color}`}
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>
    </div>
  )
}
