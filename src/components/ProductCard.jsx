import { Heart, Eye, Zap, MessageSquare, Store, Star, Lock } from 'lucide-react'
import SmartImage from './SmartImage'

/**
 * ProductCard — reusable card with image, truncated title, seller,
 * a wishlist heart, a "View details" action and a "Buy Now" / "Enquire" CTA.
 *
 * Props:
 *  - product: { key, name, seller, price?, image, enquiryOnly }
 *  - wished, onToggleWish, onView, onBuyNow: interaction callbacks
 */
export default function ProductCard({ product, wished = false, onToggleWish, onView, onBuyNow, isLoggedIn = false, onRequireLogin }) {
  const { name, seller, price, mrp, discount, image, categoryImage, enquiryOnly, rating, reviews, new: isNew } = product
  // Prices are only visible to logged-in buyers (B2B). Enquiry products have no price.
  const showPrice = isLoggedIn || enquiryOnly

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-aqua-200 hover:shadow-lift">
      {/* Image — clickable to open quick-view */}
      <button
        onClick={() => onView(product)}
        className="relative aspect-[4/3] overflow-hidden bg-slate-100 text-left"
        aria-label={`View ${name}`}
      >
        <SmartImage
          src={image}
          fallback={categoryImage}
          alt={name}
          className="h-full w-full"
          imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute inset-0 grid place-items-center bg-navy-900/0 opacity-0 transition-all duration-300 group-hover:bg-navy-900/25 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-navy-800 shadow-soft">
            <Eye className="h-3.5 w-3.5" /> Quick view
          </span>
        </span>
        {/* Top-left badges — NEW (latest arrivals) stacked above Enquiry/discount */}
        <span className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1">
          {isNew && (
            <span className="rounded-md bg-aqua-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-soft">
              New
            </span>
          )}
          {enquiryOnly ? (
            <span className="rounded-md bg-navy-800/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-aqua-100 backdrop-blur">
              Enquiry
            </span>
          ) : (
            discount > 0 && (
              <span className="rounded-md bg-accent-500 px-2 py-1 text-[10px] font-bold text-white shadow-soft">
                {discount}% OFF
              </span>
            )
          )}
        </span>
        {!enquiryOnly && price && (
          <span className="absolute right-2.5 top-2.5 rounded-md bg-aqua-500/90 px-2 py-1 text-[9px] font-bold text-white backdrop-blur">
            wholesale
          </span>
        )}
      </button>

      {/* Wishlist heart (outside the view button so it toggles independently) */}
      <button
        onClick={() => onToggleWish(product.key)}
        aria-pressed={wished}
        aria-label={wished ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-navy-700 shadow-soft backdrop-blur transition-all hover:scale-110 hover:text-accent-600"
      >
        <Heart className={`h-4 w-4 transition-colors ${wished ? 'fill-accent-500 text-accent-500' : ''}`} />
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <button onClick={() => onView(product)} className="text-left">
          <h3 className="clamp-2 min-h-[2.6rem] text-sm font-semibold leading-snug text-navy-900 transition-colors hover:text-aqua-700" title={name}>
            {name}
          </h3>
        </button>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <Store className="h-3.5 w-3.5 shrink-0 text-aqua-500" />
          <span className="truncate" title={seller}>{seller}</span>
        </p>

        {/* Rating */}
        {rating > 0 && (
          <div className="mt-1.5 flex items-center gap-1 text-xs">
            <span className="inline-flex items-center gap-0.5 rounded bg-accent-500/15 px-1.5 py-0.5 font-bold text-accent-600">
              {rating.toFixed(1)} <Star className="h-3 w-3 fill-accent-600" />
            </span>
            <span className="text-slate-400">({reviews})</span>
          </div>
        )}

        {/* Price + Actions — pinned to the bottom of the card via mt-auto, so
            cards stay the same height in a row regardless of whether the
            price is one line (enquiry / login-gated) or two (price + bulk
            discount note). */}
        <div className="mt-auto">
          <div className="mt-3 border-t border-slate-100 pt-3">
            {enquiryOnly ? (
              <span className="text-sm font-semibold text-aqua-700">Price on request</span>
            ) : showPrice ? (
              <div className="relative">
                {/* Wholesale price RANGE — best bulk (50+) price up to the
                    single-unit price, mirroring romegamart.com's "₹X – ₹Y".
                    Always visible; never truncated. */}
                <p className="text-sm font-extrabold leading-tight text-navy-900 sm:text-[15px]">
                  ₹{Math.round(price * 0.85).toLocaleString('en-IN')} – ₹{price.toLocaleString('en-IN')}
                </p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[11px] leading-tight text-slate-400">
                  {mrp > price && <span className="line-through">₹{mrp.toLocaleString('en-IN')}</span>}
                  <span className="font-semibold text-accent-600">{discount}% off</span>
                  <span>· bulk</span>
                </p>

                {/* Price tooltip — appears on hover with just the price range. */}
                <div className="pointer-events-none absolute bottom-full left-0 z-20 mb-1.5 w-max max-w-[200px] rounded-md bg-navy-900 px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-soft transition-opacity duration-200 group-hover:opacity-100">
                  ₹{Math.round(price * 0.85).toLocaleString('en-IN')} – ₹{price.toLocaleString('en-IN')}
                  <span className="absolute left-3 top-full h-1.5 w-1.5 -translate-y-1 rotate-45 bg-navy-900" />
                </div>
              </div>
            ) : (
              <button onClick={onRequireLogin} className="inline-flex items-center gap-1.5 text-left text-[11px] font-bold leading-tight text-aqua-700 hover:text-aqua-800 sm:text-sm">
                <Lock className="h-3.5 w-3.5 shrink-0" /> Login to view price
              </button>
            )}
          </div>

          {/* Actions — responsive: stacked, full-width tap targets that never
              wrap on narrow 2-column mobile cards. */}
          <div className="mt-3 flex flex-col gap-2">
            {enquiryOnly || showPrice ? (
              <button
                onClick={() => onBuyNow(product, 1)}
                className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-gradient-to-r from-aqua-500 to-navy-800 px-2 py-2 text-[11px] font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift sm:px-3 sm:text-xs"
              >
                {enquiryOnly ? <MessageSquare className="h-3.5 w-3.5 shrink-0" /> : <Zap className="h-3.5 w-3.5 shrink-0" />}
                {enquiryOnly ? 'Enquire' : 'Buy Now'}
              </button>
            ) : (
              <button
                onClick={onRequireLogin}
                className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-gradient-to-r from-aqua-500 to-navy-800 px-2 py-2 text-[11px] font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift sm:px-3 sm:text-xs"
              >
                <Lock className="h-3.5 w-3.5 shrink-0" /> Login to Buy
              </button>
            )}
            <button
              onClick={() => onView(product)}
              className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-slate-200 px-2 py-2 text-[11px] font-semibold text-navy-700 transition-colors hover:border-aqua-300 hover:text-aqua-700 sm:px-3 sm:text-xs"
            >
              <Eye className="h-3.5 w-3.5 shrink-0" /> View
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
