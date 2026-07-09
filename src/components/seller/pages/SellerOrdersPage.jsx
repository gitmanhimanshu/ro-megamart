import { useMemo, useState } from 'react'
import {
  Eye, Truck, CheckCircle2, Clock, Package, XCircle, Search,
  MapPin, Phone, CreditCard, CalendarDays, ChevronDown, Download,
  ArrowUpRight, PackageCheck, RotateCw, IndianRupee, User, FileText,
} from 'lucide-react'
import { PRODUCT_INDEX } from '../../../data'
import { DonutChart, BarChart, StatCard } from '../Charts'

const ALL_PRODUCTS = Object.values(PRODUCT_INDEX)
const BUYERS = [
  { name: 'Sharma Water Solutions', phone: '9876543210', city: 'Delhi' },
  { name: 'Aqua Fresh Traders', phone: '9123456789', city: 'Mumbai' },
  { name: 'Patel RO Care Center', phone: '9988776655', city: 'Ahmedabad' },
  { name: 'Indus Water Corp', phone: '9112233445', city: 'Pune' },
  { name: 'BlueDrop Distributors', phone: '9556677889', city: 'Jaipur' },
  { name: 'Raj Water Tech', phone: '9445566778', city: 'Lucknow' },
  { name: 'Neerav Aqua Services', phone: '9334455667', city: 'Hyderabad' },
]
const STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
const STATUS_CLS = {
  Pending: 'bg-amber-50 text-amber-600 border border-amber-200',
  Confirmed: 'bg-navy-50 text-navy-600 border border-navy-200',
  Processing: 'bg-aqua-50 text-aqua-700 border border-aqua-200',
  Shipped: 'bg-aqua-50 text-aqua-600 border border-aqua-200',
  Delivered: 'bg-accent-50 text-accent-600 border border-accent-200',
  Cancelled: 'bg-red-50 text-red-500 border border-red-200',
}
const STATUS_ICON = {
  Pending: Clock,
  Confirmed: CheckCircle2,
  Processing: Package,
  Shipped: Truck,
  Delivered: PackageCheck,
  Cancelled: XCircle,
}
const PAYMENT_METHODS = ['UPI', 'Net Banking', 'COD', 'Wallet', 'Credit Card']
const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }

const WEEKLY_ORDERS = [
  { label: 'Mon', value: 6 }, { label: 'Tue', value: 9 }, { label: 'Wed', value: 4 },
  { label: 'Thu', value: 12 }, { label: 'Fri', value: 8 }, { label: 'Sat', value: 14 }, { label: 'Sun', value: 7 },
]

export default function SellerOrdersPage({ onToast }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [detailOrder, setDetailOrder] = useState(null)
  const [orders, setOrders] = useState(() =>
    ALL_PRODUCTS.slice(0, 24).map((p, i) => {
      const h = hash(p.key)
      const buyer = BUYERS[h % BUYERS.length]
      const status = STATUSES[h % STATUSES.length]
      return {
        id: `RMG${10234 + i}`,
        product: p.name,
        productImage: p.image,
        buyer,
        qty: 1 + (h % 20),
        unitPrice: p.price || 250,
        amount: (p.price || 250) * (1 + (h % 20)),
        status,
        paymentMethod: PAYMENT_METHODS[h % PAYMENT_METHODS.length],
        paymentStatus: status === 'Delivered' ? 'Paid' : status === 'Cancelled' ? 'Refunded' : h % 3 === 0 ? 'Paid' : 'Pending',
        date: new Date(Date.now() - (h % (1000 * 60 * 60 * 24 * 30))),
        address: `${12 + (h % 200)}, ${['MG Road', 'Station Road', 'Nehru Nagar', 'Gandhi Marg', 'Patel Colony'][h % 5]}, ${buyer.city}`,
        notes: h % 4 === 0 ? 'Please deliver before evening' : '',
      }
    })
  )

  const filtered = useMemo(() => {
    let result = filter === 'all' ? orders : orders.filter((o) => o.status === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((o) =>
        o.id.toLowerCase().includes(q) || o.buyer.name.toLowerCase().includes(q) || o.product.toLowerCase().includes(q)
      )
    }
    return result
  }, [orders, filter, search])

  const statusCounts = useMemo(() => {
    const counts = {}
    STATUSES.forEach((s) => { counts[s] = orders.filter((o) => o.status === s).length })
    return counts
  }, [orders])

  const donutData = [
    { label: 'Delivered', value: statusCounts.Delivered || 0, color: '#8cc63f' },
    { label: 'Shipped', value: statusCounts.Shipped || 0, color: '#38baec' },
    { label: 'Processing', value: statusCounts.Processing || 0, color: '#14a4e0' },
    { label: 'Confirmed', value: statusCounts.Confirmed || 0, color: '#1c2bb0' },
    { label: 'Pending', value: statusCounts.Pending || 0, color: '#f59e0b' },
    { label: 'Cancelled', value: statusCounts.Cancelled || 0, color: '#ef4444' },
  ]

  const totalRevenue = orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.amount, 0)
  const pendingRevenue = orders.filter((o) => o.paymentStatus === 'Pending').reduce((s, o) => s + o.amount, 0)

  const updateStatus = (orderId, newStatus) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o))
    setDetailOrder((prev) => prev?.id === orderId ? { ...prev, status: newStatus } : prev)
    onToast?.(`Order ${orderId} updated to ${newStatus}`)
  }

  const exportCsv = () => {
    const headers = ['Order ID', 'Product', 'Buyer', 'City', 'Date', 'Qty', 'Amount', 'Payment', 'Status']
    const rows = filtered.map((o) => [
      o.id, o.product, o.buyer.name, o.buyer.city, formatDate(o.date),
      o.qty, o.amount, o.paymentMethod, o.status,
    ])
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    onToast?.('CSV exported successfully')
  }

  const formatDate = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  const formatDateTime = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const downloadInvoice = (order) => {
    const commission = Math.round(order.amount * 0.02)
    const netAmount = order.amount - commission
    const invoiceHtml = `
      <!DOCTYPE html>
      <html><head><meta charset="utf-8"><title>Invoice ${order.id}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a2e; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #14a4e0; padding-bottom: 20px; margin-bottom: 20px; }
        .brand h1 { font-size: 24px; color: #031273; }
        .brand p { color: #64748b; font-size: 12px; margin-top: 4px; }
        .invoice-title { text-align: right; }
        .invoice-title h2 { font-size: 28px; color: #14a4e0; }
        .invoice-title p { font-size: 12px; color: #64748b; margin-top: 4px; }
        .section { margin-bottom: 20px; }
        .section h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 13px; }
        .grid span:first-child { color: #64748b; }
        .grid span:last-child { font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
        th { background: #f1f5f9; text-align: left; padding: 8px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; }
        td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; }
        .total-row.grand { border-top: 2px solid #14a4e0; padding-top: 10px; font-size: 16px; font-weight: 700; }
        .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        @media print { body { padding: 20px; } }
      </style></head><body>
        <div class="header">
          <div class="brand">
            <h1>ROME<span style="color:#14a4e0">GAMART</span></h1>
            <p>India's #1 B2B RO Industry Platform</p>
            <p>support@romegamart.com | 1800-889-8529</p>
          </div>
          <div class="invoice-title">
            <h2>INVOICE</h2>
            <p><strong>${order.id}</strong></p>
            <p>Date: ${formatDate(order.date)}</p>
          </div>
        </div>
        <div class="section">
          <h3>Bill To</h3>
          <div class="grid">
            <span>Buyer Name</span><span>${order.buyer.name}</span>
            <span>Phone</span><span>${order.buyer.phone}</span>
            <span>City</span><span>${order.buyer.city}</span>
            <span>Address</span><span>${order.address}</span>
          </div>
        </div>
        <div class="section">
          <h3>Order Items</h3>
          <table>
            <thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th style="text-align:right">Amount</th></tr></thead>
            <tbody><tr>
              <td>${order.product}</td>
              <td>${order.qty}</td>
              <td>₹${order.unitPrice.toLocaleString('en-IN')}</td>
              <td style="text-align:right;font-weight:600">₹${order.amount.toLocaleString('en-IN')}</td>
            </tr></tbody>
          </table>
        </div>
        <div class="section">
          <div class="total-row"><span>Subtotal</span><span>₹${order.amount.toLocaleString('en-IN')}</span></div>
          <div class="total-row"><span>Platform Commission (2%)</span><span>-₹${commission.toLocaleString('en-IN')}</span></div>
          <div class="total-row grand"><span>Net Payable to Seller</span><span style="color:#8cc63f">₹${netAmount.toLocaleString('en-IN')}</span></div>
        </div>
        <div class="section">
          <h3>Payment Details</h3>
          <div class="grid">
            <span>Payment Method</span><span>${order.paymentMethod}</span>
            <span>Payment Status</span><span>${order.paymentStatus}</span>
            <span>Order Status</span><span>${order.status}</span>
          </div>
        </div>
        <div class="footer">
          <p>Thank you for doing business on Romegamart!</p>
          <p>This is a system-generated invoice. For queries, contact support@romegamart.com</p>
        </div>
      </body></html>`
    const w = window.open('', '_blank', 'width=800,height=600')
    w.document.write(invoiceHtml)
    w.document.close()
    w.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Orders</h1>
          <p className="text-sm text-slate-500">Manage and fulfil orders from buyers</p>
        </div>
        <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:bg-slate-50">
          <Download className="h-3.5 w-3.5" strokeWidth={1.5} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Orders" value={orders.length} sub="All time" icon={Package} color="aqua" />
        <StatCard label="Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} sub="Excl. cancelled" icon={IndianRupee} color="green" trend={12} />
        <StatCard label="Pending" value={statusCounts.Pending || 0} sub="Need action" icon={Clock} color="accent" />
        <StatCard label="Pending Payment" value={`₹${pendingRevenue.toLocaleString('en-IN')}`} sub="Awaiting" icon={CreditCard} color="purple" />
      </div>

      {/* Donut + Weekly bar */}
      <div className="grid gap-5 lg:grid-cols-2">
        <DonutChart
          data={donutData}
          title="Order Status"
          size={150}
          centerValue={orders.length}
          centerLabel="Total"
        />
        <BarChart data={WEEKLY_ORDERS} title="This Week" height={160} />
      </div>

      {/* Search + Filter tabs */}
      <div className="space-y-3">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" strokeWidth={1.5} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, buyer, product..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-aqua-400 focus:ring-2 focus:ring-aqua-100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[{ s: 'all', label: 'All', count: orders.length }, ...STATUSES.map((s) => ({ s, label: s, count: statusCounts[s] || 0 }))].map(({ s, label, count }) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === s ? 'border-aqua-400 bg-aqua-50 text-aqua-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
              }`}
            >
              {label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${filter === s ? 'bg-aqua-100 text-aqua-700' : 'bg-slate-100 text-slate-500'}`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-400">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : filtered.map((o) => {
                const StatusIcon = STATUS_ICON[o.status]
                return (
                  <tr key={o.id} className="border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-semibold text-navy-800">{o.id}</td>
                    <td className="max-w-[180px] px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={o.productImage} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover ring-1 ring-slate-100" />
                        <span className="truncate text-slate-600" title={o.product}>{o.product}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-navy-800">{o.buyer.name}</p>
                        <p className="text-[11px] text-slate-400">{o.buyer.city}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(o.date)}</td>
                    <td className="px-4 py-3 text-slate-600">{o.qty}</td>
                    <td className="px-4 py-3 font-semibold text-navy-800">₹{o.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        o.paymentStatus === 'Paid' ? 'bg-accent-50 text-accent-600' : o.paymentStatus === 'Refunded' ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_CLS[o.status]}`}>
                        <StatusIcon className="h-3 w-3" />
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setDetailOrder(o)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-aqua-50 hover:text-aqua-600">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
            No orders found.
          </div>
        ) : filtered.map((o) => {
          const StatusIcon = STATUS_ICON[o.status]
          return (
            <div key={o.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={o.productImage} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-slate-100" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-navy-800">{o.id}</p>
                    <p className="truncate text-xs text-slate-500">{o.product}</p>
                  </div>
                </div>
                <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_CLS[o.status]}`}>
                  <StatusIcon className="h-3 w-3" /> {o.status}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-400">Buyer:</span> <span className="font-medium text-navy-800">{o.buyer.name}</span></div>
                <div><span className="text-slate-400">Date:</span> <span className="text-slate-600">{formatDate(o.date)}</span></div>
                <div><span className="text-slate-400">Qty:</span> <span className="text-slate-600">{o.qty}</span></div>
                <div><span className="text-slate-400">Amount:</span> <span className="font-semibold text-navy-800">₹{o.amount.toLocaleString('en-IN')}</span></div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  o.paymentStatus === 'Paid' ? 'bg-accent-50 text-accent-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {o.paymentStatus}
                </span>
                <button onClick={() => setDetailOrder(o)} className="inline-flex items-center gap-1 text-xs font-semibold text-aqua-600">
                  View Details <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Order Detail Modal */}
      {detailOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-900/50 backdrop-blur-sm" onClick={() => setDetailOrder(null)} />
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-navy-900">Order {detailOrder.id}</h2>
                <p className="text-xs text-slate-400">Placed on {formatDateTime(detailOrder.date)}</p>
              </div>
              <button onClick={() => setDetailOrder(null)} className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <XCircle className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* Status Update */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.filter((s) => s !== detailOrder.status).map((s) => {
                    const Icon = STATUS_ICON[s]
                    return (
                      <button
                        key={s}
                        onClick={() => updateStatus(detailOrder.id, s)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-white ${STATUS_CLS[s]}`}
                      >
                        <Icon className="h-3 w-3" /> {s}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Product */}
              <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
                <img src={detailOrder.productImage} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-slate-100" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-800">{detailOrder.product}</p>
                  <p className="text-xs text-slate-400">Qty: {detailOrder.qty} × ₹{detailOrder.unitPrice.toLocaleString('en-IN')}</p>
                  <p className="mt-1 text-sm font-bold text-navy-900">₹{detailOrder.amount.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Buyer Details</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2"><User className="h-4 w-4 text-slate-400" /> <span className="font-medium text-navy-800">{detailOrder.buyer.name}</span></div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" /> <span className="text-slate-600">{detailOrder.buyer.phone}</span></div>
                  <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" /> <span className="text-slate-600">{detailOrder.address}</span></div>
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Payment Info</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-400">Method</p>
                    <p className="font-medium text-navy-800">{detailOrder.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Status</p>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      detailOrder.paymentStatus === 'Paid' ? 'bg-accent-50 text-accent-600' : detailOrder.paymentStatus === 'Refunded' ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {detailOrder.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-400">Subtotal</p>
                    <p className="text-navy-800">₹{detailOrder.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Commission (2%)</p>
                    <p className="text-navy-800">₹{Math.round(detailOrder.amount * 0.02).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-sm font-bold text-navy-900">You Receive</span>
                  <span className="text-sm font-bold text-accent-600">₹{Math.round(detailOrder.amount * 0.98).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {detailOrder.notes && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Buyer Note</p>
                  <p className="mt-1 text-sm text-amber-800">{detailOrder.notes}</p>
                </div>
              )}

              {/* Download Invoice */}
              <button
                onClick={() => downloadInvoice(detailOrder)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-aqua-300 bg-aqua-50/50 px-4 py-3 text-sm font-semibold text-aqua-700 transition-colors hover:bg-aqua-50 hover:border-aqua-400"
              >
                <FileText className="h-3.5 w-3.5" strokeWidth={1.5} /> Download Invoice PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
