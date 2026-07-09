import { useState, useMemo } from 'react'
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react'

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: 'under1000', label: 'Under ₹1,000' },
  { id: '1000-5000', label: '₹1,000 – ₹5,000' },
  { id: '5000-20000', label: '₹5,000 – ₹20,000' },
  { id: 'above20000', label: 'Above ₹20,000' },
]

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Sort: Relevance' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Customer Rating' },
]

/**
 * useFilterSort — price-range / brand filter + sort logic for any product
 * list. Returns the filtered+sorted array and a standalone `bar` element, so
 * the bar can be placed anywhere on the page independent of the grid it
 * controls. The bar is always expanded (no click-to-open popover) so every
 * filter is visible and usable in one tap, including on mobile.
 */
export function useFilterSort(products) {
  const [sortBy, setSortBy] = useState('relevance')
  const [priceFilter, setPriceFilter] = useState('all')
  const [selectedBrands, setSelectedBrands] = useState(() => new Set())

  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort(),
    [products],
  )

  const toggleBrand = (b) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev)
      next.has(b) ? next.delete(b) : next.add(b)
      return next
    })
  }

  const clearAll = () => { setPriceFilter('all'); setSelectedBrands(new Set()) }
  const activeFilterCount = (priceFilter !== 'all' ? 1 : 0) + selectedBrands.size

  const filtered = useMemo(() => {
    let list = products
    if (priceFilter !== 'all') {
      list = list.filter((p) => {
        const price = p.price || 0
        if (priceFilter === 'under1000') return price > 0 && price < 1000
        if (priceFilter === '1000-5000') return price >= 1000 && price < 5000
        if (priceFilter === '5000-20000') return price >= 5000 && price < 20000
        if (priceFilter === 'above20000') return price >= 20000
        return true
      })
    }
    if (selectedBrands.size > 0) {
      list = list.filter((p) => selectedBrands.has(p.brand))
    }
    if (sortBy !== 'relevance') {
      list = [...list].sort((a, b) => {
        if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0)
        if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0)
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
        return 0
      })
    }
    return list
  }, [products, priceFilter, selectedBrands, sortBy])

  const bar = (
    <div className="min-w-0">
      {/* Header row: label + sort select. Sort goes full-width on its own line on mobile, inline on larger screens. */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
          <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          {activeFilterCount > 0 && (
            <span className="grid h-4 min-w-4 place-items-center rounded-full bg-aqua-500 px-1 text-[10px] font-bold text-white">{activeFilterCount}</span>
          )}
        </span>

        <div className="relative w-full sm:ml-auto sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3.5 pr-8 text-xs font-medium text-navy-700 transition-colors hover:border-aqua-300 focus:border-aqua-400 sm:w-auto sm:text-sm"
          >
            {SORT_OPTIONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Price — horizontally scrollable row on mobile, wraps on larger screens */}
      <div className="mt-3 flex min-w-0 items-center gap-2">
        <span className="shrink-0 text-[11px] font-semibold text-slate-400">Price</span>
        <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-1 sm:flex-wrap">
          {PRICE_RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setPriceFilter(r.id)}
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                priceFilter === r.id ? 'border-aqua-400 bg-aqua-50 text-aqua-700' : 'border-slate-200 text-slate-600 hover:border-aqua-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brand — same horizontally-scrollable pill pattern */}
      {brands.length > 0 && (
        <div className="mt-2.5 flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-[11px] font-semibold text-slate-400">Brand</span>
          <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-1 sm:flex-wrap">
            {brands.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => toggleBrand(b)}
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  selectedBrands.has(b) ? 'border-aqua-400 bg-aqua-50 text-aqua-700' : 'border-slate-200 text-slate-600 hover:border-aqua-200'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active filter chips + clear-all */}
      {(priceFilter !== 'all' || selectedBrands.size > 0) && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
          {priceFilter !== 'all' && (
            <Chip onClear={() => setPriceFilter('all')}>{PRICE_RANGES.find((r) => r.id === priceFilter)?.label}</Chip>
          )}
          {[...selectedBrands].map((b) => (
            <Chip key={b} onClear={() => toggleBrand(b)}>{b}</Chip>
          ))}
          <button type="button" onClick={clearAll} className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-aqua-600 hover:text-aqua-700">
            <X className="h-3 w-3" /> Clear all
          </button>
        </div>
      )}
    </div>
  )

  return { filtered, bar }
}

/**
 * FilterSortBar — convenience wrapper around useFilterSort for pages that
 * want the bar rendered immediately above the grid it controls.
 */
export default function FilterSortBar({ products, children }) {
  const { filtered, bar } = useFilterSort(products)
  return (
    <>
      <div className="mb-4 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-soft">{bar}</div>
      {children(filtered)}
    </>
  )
}

function Chip({ children, onClear }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
      <span className="truncate">{children}</span>
      <button type="button" onClick={onClear} className="shrink-0 text-slate-400 hover:text-red-500"><X className="h-3 w-3" /></button>
    </span>
  )
}
