import { ArrowRight, Layers3, Repeat2, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react'
import ProductCard from './ProductCard'

const FEATURES = [
  {
    icon: WandSparkles,
    title: 'Smart Recommendations',
    body: 'Popular RO products grouped for dealers, service teams and repeat B2B buyers.',
  },
  {
    icon: Repeat2,
    title: 'Fast Reordering',
    body: 'Keep commonly sourced membranes, pumps and fittings one tap away on every device.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Business Supply',
    body: 'Browse curated picks from trusted sellers with pricing built for wholesale intent.',
  },
]

export default function SuggestedSection({
  products,
  onBrowseAll,
  isWished,
  onToggleWish,
  onView,
  onBuyNow,
  isLoggedIn,
  onRequireLogin,
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-soft">
        <div className="relative overflow-hidden bg-gradient-to-r from-aqua-700 via-navy-800 to-navy-900 px-5 py-6 sm:px-8">
          <div className="absolute -left-12 top-0 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-accent-400/20 blur-2xl" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-aqua-100">
                <Sparkles className="h-3.5 w-3.5" />
                Suggested For You
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                Recommended RO products and buyer-first features
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-aqua-100/80 sm:text-base">
                Curated picks for fast-moving RO businesses, plus a few tools that make sourcing easier on mobile and desktop.
              </p>
            </div>

            <button
              onClick={onBrowseAll}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-navy-900 transition-all hover:-translate-y-0.5"
            >
              Explore categories
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <div className="grid gap-4 border-b border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-2 lg:grid-cols-3 sm:p-5">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-soft">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-aqua-50 text-aqua-600">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-navy-800">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-5 sm:px-5 sm:py-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-navy-800 text-white">
              <Layers3 className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-navy-800">Suggested products</h3>
              <p className="text-xs text-slate-500 sm:text-sm">Responsive product recommendations based on high-interest RO categories.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
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
        </div>
      </div>
    </section>
  )
}
