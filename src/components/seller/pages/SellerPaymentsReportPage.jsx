import { useMemo } from 'react'
import { CreditCard, TrendingUp, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { PRODUCT_INDEX } from '../../../data'
import { LineChart, BarChart, DonutChart, StatCard } from '../Charts'

const ALL_PRODUCTS = Object.values(PRODUCT_INDEX)
const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }

const MONTHLY_PAYMENTS = [
  { label: 'Jan', value: 38000 }, { label: 'Feb', value: 52000 }, { label: 'Mar', value: 35000 },
  { label: 'Apr', value: 64000 }, { label: 'May', value: 58000 }, { label: 'Jun', value: 78000 },
]

const PAYMENT_METHODS = [
  { label: 'UPI', value: 45, color: '#14a4e0' },
  { label: 'Bank Transfer', value: 28, color: '#1c2bb0' },
  { label: 'Cash on Delivery', value: 18, color: '#f59e0b' },
  { label: 'Wallet', value: 9, color: '#8cc63f' },
]

const WEEKLY_COLLECTION = [
  { label: 'Mon', value: 12000 }, { label: 'Tue', value: 18000 }, { label: 'Wed', value: 8000 },
  { label: 'Thu', value: 22000 }, { label: 'Fri', value: 15000 }, { label: 'Sat', value: 25000 }, { label: 'Sun', value: 11000 },
]

export default function SellerPaymentsReportPage() {
  const transactions = useMemo(() => ALL_PRODUCTS.slice(0, 15).filter((p) => p.price).map((p, i) => {
    const h = hash(p.key)
    const amount = p.price * (1 + (h % 10))
    const methods = ['UPI', 'Bank Transfer', 'COD', 'Wallet']
    return {
      id: `PAY${50012 + i}`,
      date: new Date(Date.now() - h % (1000 * 60 * 60 * 24 * 30)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      product: p.name,
      amount,
      method: methods[h % methods.length],
      status: h % 4 === 0 ? 'Pending' : 'Completed',
    }
  }), [])

  const totalCollected = transactions.filter((t) => t.status === 'Completed').reduce((s, t) => s + t.amount, 0)
  const pendingAmount = transactions.filter((t) => t.status === 'Pending').reduce((s, t) => s + t.amount, 0)

  const statusDonut = [
    { label: 'Completed', value: transactions.filter((t) => t.status === 'Completed').length, color: '#8cc63f' },
    { label: 'Pending', value: transactions.filter((t) => t.status === 'Pending').length, color: '#f59e0b' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-900 sm:text-2xl">Payments Report</h1>
        <p className="text-sm text-slate-500">Collection, pending payments and payment methods</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Collected" value={`₹${(totalCollected / 1000).toFixed(1)}K`} sub="Received" icon={ArrowUpRight} color="green" />
        <StatCard label="Pending" value={`₹${(pendingAmount / 1000).toFixed(1)}K`} sub="Awaiting" icon={ArrowDownRight} color="accent" />
        <StatCard label="Transactions" value={transactions.length} sub="Total payments" icon={CreditCard} color="aqua" />
        <StatCard label="Avg. Payment" value={`₹${Math.round(totalCollected / Math.max(transactions.filter((t) => t.status === 'Completed').length, 1)).toLocaleString('en-IN')}`} sub="Per transaction" icon={TrendingUp} color="navy" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <LineChart data={MONTHLY_PAYMENTS} title="Monthly Collections" height={200} color="#8cc63f" />
        <DonutChart data={PAYMENT_METHODS} title="Payment Methods" size={150} centerValue={`${transactions.length}`} centerLabel="Transactions" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <BarChart data={WEEKLY_COLLECTION} title="Weekly Collection" height={160} />
        <DonutChart data={statusDonut} title="Payment Status" size={130} centerValue={transactions.length} centerLabel="Total" />
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft sm:p-5">
        <h3 className="mb-4 text-sm font-bold text-navy-800">Recent Transactions</h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-2 pr-4">Txn ID</th>
                <th className="pb-2 pr-4">Date</th>
                <th className="pb-2 pr-4">Product</th>
                <th className="pb-2 pr-4">Method</th>
                <th className="pb-2 pr-4 text-right">Amount</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 8).map((t) => (
                <tr key={t.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-2.5 pr-4 font-semibold text-navy-800">{t.id}</td>
                  <td className="py-2.5 pr-4 text-slate-500">{t.date}</td>
                  <td className="max-w-[180px] truncate py-2.5 pr-4 text-slate-600">{t.product}</td>
                  <td className="py-2.5 pr-4">
                    <span className="inline-block whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{t.method}</span>
                  </td>
                  <td className="py-2.5 pr-4 text-right font-semibold text-navy-800">₹{t.amount.toLocaleString('en-IN')}</td>
                  <td className="py-2.5">
                    <span className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold ${t.status === 'Completed' ? 'bg-accent-50 text-accent-600' : 'bg-amber-50 text-amber-600'}`}>
                      {t.status}
                    </span>
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
