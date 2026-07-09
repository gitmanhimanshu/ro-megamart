import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Helmet } from 'react-helmet-async'
import {
  ArrowLeft, MapPin, Star, BadgeCheck, PackageSearch, Store, Phone, MessageCircle,
  ShieldCheck, Send, CheckCircle2, X,
} from 'lucide-react'
import ProductCard from './ProductCard'
import PieChart from './PieChart'
import SEOBlogSection from './SEOBlogSection'
import { sellerRatingBreakdown, buildSellerReviews } from '../data'
import { SELLER_BLOGS } from '../seoBlogData'

export default function SellerProfileView({
  seller, products, onClose, isWished, onToggleWish, onView, onBuyNow, isLoggedIn, onRequireLogin,
}) {
  const breakdown = useMemo(() => (seller ? sellerRatingBreakdown(seller) : []), [seller])
  const reviews = useMemo(() => (seller ? buildSellerReviews(seller, 6) : []), [seller])
  const maxBucket = Math.max(1, ...breakdown.map((b) => b.count))

  const categoryMix = useMemo(() => {
    const counts = {}
    for (const p of products) counts[p.catName] = (counts[p.catName] || 0) + 1
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
  }, [products])

  // Review popup state
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewForm, setReviewForm] = useState({ name: '', phone: '', rating: 5, comment: '' })
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [reviewErrors, setReviewErrors] = useState({})

  const validateReview = () => {
    const e = {}
    if (!reviewForm.name.trim()) e.name = 'Name required'
    if (!/^\d{10}$/.test(reviewForm.phone)) e.phone = 'Valid 10-digit phone required'
    if (!reviewForm.comment.trim() || reviewForm.comment.trim().length < 5) e.comment = 'Min 5 characters'
    setReviewErrors(e)
    return Object.keys(e).length === 0
  }

  const submitReview = (e) => {
    e.preventDefault()
    if (!validateReview()) return
    setReviewSubmitted(true)
    setReviewForm({ name: '', phone: '', rating: 5, comment: '' })
  }

  const closeReviewPopup = () => {
    setReviewOpen(false)
    setReviewSubmitted(false)
    setReviewErrors({})
  }

  if (!seller) return null

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-6">
      <Helmet>
        <title>{seller.name} | Romegamart Seller</title>
        <meta name="description" content={`Buy wholesale RO spares, membranes, pumps &amp; systems from ${seller.name} in ${seller.city}. Verified seller on Romegamart — India's #1 B2B marketplace for the RO industry.`} />
        <meta property="og:title" content={`${seller.name} — Romegamart`} />
        <meta property="og:description" content={`Wholesale RO products from ${seller.name}, ${seller.city}. ${seller.productCount} products listed.`} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://romegamart.com/store/${encodeURIComponent(seller.name.toLowerCase().replace(/\s+/g, '-'))}`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: seller.name,
          description: `Wholesale RO products from ${seller.name}`,
          address: { '@type': 'PostalAddress', addressLocality: seller.city, addressCountry: 'IN' },
          aggregateRating: { '@type': 'AggregateRating', ratingValue: seller.rating, reviewCount: seller.reviewCount },
        })}</script>
      </Helmet>
      <button onClick={onClose} className="mb-1 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-aqua-700">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to all sellers
      </button>

      {/* Cover + header card */}
      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
        <div className="h-14 bg-gradient-to-r from-navy-800 via-aqua-700 to-navy-800 sm:h-20" />
        <div className="px-4 pb-5 pt-3 sm:px-6 sm:pt-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
              <span className="-mt-7 grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-4 border-white bg-gradient-to-br from-aqua-500 to-navy-800 text-lg font-bold text-white shadow-soft sm:-mt-10 sm:h-20 sm:w-20 sm:text-xl">
                {seller.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1 pt-1">
                <h1 className="break-words text-base font-bold leading-snug text-navy-900 sm:text-xl">{seller.name}</h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {seller.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-bold text-accent-600 sm:text-[11px]">
                      <BadgeCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Verified Seller
                    </span>
                  )}
                  {seller.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-aqua-50 px-2 py-0.5 text-[10px] font-bold text-aqua-700 sm:text-[11px]">
                      <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> GST Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0 sm:self-center">
              <button onClick={onRequireLogin} className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-accent-500 px-3 py-2.5 text-xs font-bold text-white shadow-soft transition-colors hover:bg-accent-600 sm:px-4">
                <Phone className="h-3.5 w-3.5 shrink-0" /> Call Now
              </button>
              <button onClick={onRequireLogin} className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-aqua-200 px-3 py-2.5 text-xs font-bold text-aqua-700 transition-colors hover:bg-aqua-50 sm:px-4">
                <MessageCircle className="h-3.5 w-3.5 shrink-0" /> Send Enquiry
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-1.5 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0 text-accent-500" /> {seller.city}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
              <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" /> {seller.rating}
              <span className="font-normal text-slate-400">({seller.reviewCount} reviews)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Store className="h-4 w-4 shrink-0 text-aqua-500" /> {products.length} {products.length === 1 ? 'product' : 'products'} listed
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {seller.categories.map((c) => (
              <span key={c} className="rounded-full bg-aqua-50 px-2.5 py-1 text-[11px] font-medium text-aqua-700">{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* About Us */}
      <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft sm:p-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">About Us</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          <span className="font-semibold text-navy-800">{seller.name}</span> is a trusted{' '}
          <span className="font-medium text-navy-700">{seller.businessType}</span> based in{' '}
          <span className="font-medium text-navy-700">{seller.locality}, {seller.city}</span>.
          {seller.verified && ' We are a verified and GST-registered seller on Romegamart.'}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Est.', seller.yearEstablished],
            ['Team', seller.teamSize],
            ['Response', `${seller.responseRate}%`],
            ['Products', seller.productCount],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-slate-50 px-3 py-2 text-center">
              <p className="text-[11px] font-medium text-slate-400">{label}</p>
              <p className="mt-0.5 text-sm font-bold text-navy-800">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product mix donut */}
      {categoryMix.length > 0 && (
        <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft sm:p-6">
          <h2 className="mb-4 flex items-center gap-1.5 text-sm font-bold text-navy-900">
            <PieChartIcon className="h-4 w-4 text-aqua-600" /> Product Mix by Category
          </h2>
          <PieChart data={categoryMix} centerLabel={products.length} centerSub={products.length === 1 ? 'product' : 'products'} />
        </div>
      )}

      {/* Featured products */}
      {products.length > 0 && (
        <div className="mt-7">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
            Featured Products
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 8).map((product) => (
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
        </div>
      )}

      {/* Reviews */}
      <div className="mt-7 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Customer Reviews</h2>
          <button onClick={() => setReviewOpen(true)} className="inline-flex items-center gap-1.5 rounded-full bg-aqua-50 px-3 py-1.5 text-xs font-semibold text-aqua-700 transition-colors hover:bg-aqua-100">
            <Star className="h-3.5 w-3.5" /> Write a Review
          </button>
        </div>

        {/* Rating summary */}
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex shrink-0 items-center justify-center gap-4 rounded-xl bg-slate-50 px-5 py-4 sm:w-48 sm:flex-col sm:gap-1">
            <span className="text-4xl font-extrabold text-navy-900">{seller.rating}</span>
            <div className="flex flex-col items-center">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(seller.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                ))}
              </div>
              <span className="mt-1 text-xs text-slate-500">{seller.reviewCount} reviews</span>
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            {breakdown.map((b) => (
              <div key={b.star} className="flex items-center gap-2 text-xs">
                <span className="w-8 shrink-0 font-medium text-slate-500">{b.star}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${(b.count / maxBucket) * 100}%` }} />
                </div>
                <span className="w-8 shrink-0 text-right text-slate-400">{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Static reviews */}
        <div className="mt-6 space-y-4 border-t border-slate-100 pt-5">
          {reviews.map((r, i) => (
            <div key={i} className="flex gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy-100 text-xs font-bold text-navy-700">
                {r.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-navy-900">{r.name}</p>
                  {r.verifiedBuyer && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-bold text-accent-600">
                      <BadgeCheck className="h-3 w-3" /> Verified Buyer
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">· {r.daysAgo}d ago</span>
                </div>
                <div className="mt-0.5 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`h-3 w-3 ${j < r.star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  ))}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{r.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <h2 className="mb-3 mt-8 text-sm font-bold uppercase tracking-wider text-slate-400">
        Products from {seller.name}
      </h2>
      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-400">
            <PackageSearch className="h-6 w-6" />
          </span>
          <p className="text-sm font-medium text-navy-800">No products listed right now</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.key} product={product} wished={isWished(product.key)} onToggleWish={onToggleWish} onView={onView} onBuyNow={onBuyNow} isLoggedIn={isLoggedIn} onRequireLogin={onRequireLogin} />
          ))}
        </div>
      )}

      {/* ── Review Popup ──
          Rendered via a portal into <body> so its `fixed inset-0` anchors to
          the viewport, not to the transformed <main className="animate-fade-up">
          ancestor (whose forwards-fill transform would otherwise re-anchor the
          popup and push it off-screen / to the bottom). */}
      {reviewOpen && createPortal(
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeReviewPopup} />
          {/* Centered card · mobile keeps rounded-top sheet styling */}
          <div className="relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-3xl bg-white shadow-lift sm:max-w-md sm:rounded-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
              <h3 className="text-base font-bold text-navy-900">Write a Review</h3>
              <button onClick={closeReviewPopup} className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-7 w-7 text-green-600" />
                </span>
                <p className="text-sm font-semibold text-navy-900">Thank you for your review!</p>
                <p className="text-xs text-slate-500">Your feedback helps us improve.</p>
                <button onClick={closeReviewPopup} className="mt-2 rounded-lg bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">Done</button>
              </div>
            ) : (
              <form onSubmit={submitReview} className="px-5 py-4">
                {/* Star selector */}
                <div className="mb-4">
                  <p className="mb-2 text-sm font-semibold text-navy-800">Your Rating</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: s })} className="transition-transform hover:scale-110">
                        <Star className={`h-8 w-8 ${s <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="ml-2 self-center text-sm font-bold text-navy-800">{reviewForm.rating}.0</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <input value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} placeholder="Your name" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-navy-900 outline-none transition-colors focus:border-aqua-400 focus:bg-white" />
                    {reviewErrors.name && <p className="mt-1 text-[11px] text-red-500">{reviewErrors.name}</p>}
                  </div>
                  <div>
                    <input value={reviewForm.phone} onChange={(e) => setReviewForm({ ...reviewForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="Phone (10-digit)" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-navy-900 outline-none transition-colors focus:border-aqua-400 focus:bg-white" />
                    {reviewErrors.phone && <p className="mt-1 text-[11px] text-red-500">{reviewErrors.phone}</p>}
                  </div>
                  <div>
                    <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Write your review…" rows={3} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-navy-900 outline-none transition-colors focus:border-aqua-400 focus:bg-white" />
                    {reviewErrors.comment && <p className="mt-1 text-[11px] text-red-500">{reviewErrors.comment}</p>}
                  </div>
                </div>

                <button type="submit" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-aqua-500 to-navy-800 px-4 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lift">
                  <Send className="h-4 w-4" /> Submit Review
                </button>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* SEO Blog Section */}
      <SEOBlogSection
        title={SELLER_BLOGS.default.title}
        content={SELLER_BLOGS.default.content}
      />
    </section>
  )
}

function PieChartIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  )
}
