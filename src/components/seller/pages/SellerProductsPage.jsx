import { useMemo, useState } from 'react'
import { Plus, CheckCircle2, Clock, Search, Package, AlertTriangle, Eye } from 'lucide-react'
import { CATEGORIES, PRODUCT_INDEX } from '../../../data'
import { DonutChart, HorizontalBarChart, StatCard } from '../Charts'

const ALL_PRODUCTS = Object.values(PRODUCT_INDEX)

const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }
const STATUS_BY = (key) => {
  const h = hash(key) % 10
  if (h < 7) return 'active'
  if (h < 9) return 'out-of-stock'
  return 'in-progress'
}
const subName = (catId, subSlug) =>
  CATEGORIES.find((c) => c.id === catId)?.subcategories.find((s) => s.slug === subSlug)?.name || '—'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'out-of-stock', label: 'Out Of Stock' },
  { id: 'in-progress', label: 'In Progress' },
]

const STATUS_BADGE = {
  active: { label: 'Active', cls: 'bg-accent-50 text-accent-600', icon: CheckCircle2 },
  'out-of-stock': { label: 'Out of Stock', cls: 'bg-red-50 text-red-500', icon: AlertTriangle },
  'in-progress': { label: 'In Progress', cls: 'bg-amber-50 text-amber-600', icon: Clock },
}

export default function SellerProductsPage({ onToast }) {
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')

  const myProducts = useMemo(() => ALL_PRODUCTS.slice(0, 30).map((p) => ({
    ...p,
    status: STATUS_BY(p.key),
    qty: 100 + (hash(p.key) % 9900),
    verified: hash(p.key) % 5 !== 0,
  })), [])

  const filtered = myProducts.filter((p) => {
    if (tab !== 'all' && p.status !== tab) return false
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  const statusCounts = {
    active: myProducts.filter((p) => p.status === 'active').length,
    'out-of-stock': myProducts.filter((p) => p.status === 'out-of-stock').length,
    'in-progress': myProducts.filter((p) => p.status === 'in-progress').length,
  }

  const statusDonut = [
    { label: 'Active', value: statusCounts.active, color: '#8cc63f' },
    { label: 'Out of Stock', value: statusCounts['out-of-stock'], color: '#ef4444' },
    { label: 'In Progress', value: statusCounts['in-progress'], color: '#f59e0b' },
  ]

  const categoryBreakdown = CATEGORIES.slice(0, 6).map((c) => ({
    label: c.name.length > 16 ? c.name.slice(0, 14) + '…' : c.name,
    value: myProducts.filter((p) => p.catId === c.id).length,
  })).filter((c) => c.value > 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Products</h1>
          <p className="text-sm text-slate-500">Manage your wholesale product listings</p>
        </div>
        <button
          onClick={() => onToast?.('Add Product — demo only.')}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-aqua-500 to-navy-800 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Products" value={myProducts.length} sub="All listings" icon={Package} color="aqua" />
        <StatCard label="Active" value={statusCounts.active} sub="Live on marketplace" icon={CheckCircle2} color="green" />
        <StatCard label="Out of Stock" value={statusCounts['out-of-stock']} sub="Need restock" icon={AlertTriangle} color="red" />
        <StatCard label="In Progress" value={statusCounts['in-progress']} sub="Pending approval" icon={Clock} color="accent" />
      </div>

      {/* Charts */}
      <div className="grid gap-5 lg:grid-cols-2">
        <DonutChart
          data={statusDonut}
          title="Stock Status"
          size={150}
          centerValue={myProducts.length}
          centerLabel="Products"
        />
        <HorizontalBarChart data={categoryBreakdown} title="Products by Category" />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const count = t.id === 'all' ? myProducts.length : (statusCounts[t.id] || 0)
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                tab === t.id
                  ? 'border-aqua-400 bg-aqua-50 text-aqua-700'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
              }`}
            >
              {t.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === t.id ? 'bg-aqua-100 text-aqua-700' : 'bg-slate-100 text-slate-500'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Products table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <h2 className="text-sm font-bold text-navy-800">Total Wholesale Products</h2>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" strokeWidth={1.5} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="w-56 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs focus:border-aqua-400 focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const StatusIcon = STATUS_BADGE[p.status].icon
                return (
                  <tr key={p.key} className="border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/60">
                    <td className="max-w-[220px] truncate px-4 py-3 font-medium text-navy-800" title={p.name}>{p.name}</td>
                    <td className="px-4 py-3 text-slate-600">{p.enquiryOnly ? '—' : `₹${p.price.toLocaleString('en-IN')}`}</td>
                    <td className="px-4 py-3 text-slate-600">{p.qty.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-slate-600">{p.catName}</td>
                    <td className="px-4 py-3 text-slate-600">{p.brand}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_BADGE[p.status].cls}`}>
                        <StatusIcon className="h-3 w-3" />
                        {STATUS_BADGE[p.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.verified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2.5 py-1 text-[11px] font-bold text-accent-600">
                          <CheckCircle2 className="h-3 w-3" /> Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-600">
                          <Clock className="h-3 w-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => onToast?.(`${p.name} — demo only.`)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-aqua-50 hover:text-aqua-600">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-400">No products match this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
