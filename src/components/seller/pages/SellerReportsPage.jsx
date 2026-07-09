import { TrendingUp, IndianRupee, Package, Percent, ShoppingCart, Users, Eye, ArrowUpRight } from 'lucide-react'
import { StatCard, LineChart, BarChart, HorizontalBarChart, DonutChart } from '../Charts'

const MONTHLY_REVENUE = [
  { label: 'Jan', value: 42000 },
  { label: 'Feb', value: 58000 },
  { label: 'Mar', value: 39000 },
  { label: 'Apr', value: 71000 },
  { label: 'May', value: 64000 },
  { label: 'Jun', value: 88000 },
]

const DAILY_ORDERS = [
  { label: '1', value: 8 }, { label: '5', value: 12 }, { label: '10', value: 6 },
  { label: '15', value: 18 }, { label: '20', value: 14 }, { label: '25', value: 22 },
  { label: '30', value: 10 },
]

const CATEGORY_REVENUE = [
  { label: 'Domestic Spares', value: 88000, color: '#14a4e0' },
  { label: 'Industrial Spares', value: 64000, color: '#1c2bb0' },
  { label: 'Domestic Systems', value: 52000, color: '#f59e0b' },
  { label: 'Commercial Systems', value: 38000, color: '#8cc63f' },
  { label: 'Industrial Systems', value: 32000, color: '#ef4444' },
]

const TRAFFIC_SOURCE = [
  { label: 'Direct Search', value: 42, color: '#14a4e0' },
  { label: 'Category Browse', value: 28, color: '#1c2bb0' },
  { label: 'External Links', value: 18, color: '#f59e0b' },
  { label: 'Repeat Visitors', value: 12, color: '#8cc63f' },
]

const CONVERSION_FUNNEL = [
  { label: 'Page Views', value: 12400, color: '#14a4e0' },
  { label: 'Product Views', value: 4800, color: '#1c2bb0' },
  { label: 'Add to Cart', value: 860, color: '#f59e0b' },
  { label: 'Orders Placed', value: 340, color: '#8cc63f' },
]

export default function SellerReportsPage() {
  const totalRevenue = MONTHLY_REVENUE.reduce((a, b) => a + b.value, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Sales Report</h1>
        <p className="text-sm text-slate-500">Detailed performance analytics for your store</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Revenue" value={`₹${(totalRevenue / 100000).toFixed(2)}L`} sub="Last 6 months" icon={IndianRupee} trend={18} color="green" />
        <StatCard label="Avg. Order Value" value="₹2,765" sub="Per order" icon={TrendingUp} trend={5} color="aqua" />
        <StatCard label="Units Sold" value="1,284" sub="Total items" icon={Package} trend={12} color="navy" />
        <StatCard label="Conversion Rate" value="4.2%" sub="Visitor → buyer" icon={Percent} trend={-2} color="accent" />
      </div>

      {/* Revenue trend + Order status donut */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <LineChart
          data={MONTHLY_REVENUE}
          title="Monthly Revenue Trend"
          className="sm:col-span-2 lg:col-span-2"
          height={240}
          color="#14a4e0"
        />
        <DonutChart
          data={TRAFFIC_SOURCE}
          title="Traffic Sources"
          size={150}
          centerValue="12.4K"
          centerLabel="Visitors"
        />
      </div>

      {/* Daily orders + Category revenue */}
      <div className="grid gap-5 sm:grid-cols-2">
        <BarChart data={DAILY_ORDERS} title="Daily Orders (This Month)" height={200} showValues={true} />
        <HorizontalBarChart data={CATEGORY_REVENUE} title="Revenue by Category" />
      </div>

      {/* Conversion funnel */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft sm:p-5">
        <h3 className="mb-4 text-sm font-bold text-navy-800 sm:mb-5">Conversion Funnel</h3>
        <div className="space-y-3">
          {CONVERSION_FUNNEL.map((step, i) => {
            const widthPct = (step.value / CONVERSION_FUNNEL[0].value) * 100
            const convRate = i > 0 ? ((step.value / CONVERSION_FUNNEL[i - 1].value) * 100).toFixed(1) : '100'
            return (
              <div key={step.label}>
                {/* Label + value row */}
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">{step.label}</span>
                  <span className="text-[11px] font-bold text-navy-800">{step.value.toLocaleString('en-IN')}</span>
                </div>
                {/* Bar */}
                <div className="relative h-8 w-full overflow-hidden rounded-lg bg-slate-100 sm:h-9">
                  <div
                    className="absolute inset-y-0 left-0 flex items-center justify-end rounded-lg px-2 transition-all duration-700"
                    style={{ width: `${Math.max(widthPct, 12)}%`, backgroundColor: step.color }}
                  >
                    {i > 0 && widthPct > 20 && (
                      <span className="text-[10px] font-bold text-white/90">{convRate}% →</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Performance metrics */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {[
          { label: 'Avg. Response Time', value: '2.4 hrs', trend: '+15%', up: false, icon: Eye },
          { label: 'Repeat Customer Rate', value: '34%', trend: '+8%', up: true, icon: Users },
          { label: 'Cart Abandonment', value: '62%', trend: '-3%', up: true, icon: ShoppingCart },
          { label: 'Revenue per Visitor', value: '₹292', trend: '+12%', up: true, icon: IndianRupee },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-soft sm:p-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-aqua-50 text-aqua-600 sm:h-9 sm:w-9">
                <m.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.5} />
              </span>
              <div className="min-w-0">
                <p className="text-lg font-extrabold text-navy-900 sm:text-xl">{m.value}</p>
                <p className="truncate text-[10px] text-slate-400 sm:text-[11px]">{m.label}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <span className={`text-[10px] font-bold sm:text-[11px] ${m.up ? 'text-accent-600' : 'text-red-500'}`}>
                {m.up ? '↑' : '↓'} {m.trend}
              </span>
              <span className="text-[9px] text-slate-400 sm:text-[10px]">vs last month</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
