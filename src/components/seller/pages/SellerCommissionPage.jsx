import { useMemo } from 'react'
import { Wallet, TrendingDown, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { PRODUCT_INDEX } from '../../../data'
import { StatCard, LineChart, BarChart, DonutChart } from '../Charts'

const ALL_PRODUCTS = Object.values(PRODUCT_INDEX)
const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }

const MONTHLY_COMMISSION = [
  { label: 'Jan', value: 3200 },
  { label: 'Feb', value: 4100 },
  { label: 'Mar', value: 2800 },
  { label: 'Apr', value: 5200 },
  { label: 'May', value: 4800 },
  { label: 'Jun', value: 6400 },
]

const COMMISSION_BY_CATEGORY = [
  { label: 'Domestic Spares', value: 4800, color: '#14a4e0' },
  { label: 'Industrial Spares', value: 3600, color: '#1c2bb0' },
  { label: 'Systems', value: 2800, color: '#f59e0b' },
  { label: 'Others', value: 1200, color: '#8cc63f' },
]

export default function SellerCommissionPage() {
  const rows = useMemo(() => ALL_PRODUCTS.slice(0, 15).filter((p) => p.price).map((p, i) => {
    const h = hash(p.key)
    const amount = p.price * (1 + (h % 10))
    const commissionPct = 5 + (h % 6)
    const commission = Math.round(amount * commissionPct / 100)
    return {
      id: `TXN${50012 + i}`,
      date: new Date(Date.now() - h % (1000 * 60 * 60 * 24 * 60)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      product: p.name,
      amount,
      commissionPct,
      commission,
      payout: amount - commission,
      status: h % 4 === 0 ? 'Processing' : 'Paid',
    }
  }), [])

  const totalPayout = rows.reduce((s, r) => s + r.payout, 0)
  const totalCommission = rows.reduce((s, r) => s + r.commission, 0)
  const avgCommissionPct = rows.length ? Math.round(rows.reduce((s, r) => s + r.commissionPct, 0) / rows.length) : 0

  const statusDonut = [
    { label: 'Paid', value: rows.filter((r) => r.status === 'Paid').length, color: '#8cc63f' },
    { label: 'Processing', value: rows.filter((r) => r.status === 'Processing').length, color: '#f59e0b' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Commission History</h1>
        <p className="text-sm text-slate-500">Platform commission deducted from each sale</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Total Payout" value={`₹${totalPayout.toLocaleString('en-IN')}`} sub="You received" icon={ArrowUpRight} color="green" trend={14} />
        <StatCard label="Total Commission" value={`₹${totalCommission.toLocaleString('en-IN')}`} sub="Platform fee" icon={TrendingDown} color="accent" />
        <StatCard label="Avg. Commission" value={`${avgCommissionPct}%`} sub="Per transaction" icon={Wallet} color="aqua" />
        <StatCard label="Transactions" value={rows.length} sub="Total orders" icon={ArrowDownRight} color="navy" />
      </div>

      {/* Commission trend + Status donut */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <LineChart
          data={MONTHLY_COMMISSION}
          title="Monthly Commission Trend"
          className="sm:col-span-2 lg:col-span-2"
          height={220}
          color="#f59e0b"
        />
        <DonutChart
          data={statusDonut}
          title="Payout Status"
          size={140}
          centerValue={rows.length}
          centerLabel="Transactions"
        />
      </div>

      {/* Commission by category */}
      <div className="overflow-hidden">
        <BarChart
          data={COMMISSION_BY_CATEGORY}
          title="Commission by Category"
          height={180}
        />
      </div>

      {/* Commission table — desktop */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft sm:block">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-bold text-navy-800">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Txn ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Order Amount</th>
                <th className="px-4 py-3">Commission</th>
                <th className="px-4 py-3">Payout</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-semibold text-navy-800">{r.id}</td>
                  <td className="px-4 py-3 text-slate-500">{r.date}</td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-slate-600" title={r.product}>{r.product}</td>
                  <td className="px-4 py-3 text-slate-600">₹{r.amount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="font-medium">₹{r.commission.toLocaleString('en-IN')}</span>
                    <span className="ml-1 text-[11px] text-slate-400">({r.commissionPct}%)</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-navy-800">₹{r.payout.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${r.status === 'Paid' ? 'bg-accent-50 text-accent-600' : 'bg-amber-50 text-amber-600'}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commission table — mobile cards */}
      <div className="space-y-3 sm:hidden">
        <h3 className="text-sm font-bold text-navy-800">Transaction History</h3>
        {rows.map((r) => (
          <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-bold text-navy-800">{r.id}</p>
                <p className="truncate text-xs text-slate-500">{r.product}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${r.status === 'Paid' ? 'bg-accent-50 text-accent-600' : 'bg-amber-50 text-amber-600'}`}>
                {r.status}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-slate-400">Order:</span> <span className="font-medium text-navy-800">₹{r.amount.toLocaleString('en-IN')}</span></div>
              <div><span className="text-slate-400">Commission:</span> <span className="text-slate-600">₹{r.commission.toLocaleString('en-IN')} ({r.commissionPct}%)</span></div>
              <div><span className="text-slate-400">Payout:</span> <span className="font-semibold text-accent-600">₹{r.payout.toLocaleString('en-IN')}</span></div>
              <div><span className="text-slate-400">Date:</span> <span className="text-slate-600">{r.date}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
