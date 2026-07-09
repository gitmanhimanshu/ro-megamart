import { useMemo, useState } from 'react'
import { ArrowLeft, Award, BadgeCheck, Search, PackageSearch } from 'lucide-react'
import LoopCarousel from './LoopCarousel'
import { Helmet } from 'react-helmet-async'
import { REAL_BRANDS } from '../data'

/**
 * BrandsView — flat grid of all brands, matching romegamart.com/brands.
 * No category grouping — just logo + name cards in a searchable grid.
 */
export default function BrandsView({ onClose, onSearchBrand, onOpenBrand }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return REAL_BRANDS
    const q = query.toLowerCase()
    return REAL_BRANDS.filter((b) => b.name.toLowerCase().includes(q))
  }, [query])

  const slides = [
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-navy-700 to-aqua-700 p-5 text-white sm:p-8">
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-md sm:h-32 sm:w-32" />
      <span className="relative inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
        <Award className="h-3 w-3" /> TOP
      </span>
      <div className="relative">
        <div className="relative z-10">
          <h1 className="text-base font-bold leading-tight sm:text-xl">All Brands</h1>
          <p className="mt-1 text-xs text-white/85 sm:text-sm">Verified manufacturers &amp; dealers</p>
        </div>
        <img
          src="https://images.romegamart.com/media/front_image/TOP_BRANDS.webp"
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-3 bottom-2 h-12 w-12 object-contain opacity-90 sm:h-20 sm:w-20 md:h-24 md:w-24"
        />
      </div>
    </div>,
    <div className="relative flex h-full w-full flex-col justify-center overflow-hidden bg-gradient-to-tr from-navy-700 to-aqua-700 px-6 sm:px-10">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <span className="relative inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
        <BadgeCheck className="h-3 w-3" /> Verified
      </span>
      <p className="relative mt-2 text-2xl font-extrabold text-white sm:text-4xl">{REAL_BRANDS.length}+ Brands</p>
      <p className="relative mt-1 max-w-xs text-xs text-white/80 sm:text-sm">Verified manufacturers &amp; dealers across categories</p>
    </div>,
  ]

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-6">
      <Helmet>
        <title>All Brands — Top RO Manufacturers & Distributors | Romegamart</title>
        <meta name="description" content="Explore top RO industry brands — domestic systems, industrial plants, water softeners &amp; more. Verified wholesale prices from India's largest B2B marketplace." />
        <meta property="og:title" content="All Brands — Romegamart B2B Marketplace" />
        <meta property="og:description" content="Browse trusted RO brands with verified wholesale pricing. 10,000+ products from top manufacturers." />
        <link rel="canonical" href="https://romegamart.com/brands" />
      </Helmet>
      <button onClick={onClose} className="mb-1 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-aqua-700">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to home
      </button>

      <div className="mt-2">
        <LoopCarousel slides={slides} heightClass="h-[140px] sm:h-[170px]" />
      </div>

      {/* Search */}
      <div className="relative mt-5">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search brands..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-navy-800 outline-none transition-colors focus:border-aqua-400 focus:ring-2 focus:ring-aqua-100"
        />
      </div>

      <p className="mt-3 text-sm text-slate-500">{filtered.length} {filtered.length === 1 ? 'brand' : 'brands'}</p>

      {/* Flat grid — all brands */}
      {filtered.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-2 py-10 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-400">
            <PackageSearch className="h-6 w-6" />
          </span>
          <p className="text-sm font-medium text-navy-800">No brands match "{query}"</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
          {filtered.map((b) => (
            <button
              key={b.name}
              onClick={() => onOpenBrand(b.name)}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-soft transition-all hover:-translate-y-1 hover:border-aqua-300 hover:shadow-lift sm:p-4"
            >
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-slate-50 sm:h-16 sm:w-16">
                <img
                  src={b.logo}
                  alt={b.name}
                  loading="lazy"
                  className="h-full w-full object-contain p-1"
                />
              </div>
              <p className="w-full truncate text-center text-[11px] font-bold text-navy-800 group-hover:text-aqua-700 sm:text-xs">{b.name}</p>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
