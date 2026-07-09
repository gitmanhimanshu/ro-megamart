import { useMemo } from 'react'
import { Package, AlertTriangle, TrendingUp, Box } from 'lucide-react'
import { CATEGORIES, PRODUCT_INDEX } from '../../../data'
import { BarChart, HorizontalBarChart, DonutChart, StatCard } from '../Charts'

const ALL_PRODUCTS = Object.values(PRODUCT_INDEX)
const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }

export default function SellerInventoryReportPage() {
  const products = useMemo(() => ALL_PRODUCTS.slice(0, 30).map((p) => {
    const h = hash(p.key)
    return {
      ...p,
      stock: 50 + (h % 950),
      sold: 10 + (h % 200),
      status: h % 10 < 7 ? 'In Stock' : h % 10 < 9 ? 'Low Stock' : 'Out of Stock',
    }
  }), [])

  const totalStock = products.reduce((s, p) => s + p.stock, 0)
  const totalSold = products.reduce((s, p) => s + p.sold, 0)
  const lowStock = products.filter((p) => p.status === 'Low Stock').length
  const outOfStock = products.filter((p) => p.status === 'Out of Stock').length

  const statusDonut = [
    { label: 'In Stock', value: products.filter((p) => p.status === 'In Stock').length, color: '#8cc63f' },
    { label: 'Low Stock', value: lowStock, color: '#f59e0b' },
    { label: 'Out of Stock', value: outOfStock, color: '#ef4444' },
  ]

  const categoryStock = CATEGORIES.slice(0, 8).map((c) => ({
    label: c.name.length > 16 ? c.name.slice(0, 14) + '…' : c.name,
    value: products.filter((p) => p.catId === c.id).reduce((s, p) => s + p.stock, 0),
  })).sort((a, b) => b.value - a.value)

  const topSelling = [...products].sort((a, b) => b.sold - a.sold).slice(0, 6)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-900 sm:text-2xl">Inventory Report</h1>
        <p className="text-sm text-slate-500">Stock levels, movement and low-stock alerts</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Stock" value={totalStock.toLocaleString('en-IN')} sub="Units in inventory" icon={Package} color="aqua" />
        <StatCard label="Total Sold" value={totalSold.toLocaleString('en-IN')} sub="Lifetime sales" icon={TrendingUp} color="green" />
        <StatCard label="Low Stock" value={lowStock} sub="Need restock" icon={AlertTriangle} color="accent" />
        <StatCard label="Out of Stock" value={outOfStock} sub="Urgent restock" icon={Box} color="red" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <DonutChart data={statusDonut} title="Stock Status" size={150} centerValue={products.length} centerLabel="Products" />
        <HorizontalBarChart data={categoryStock} title="Stock by Category" />
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
        <h3 className="mb-4 text-sm font-bold text-navy-800">Top Selling Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-2">Product</th>
                <th className="pb-2 text-right">Stock</th>
                <th className="pb-2 text-right">Sold</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {topSelling.map((p) => (
                <tr key={p.key} className="border-b border-slate-50 last:border-0">
                  <td className="max-w-[200px] truncate py-2.5 font-medium text-navy-800">{p.name}</td>
                  <td className="py-2.5 text-right text-slate-600">{p.stock}</td>
                  <td className="py-2.5 text-right font-semibold text-navy-800">{p.sold}</td>
                  <td className="py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      p.status === 'In Stock' ? 'bg-accent-50 text-accent-600' :
                      p.status === 'Low Stock' ? 'bg-amber-50 text-amber-600' :
                      'bg-red-50 text-red-500'
                    }`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
