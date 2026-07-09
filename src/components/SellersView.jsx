import { useMemo, useState } from 'react'
import { ArrowLeft, Users, Search, MapPin, Star, BadgeCheck, PackageSearch } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

/**
 * SellersView — "All Sellers" directory, mirroring romegamart.com/sellers/.
 * Lets buyers browse verified sellers by name/city and filter by category,
 * then jump into that seller's products via search.
 */
export default function SellersView({ sellers, onClose, onViewSeller }) {
  const [query, setQuery] = useState('')
  const [catFilter, setCatFilter] = useState('all')

  const categories = useMemo(() => {
    const set = new Set()
    sellers.forEach((s) => s.categories.forEach((c) => set.add(c)))
    return [...set].sort()
  }, [sellers])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sellers.filter((s) => {
      const matchesQuery = !q || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
      const matchesCat = catFilter === 'all' || s.categories.includes(catFilter)
      return matchesQuery && matchesCat
    })
  }, [sellers, query, catFilter])

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-6">
      <Helmet>
        <title>All Sellers — Verified RO Dealers & Distributors | Romegamart</title>
        <meta name="description" content="Browse 2000+ verified sellers of RO spares, membranes, pumps &amp; water purifiers across India. Filter by name, city &amp; category." />
        <meta property="og:title" content="All Sellers — Romegamart B2B Marketplace" />
        <meta property="og:description" content="Find trusted RO industry dealers, distributors &amp; retailers. Best wholesale prices verified daily." />
        <link rel="canonical" href="https://romegamart.com/sellers" />
      </Helmet>
      <button onClick={onClose} className="mb-1 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-aqua-700">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to home
      </button>

      <div className="mt-2 flex items-center gap-2">
        <Users className="h-5 w-5 text-aqua-600" />
        <h1 className="text-xl font-bold text-navy-900 sm:text-2xl">All Sellers</h1>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        {sellers.length} verified sellers across the RO industry — manufacturers, dealers & distributors.
      </p>

      {/* Search + category filter */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sellers by name or city…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-navy-800 outline-none transition-colors focus:border-aqua-400"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy-800 outline-none focus:border-aqua-400 sm:w-64"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-2 py-10 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-400">
            <PackageSearch className="h-6 w-6" />
          </span>
          <p className="text-sm font-medium text-navy-800">No sellers match that search</p>
          <p className="text-xs text-slate-500">Try a different name, city, or category.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <div key={s.name} className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft transition-shadow hover:shadow-lift">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-aqua-500 to-navy-800 text-sm font-bold text-white">
                  {s.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-navy-900">{s.name}</p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="h-3 w-3 text-accent-500" /> {s.city}
                  </div>
                </div>
                {s.verified && (
                  <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-50 px-2 py-1 text-[10px] font-bold text-accent-600">
                    <BadgeCheck className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-500">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {s.rating}
                <span className="font-normal text-slate-400">
                  ({s.reviewCount}) · {s.productCount} {s.productCount === 1 ? 'product' : 'products'}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.categories.slice(0, 2).map((c) => (
                  <span key={c} className="rounded-full bg-aqua-50 px-2 py-0.5 text-[10px] font-medium text-aqua-700">{c}</span>
                ))}
                {s.categories.length > 2 && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">+{s.categories.length - 2} more</span>
                )}
              </div>

              <button
                onClick={() => onViewSeller(s.name)}
                className="mt-4 w-full rounded-lg border border-aqua-200 py-2 text-xs font-bold text-aqua-700 transition-colors hover:border-aqua-400 hover:bg-aqua-50"
              >
                View Products
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
