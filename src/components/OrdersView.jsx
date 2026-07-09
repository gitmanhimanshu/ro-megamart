import { useState } from 'react'
import {
  ArrowLeft, Package, ChevronDown, MapPin, Wallet, ShoppingBag,
  CheckCircle2, Truck, Clock, FileDown,
} from 'lucide-react'

const rupee = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const STATUS_META = {
  Placed: { cls: 'bg-aqua-50 text-aqua-700', icon: Clock },
  Shipped: { cls: 'bg-amber-50 text-amber-600', icon: Truck },
  Delivered: { cls: 'bg-accent-50 text-accent-600', icon: CheckCircle2 },
}

// Opens a print-ready invoice in a new tab (buyer can save as PDF via the
// browser's print dialog). Built from the order's real items/address/total.
function downloadInvoice(order) {
  const rows = order.items.map((item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${item.enquiryOnly ? '—' : `₹${item.price.toLocaleString('en-IN')}`}</td>
      <td style="text-align:right;font-weight:600">${item.enquiryOnly ? '—' : `₹${(item.price * item.qty).toLocaleString('en-IN')}`}</td>
    </tr>`).join('')

  const html = `
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
          <p>India's #1 B2B Marketplace for the RO Industry</p>
          <p>support@romegamart.com | 1800-889-8529</p>
        </div>
        <div class="invoice-title">
          <h2>INVOICE</h2>
          <p><strong>${order.id}</strong></p>
          <p>Date: ${new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
      </div>
      <div class="section">
        <h3>Bill To</h3>
        <div class="grid">
          <span>Name</span><span>${order.address?.name || ''}</span>
          <span>Phone</span><span>${order.address?.phone || ''}</span>
          <span>Address</span><span>${order.address?.line1 || ''}, ${order.address?.city || ''}, ${order.address?.state || ''} ${order.address?.pincode || ''}</span>
          ${order.address?.gst ? `<span>GST Number</span><span>${order.address.gst}</span>` : ''}
        </div>
      </div>
      <div class="section">
        <h3>Order Items</h3>
        <table>
          <thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th style="text-align:right">Amount</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="section">
        <div class="total-row"><span>Subtotal</span><span>₹${order.subtotal.toLocaleString('en-IN')}</span></div>
        <div class="total-row"><span>Shipping</span><span>Free</span></div>
        <div class="total-row grand"><span>Total Paid</span><span style="color:#031273">₹${order.total.toLocaleString('en-IN')}</span></div>
      </div>
      <div class="section">
        <h3>Payment Details</h3>
        <div class="grid">
          <span>Payment Method</span><span style="text-transform:capitalize">${order.payment}</span>
          <span>Order Status</span><span>${order.status}</span>
        </div>
      </div>
      <div class="footer">
        <p>Thank you for shopping on Romegamart!</p>
        <p>This is a system-generated invoice. For queries, contact support@romegamart.com</p>
      </div>
    </body></html>`

  const w = window.open('', '_blank', 'width=800,height=600')
  w.document.write(html)
  w.document.close()
  w.print()
}

/**
 * OrdersView — buyer's "My Orders" page. Reads from the `orders` array
 * App.jsx persists to localStorage after a successful checkout.
 */
export default function OrdersView({ orders, onExit, onBrowse }) {
  const [expanded, setExpanded] = useState(null)

  return (
    <section className="mx-auto max-w-4xl px-4 py-6">
      <button onClick={onExit} className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-aqua-700 hover:text-aqua-800">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="flex items-center gap-2">
        <Package className="h-5 w-5 text-aqua-600" />
        <h1 className="text-xl font-bold text-navy-900 sm:text-2xl">My Orders</h1>
      </div>
      <p className="mt-1 text-sm text-slate-500">{orders.length} {orders.length === 1 ? 'order' : 'orders'} placed</p>

      {orders.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 py-12 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400">
            <ShoppingBag className="h-7 w-7" />
          </span>
          <p className="text-sm font-medium text-navy-800">No orders yet</p>
          <p className="max-w-xs text-xs text-slate-500">Once you place an order, it'll show up here with full tracking details.</p>
          <button onClick={onBrowse} className="mt-2 rounded-lg bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => {
            const isOpen = expanded === order.id
            const status = STATUS_META[order.status] || STATUS_META.Placed
            const StatusIcon = status.icon
            return (
              <div key={order.id} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left sm:p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {order.items.slice(0, 3).map((item) => (
                        <img key={item.key} src={item.image} alt="" className="h-12 w-12 rounded-lg border-2 border-white object-cover shadow-sm" />
                      ))}
                      {order.items.length > 3 && (
                        <span className="grid h-12 w-12 place-items-center rounded-lg border-2 border-white bg-slate-100 text-xs font-bold text-slate-500 shadow-sm">
                          +{order.items.length - 3}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy-800">{order.id}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}{order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${status.cls}`}>
                      <StatusIcon className="h-3 w-3" /> {order.status}
                    </span>
                    <span className="text-sm font-bold text-navy-900">{rupee(order.total)}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 p-4 sm:p-5">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.key} className="flex items-center gap-3">
                          <img src={item.image} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-navy-800">{item.name}</p>
                            <p className="text-xs text-slate-400">{item.enquiryOnly ? 'Enquiry' : `${rupee(item.price)} × ${item.qty}`}</p>
                          </div>
                          {!item.enquiryOnly && <span className="shrink-0 text-sm font-semibold text-navy-800">{rupee(item.price * item.qty)}</span>}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                      <div>
                        <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                          <MapPin className="h-3.5 w-3.5" /> Delivered To
                        </p>
                        <p className="text-sm text-slate-600">{order.address?.name} · {order.address?.line1}, {order.address?.city}, {order.address?.state} {order.address?.pincode}</p>
                      </div>
                      <div>
                        <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                          <Wallet className="h-3.5 w-3.5" /> Payment
                        </p>
                        <p className="text-sm capitalize text-slate-600">{order.payment}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                      <button
                        onClick={() => downloadInvoice(order)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-navy-700 transition-colors hover:border-aqua-300 hover:text-aqua-700"
                      >
                        <FileDown className="h-3.5 w-3.5" /> Download Invoice
                      </button>
                      <span className="text-sm font-bold text-navy-900">Total: {rupee(order.total)}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
