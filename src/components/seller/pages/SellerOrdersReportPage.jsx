import { useMemo } from 'react'
import { ShoppingCart, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'
import { PRODUCT_INDEX } from '../../../data'
import { BarChart, LineChart, DonutChart, HorizontalBarChart, StatCard } from '../Charts'

const ALL_PRODUCTS = Object.values(PRODUCT_INDEX)
const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }
const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered']
const BUYERS = ['Sharma Water', 'Aqua Fresh', 'Patel RO Care', 'Indus Water', 'BlueDrop']

const WEEKLY = [
  { label: 'Mon', value: 8 }, { label: 'Tue', value: 12 }, { label: 'Wed', value: 6 },
  { label: 'Thu', value: 15 }, { label: 'Fri', value: 10 }, { label: 'Sat', value: 18 }, { label: 'Sun', value: 9 },
]

const MONTHLY = [
  { label: 'Jan', value: 42 }, { label: 'Feb', value: 58 }, { label: 'Mar', value: 35 },
  { label: 'Apr', value: 71 }, { label: 'May', value: 64 }, { label: 'Jun', value: 88 },
]

export default function SellerOrdersReportPage() {
  const orders = useMemo(() => ALL_PRODUCTS.slice(0, 20).map((p, i) => {
    const h = hash(p.key)
    return {
      id: `ROM${10234 + i}`,
      product: p.name,
      buyer: BUYERS[h % BUYERS.length],
      amount: p.price ? p.price * (1 + (h % 10)) : 0,
      status: STATUSES[h % STATUSES.length],
      date: new Date(Date.now() - h % (1000 * 60 * 60 * 24 * 30)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    }
  }), [])

  const totalRevenue = orders.reduce((s, o) => s + o.amount, 0)
  const avgOrder = orders.length ? Math.round(totalRevenue / orders.length) : 0

  const statusDonut = STATUSES.map((s) => ({
    label: s,
    value: orders.filter((o) => o.status === s).length,
    color: s === 'Delivered' ? '#8cc63f' : s === 'Shipped' ? '#14a4e0' : s === 'Processing' ? '#f59e0b' : '#ef4444',
  }))

  const buyerData = BUYERS.map((b) => ({
    label: b,
    value: orders.filter((o) => o.buyer === b).reduce((s, o) => s + o.amount, 0),
  })).sort((a, b) => b.value - a.value)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-900 sm:text-2xl">Orders Report</h1>
        <p className="text-sm text-slate-500">Order volume, revenue and buyer breakdown</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Orders" value={orders.length} sub="All time" icon={ShoppingCart} color="aqua" />
        <StatCard label="Revenue" value={`₹${(totalRevenue / 1000).toFixed(1)}K`} sub="Total sales" icon={TrendingUp} color="green" />
        <StatCard label="Avg. Order" value={`₹${avgOrder.toLocaleString('en-IN')}`} sub="Per order" icon={Clock} color="navy" />
        <StatCard label="Delivered" value={orders.filter((o) => o.status === 'Delivered').length} sub="Completed" icon={CheckCircle2} color="accent" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <LineChart data={MONTHLY} title="Monthly Orders Trend" height={200} color="#14a4e0" />
        <DonutChart data={statusDonut} title="Order Status" size={140} centerValue={orders.length} centerLabel="Total" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <BarChart data={WEEKLY} title="Weekly Order Volume" height={160} />
        <HorizontalBarChart data={buyerData} title="Revenue by Buyer" />
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft sm:p-5">
        <h3 className="mb-4 text-sm font-bold text-navy-800">Recent Orders</h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-2 pr-4">Order</th>
                <th className="pb-2 pr-4">Buyer</th>
                <th className="pb-2 pr-4">Date</th>
                <th className="pb-2 pr-4 text-right">Amount</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((o) => (
                <tr key={o.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-2.5 pr-4 font-semibold text-navy-800">{o.id}</td>
                  <td className="py-2.5 pr-4 text-slate-600">{o.buyer}</td>
                  <td className="py-2.5 pr-4 text-slate-500">{o.date}</td>
                  <td className="py-2.5 pr-4 text-right font-semibold text-navy-800">₹{o.amount.toLocaleString('en-IN')}</td>
                  <td className="py-2.5">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap ${
                      o.status === 'Delivered' ? 'bg-accent-50 text-accent-600' :
                      o.status === 'Shipped' ? 'bg-aqua-50 text-aqua-700' :
                      o.status === 'Processing' ? 'bg-amber-50 text-amber-600' :
                      'bg-red-50 text-red-500'
                    }`}>{o.status}</span>
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
