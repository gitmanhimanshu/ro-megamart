import { useNavigate } from 'react-router-dom'
import { Package, ShoppingCart, HelpCircle, IndianRupee, TrendingUp, Users, Eye, ArrowUpRight, BarChart3 } from 'lucide-react'
import { CATEGORIES } from '../../../data'
import { StatCard, BarChart, DonutChart, HorizontalBarChart, LineChart } from '../Charts'

const WEEKLY_ORDERS = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 18 },
  { label: 'Wed', value: 8 },
  { label: 'Thu', value: 24 },
  { label: 'Fri', value: 16 },
  { label: 'Sat', value: 28 },
  { label: 'Sun', value: 14 },
]

const REVENUE_TREND = [
  { label: 'Jan', value: 42000 },
  { label: 'Feb', value: 58000 },
  { label: 'Mar', value: 39000 },
  { label: 'Apr', value: 71000 },
  { label: 'May', value: 64000 },
  { label: 'Jun', value: 88000 },
]

const ORDER_STATUS = [
  { label: 'Delivered', value: 28, color: '#8cc63f' },
  { label: 'Shipped', value: 12, color: '#14a4e0' },
  { label: 'Processing', value: 8, color: '#f59e0b' },
  { label: 'Pending', value: 4, color: '#ef4444' },
]

const TOP_CATEGORIES = CATEGORIES.slice(0, 8).map((c) => ({
  label: c.name.length > 18 ? c.name.slice(0, 16) + '…' : c.name,
  value: c.products.length,
})).sort((a, b) => b.value - a.value)

const TOP_PRODUCTS = [
  { label: 'Membranes', value: 32, color: '#14a4e0' },
  { label: 'Pumps', value: 24, color: '#1c2bb0' },
  { label: 'Cabinets', value: 18, color: '#f59e0b' },
  { label: 'Cartridges', value: 15, color: '#8cc63f' },
  { label: 'Plants', value: 8, color: '#ef4444' },
]

export default function SellerDashboardPage() {
  const navigate = useNavigate()
  const totalProducts = CATEGORIES.reduce((sum, c) => sum + c.products.length, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back! Here's your store overview.</p>
        </div>
        <span className="hidden rounded-full bg-aqua-50 px-3 py-1 text-xs font-semibold text-aqua-700 sm:inline-block">
          Last updated: just now
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue" value="₹3.62L" sub="vs last month" icon={IndianRupee} trend={12.5} color="green" sparkData={[42, 58, 39, 71, 64, 88]} />
        <StatCard label="Orders" value="52" sub="vs last month" icon={ShoppingCart} trend={8.3} color="aqua" sparkData={[12, 18, 8, 24, 16, 28]} />
        <StatCard label="Products" value={totalProducts} sub="vs last month" icon={Package} trend={5.2} color="navy" sparkData={[20, 22, 19, 25, 28, 30]} />
        <StatCard label="Customers" value="245" sub="vs last month" icon={Users} trend={7.1} color="amber" sparkData={[30, 35, 28, 42, 38, 45]} />
      </div>

      {/* Revenue line chart + Order status donut */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <LineChart
          data={REVENUE_TREND}
          title="Revenue Trend (6 months)"
          className="sm:col-span-2 lg:col-span-2"
          height={220}
          color="#14a4e0"
        />
        <DonutChart
          data={ORDER_STATUS}
          title="Order Status"
          size={150}
          centerValue={52}
          centerLabel="Total"
        />
      </div>

      {/* Weekly orders bar chart + Top categories horizontal bar */}
      <div className="grid gap-5 sm:grid-cols-2">
        <BarChart data={WEEKLY_ORDERS} title="Weekly Orders" height={180} />
        <HorizontalBarChart data={TOP_CATEGORIES} title="Products by Category" />
      </div>

      {/* Recent orders + Top selling — min-w-0 keeps these grid items from
          being stretched wide by the table's min-w-[450px] below (a CSS
          Grid item's default min-width is its content's intrinsic width,
          which would otherwise blow out the whole row on mobile). */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Recent Orders */}
        <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft sm:p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy-800">Recent Orders</h3>
            <button className="text-xs font-semibold text-aqua-600 hover:text-aqua-700">View All</button>
          </div>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[450px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-2 pr-3">Order</th>
                  <th className="pb-2 pr-3">Product</th>
                  <th className="pb-2 pr-3">Buyer</th>
                  <th className="pb-2 pr-3 text-right">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'ROM10247', product: 'Vontron 80 GPD Membrane', buyer: 'Sharma Water', amount: 14990, status: 'Delivered' },
                  { id: 'ROM10246', product: 'Olivar Cyclone Booster Pump', buyer: 'Aqua Fresh', amount: 8990, status: 'Shipped' },
                  { id: 'ROM10245', product: '1000 LPH Industrial RO Plant', buyer: 'Patel RO Care', amount: 145000, status: 'Processing' },
                  { id: 'ROM10244', product: 'Pentair PP Spun Filter', buyer: 'Indus Water', amount: 4950, status: 'Pending' },
                ].map((o) => (
                  <tr key={o.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-2.5 pr-3 font-semibold text-navy-800">{o.id}</td>
                    <td className="max-w-[160px] truncate py-2.5 pr-3 text-slate-600">{o.product}</td>
                    <td className="py-2.5 pr-3 text-slate-600">{o.buyer}</td>
                    <td className="py-2.5 pr-3 text-right font-semibold text-navy-800">₹{o.amount.toLocaleString('en-IN')}</td>
                    <td className="py-2.5">
                      <span className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold ${
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

        {/* Top Selling Products */}
        <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft sm:p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-bold text-navy-800">Top Selling Products</h3>
          <div className="space-y-4">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.label}>
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                      {i + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-700">{p.label}</span>
                  </div>
                  <span className="text-xs font-bold text-navy-800">{p.value} sold</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(p.value / 32) * 100}%`, backgroundColor: p.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Add Product', icon: Package, color: 'bg-aqua-50 text-aqua-600', to: '/seller/products' },
                { label: 'View Orders', icon: ShoppingCart, color: 'bg-navy-50 text-navy-700', to: '/seller/orders' },
                { label: 'Bulk Upload', icon: ArrowUpRight, color: 'bg-navy-50 text-navy-600', to: '/seller/products/bulk-upload' },
                { label: 'Analytics', icon: BarChart3, color: 'bg-amber-50 text-amber-600', to: '/seller/reports' },
              ].map((a) => (
                <button key={a.label} onClick={() => navigate(a.to)} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-aqua-300 hover:bg-aqua-50/50">
                  <span className={`grid h-6 w-6 place-items-center rounded-lg ${a.color}`}><a.icon className="h-3 w-3" strokeWidth={1.5} /></span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
