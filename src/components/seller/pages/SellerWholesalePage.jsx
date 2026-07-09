import { useMemo } from 'react'
import { Layers, TrendingDown, Package } from 'lucide-react'
import { PRODUCT_INDEX } from '../../../data'
import { StatCard } from '../Charts'

const ALL_PRODUCTS = Object.values(PRODUCT_INDEX)

const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }
const tiersFor = (p) => {
  if (p.enquiryOnly || !p.price) return null
  const base = p.price
  return [
    { range: '1 – 9 units', price: base, discount: 0, color: '#14a4e0' },
    { range: '10 – 49 units', price: Math.round(base * 0.93), discount: 7, color: '#1c2bb0' },
    { range: '50+ units', price: Math.round(base * 0.85), discount: 15, color: '#8cc63f' },
  ]
}

export default function SellerWholesalePage() {
  const products = useMemo(() => ALL_PRODUCTS.slice(0, 12).filter((p) => !p.enquiryOnly), [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Wholesale Products</h1>
        <p className="text-sm text-slate-500">Set quantity-based bulk pricing for your B2B buyers</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Listings" value={products.length} sub="Wholesale products" icon={Package} color="aqua" />
        <StatCard label="Max Discount" value="15%" sub="Bulk tier savings" icon={TrendingDown} color="green" />
        <StatCard label="Avg. Savings" value="7.3%" sub="Across all tiers" icon={Layers} color="navy" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((p) => {
          const tiers = tiersFor(p)
          if (!tiers) return null
          return (
            <div key={p.key} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex items-center gap-3 border-b border-slate-100 p-4">
                <img src={p.image} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-slate-100" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy-800" title={p.name}>{p.name}</p>
                  <p className="text-xs text-slate-400">{p.brand}</p>
                </div>
              </div>
              <div className="space-y-2 p-4">
                {tiers.map((t, i) => (
                  <div key={t.range} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 transition-colors hover:bg-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                      <span className="text-xs font-medium text-slate-600">{t.range}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {t.discount > 0 && (
                        <span className="rounded-full bg-accent-50 px-1.5 py-0.5 text-[10px] font-bold text-accent-600">
                          -{t.discount}%
                        </span>
                      )}
                      <span className="text-sm font-bold text-navy-800">₹{t.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Base price</span>
                  <span className="text-xs font-bold text-navy-800">₹{p.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-aqua-500 to-accent-500"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
