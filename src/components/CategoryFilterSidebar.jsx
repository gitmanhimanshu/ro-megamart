import { useMemo, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'

/**
 * useCategoryFilters — Color / Brand / Customer Rating / Price filtering for
 * a category-page product list, mirroring the sidebar on the real
 * romegamart.com category pages (Color & Brand as dropdowns, Rating as
 * radios, Price as a Minimum–Maximum input pair with Apply/Reset). Resets
 * whenever the product set changes (i.e. when the shopper switches
 * sub-category) so stale filters don't silently hide everything in the new
 * list.
 */
export function useCategoryFilters(products) {
  const [color, setColor] = useState('all')
  const [brand, setBrand] = useState('all')
  const [minRating, setMinRating] = useState(0)
  const [priceRange, setPriceRange] = useState(null) // applied { min, max } or null
  const [minInput, setMinInput] = useState('')
  const [maxInput, setMaxInput] = useState('')

  const colors = useMemo(() => [...new Set(products.map((p) => p.color).filter(Boolean))].sort(), [products])
  const brands = useMemo(() => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort(), [products])

  const filtered = useMemo(() => {
    let list = products
    if (color !== 'all') list = list.filter((p) => p.color === color)
    if (brand !== 'all') list = list.filter((p) => p.brand === brand)
    if (minRating > 0) list = list.filter((p) => (p.rating || 0) >= minRating)
    if (priceRange) {
      list = list.filter((p) => {
        const price = p.price || 0
        if (priceRange.min != null && price < priceRange.min) return false
        if (priceRange.max != null && price > priceRange.max) return false
        return true
      })
    }
    return list
  }, [products, color, brand, minRating, priceRange])

  const applyPrice = () => {
    const min = minInput.trim() === '' ? null : Number(minInput)
    const max = maxInput.trim() === '' ? null : Number(maxInput)
    if (min == null && max == null) { setPriceRange(null); return }
    setPriceRange({ min, max })
  }
  const resetPrice = () => { setMinInput(''); setMaxInput(''); setPriceRange(null) }

  const activeCount = (color !== 'all' ? 1 : 0) + (brand !== 'all' ? 1 : 0) + (minRating > 0 ? 1 : 0) + (priceRange ? 1 : 0)
  const clearAll = () => { setColor('all'); setBrand('all'); setMinRating(0); resetPrice() }

  const sidebar = (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Filters</span>
        {activeCount > 0 && (
          <button onClick={clearAll} className="inline-flex items-center gap-1 text-xs font-semibold text-aqua-600 hover:text-aqua-700">
            <X className="h-3 w-3" /> Clear ({activeCount})
          </button>
        )}
      </div>

      {colors.length > 0 && (
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Color</label>
          <div className="relative">
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm text-navy-700 outline-none transition-colors focus:border-aqua-400"
            >
              <option value="all">Select Color</option>
              {colors.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      )}

      {brands.length > 0 && (
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Brand</label>
          <div className="relative">
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm text-navy-700 outline-none transition-colors focus:border-aqua-400"
            >
              <option value="all">Select Brand</option>
              {brands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      )}

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Customer Ratings</label>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="radio"
                name="category-rating"
                checked={minRating === r}
                onChange={() => setMinRating(minRating === r ? 0 : r)}
                className="h-3.5 w-3.5 accent-aqua-500"
              />
              <span className="font-semibold text-amber-500">{r}★</span> & Above
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Price Range</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min="0"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            placeholder="Minimum"
            className="w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-navy-700 outline-none transition-colors focus:border-aqua-400"
          />
          <span className="shrink-0 text-slate-400">–</span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            placeholder="Maximum"
            className="w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-navy-700 outline-none transition-colors focus:border-aqua-400"
          />
        </div>
        <div className="mt-2.5 flex gap-2">
          <button
            type="button"
            onClick={applyPrice}
            className="flex-1 rounded-lg bg-navy-800 py-2 text-xs font-bold text-white transition-colors hover:bg-navy-700"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={resetPrice}
            className="flex-1 rounded-lg bg-slate-200 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-300"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )

  return { filtered, sidebar, activeCount }
}
