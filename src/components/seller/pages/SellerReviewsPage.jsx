import { useMemo } from 'react'
import { Star, MessageSquare, ThumbsUp, TrendingUp } from 'lucide-react'
import { PRODUCT_INDEX } from '../../../data'
import { HorizontalBarChart, StatCard, DonutChart } from '../Charts'

const ALL_PRODUCTS = Object.values(PRODUCT_INDEX)
const NAMES = ['Rakesh Sharma', 'Priya Patel', 'Amit Verma', 'Sunita Iyer', 'Vikram Singh', 'Anjali Gupta', 'Deepak Kumar', 'Meera Nair']
const COMMENTS = [
  'Genuine product, exactly as described. Fast delivery too.',
  'Good quality for the price. Will order again.',
  'Packaging could be better but the product works great.',
  'Excellent build quality, matches industrial standards.',
  'Quick response from the seller for our enquiry.',
  'Perfect fit for our RO system. Highly recommended.',
  'Value for money. Bulk order was handled smoothly.',
]
const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }

export default function SellerReviewsPage({ onToast }) {
  const reviews = useMemo(() => ALL_PRODUCTS.slice(0, 12).map((p) => {
    const h = hash(p.key)
    return {
      key: p.key,
      product: p.name,
      image: p.image,
      reviewer: NAMES[h % NAMES.length],
      rating: 3 + (h % 3),
      comment: COMMENTS[h % COMMENTS.length],
      date: new Date(Date.now() - h % (1000 * 60 * 60 * 24 * 30)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      helpful: h % 8,
    }
  }), [])

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0

  const ratingDist = [5, 4, 3, 2, 1].map((stars) => ({
    label: `${stars} ★`,
    value: reviews.filter((r) => r.rating === stars).length,
    color: stars >= 4 ? '#8cc63f' : stars === 3 ? '#f59e0b' : '#ef4444',
  }))

  const sentimentDonut = [
    { label: 'Positive (4-5★)', value: reviews.filter((r) => r.rating >= 4).length, color: '#8cc63f' },
    { label: 'Neutral (3★)', value: reviews.filter((r) => r.rating === 3).length, color: '#f59e0b' },
    { label: 'Negative (1-2★)', value: reviews.filter((r) => r.rating <= 2).length, color: '#ef4444' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Product Reviews</h1>
        <p className="text-sm text-slate-500">See what buyers are saying about your listings</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Avg. Rating" value={`${avgRating} ★`} sub={`${reviews.length} reviews`} icon={Star} color="accent" />
        <StatCard label="5 Star Reviews" value={reviews.filter((r) => r.rating === 5).length} sub="Excellent" icon={ThumbsUp} color="green" />
        <StatCard label="Positive" value={`${Math.round((reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100)}%`} sub="Satisfaction rate" icon={TrendingUp} color="aqua" />
        <StatCard label="Replies Sent" value={reviews.length - 2} sub="Response rate" icon={MessageSquare} color="navy" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <HorizontalBarChart data={ratingDist} title="Rating Distribution" showPercent={false} />
        <DonutChart data={sentimentDonut} title="Review Sentiment" size={150} centerValue={`${avgRating}★`} centerLabel="Average" />
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.key} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
            <div className="flex gap-4">
              <img src={r.image} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-navy-800" title={r.product}>{r.product}</p>
                  <span className="flex shrink-0 items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    ))}
                    <span className="ml-1 text-[11px] font-bold text-slate-500">({r.rating}.0)</span>
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-xs font-medium text-slate-500">{r.reviewer}</p>
                  <span className="text-[10px] text-slate-300">•</span>
                  <p className="text-[11px] text-slate-400">{r.date}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{r.comment}</p>
                <div className="mt-2.5 flex items-center gap-3">
                  <button onClick={() => onToast?.('Reply — demo only.')} className="inline-flex items-center gap-1.5 text-xs font-semibold text-aqua-700 hover:text-aqua-800">
                    <MessageSquare className="h-3 w-3" strokeWidth={1.5} /> Reply
                  </button>
                  {r.helpful > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                      <ThumbsUp className="h-2.5 w-2.5" strokeWidth={1.5} /> {r.helpful} found this helpful
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
