import { useState } from 'react'
import {
  ArrowLeft, MapPin, CreditCard, ClipboardCheck, CheckCircle2, ShoppingBag,
  Smartphone, Wallet, Landmark, Banknote, ChevronRight, ShoppingCart, FileText,
} from 'lucide-react'

const rupee = (n) => `₹${Number(n).toLocaleString('en-IN')}`
const inputCls =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-navy-900 placeholder:text-slate-400 transition-colors focus:border-aqua-400 focus:bg-white'
const labelCls = 'mb-1 block text-xs font-semibold text-slate-500'

const STEPS = [
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'review', label: 'Review', icon: ClipboardCheck },
]

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', sub: 'Google Pay, PhonePe, Paytm', icon: Smartphone },
  { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'netbanking', label: 'Net Banking', sub: 'All major banks', icon: Landmark },
  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when you receive', icon: Banknote },
]

/**
 * CheckoutView — full B2B checkout flow: Address → Payment → Review →
 * Confirmation. UI only (no real payment gateway) — placeOrder() in App.jsx
 * builds the order record and saves it to order history.
 */
export default function CheckoutView({ cart, user, onPlaceOrder, onExit, onViewOrders, onToast }) {
  const [step, setStep] = useState('address')
  const [placedOrder, setPlacedOrder] = useState(null)
  const [address, setAddress] = useState({
    name: user?.name || '', phone: (user?.contact || '').replace(/\D/g, '').slice(-10),
    line1: '', city: '', state: '', pincode: '', gst: '',
  })
  const [payment, setPayment] = useState('upi')

  const subtotal = cart.reduce((s, i) => s + (i.enquiryOnly ? 0 : i.price * i.qty), 0)
  const stepIndex = STEPS.findIndex((s) => s.id === step)

  // Nothing to check out — guide the buyer back to the shop instead of a blank page.
  if (!placedOrder && cart.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400">
          <ShoppingCart className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-xl font-bold text-navy-900">Your cart is empty</h1>
        <p className="mt-2 text-sm text-slate-500">Add some products before checking out.</p>
        <button onClick={onExit} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </button>
      </section>
    )
  }

  const submitAddress = (e) => {
    e.preventDefault()
    setStep('payment')
  }

  const confirmPayment = () => setStep('review')

  const placeOrder = () => {
    const order = onPlaceOrder({ address, payment })
    setPlacedOrder(order)
    onToast?.('🎉 Order placed successfully!')
  }

  const paymentMeta = PAYMENT_METHODS.find((p) => p.id === payment)

  // ── Confirmation screen ─────────────────────────────────────────────────
  if (placedOrder) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-12 text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-accent-50 text-accent-600">
          <CheckCircle2 className="h-10 w-10" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-navy-900">Order Placed!</h1>
        <p className="mt-2 text-sm text-slate-500">
          Thank you, {address.name.split(' ')[0] || 'buyer'}. Your order has been confirmed.
        </p>
        <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-soft">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Order ID</span>
            <span className="text-sm font-bold text-navy-800">{placedOrder.id}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-slate-500">Total Amount</span>
            <span className="text-lg font-bold text-navy-900">{rupee(placedOrder.total)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm text-slate-500">Payment Method</span>
            <span className="text-sm font-semibold text-navy-800">{paymentMeta?.label}</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm text-slate-500">Delivering to</span>
            <span className="max-w-[60%] truncate text-sm font-semibold text-navy-800">{address.city}, {address.state}</span>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button onClick={onViewOrders} className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">
            <FileText className="h-4 w-4" /> View My Orders
          </button>
          <button onClick={onExit} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-navy-700 hover:border-aqua-300 hover:text-aqua-700">
            <ShoppingBag className="h-4 w-4" /> Continue Shopping
          </button>
        </div>
      </section>
    )
  }

  // ── Address / Payment / Review steps ────────────────────────────────────
  return (
    <section className="mx-auto max-w-5xl px-4 py-6">
      <button onClick={onExit} className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-aqua-700 hover:text-aqua-800">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="text-xl font-bold text-navy-900 sm:text-2xl">Checkout</h1>

      {/* Step indicator */}
      <div className="mt-4 flex items-center">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const done = i < stepIndex
          const active = i === stepIndex
          return (
            <div key={s.id} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition-colors ${
                  done ? 'bg-accent-500 text-white' : active ? 'bg-navy-800 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                </span>
                <span className={`text-[11px] font-semibold ${active ? 'text-navy-800' : 'text-slate-400'}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-2 h-0.5 flex-1 rounded-full ${done ? 'bg-accent-500' : 'bg-slate-200'}`} />
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Step content */}
        <div className="lg:col-span-2">
          {step === 'address' && (
            <form onSubmit={submitAddress} className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
              <h2 className="text-base font-bold text-navy-800">Delivery Address</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className={labelCls}>Full Name</span>
                  <input required value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className={inputCls} />
                </label>
                <label className="block">
                  <span className={labelCls}>Phone Number</span>
                  <input required type="tel" inputMode="numeric" maxLength={10} value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} className={inputCls} />
                </label>
                <label className="block">
                  <span className={labelCls}>GST Number (optional)</span>
                  <input value={address.gst} onChange={(e) => setAddress({ ...address, gst: e.target.value.toUpperCase() })} placeholder="22AAAAA0000A1Z5" className={`${inputCls} font-mono`} />
                </label>
                <label className="block sm:col-span-2">
                  <span className={labelCls}>Address Line</span>
                  <input required value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} placeholder="Plot no., street, area" className={inputCls} />
                </label>
                <label className="block">
                  <span className={labelCls}>City</span>
                  <input required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className={inputCls} />
                </label>
                <label className="block">
                  <span className={labelCls}>State</span>
                  <input required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className={inputCls} />
                </label>
                <label className="block">
                  <span className={labelCls}>PIN Code</span>
                  <input required inputMode="numeric" maxLength={6} value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })} className={inputCls} />
                </label>
              </div>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-aqua-500 to-navy-800 px-4 py-3 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift sm:w-auto">
                Continue to Payment <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
              <h2 className="text-base font-bold text-navy-800">Payment Method</h2>
              <div className="space-y-2.5">
                {PAYMENT_METHODS.map((m) => {
                  const Icon = m.icon
                  const active = payment === m.id
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayment(m.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
                        active ? 'border-aqua-400 bg-aqua-50/60 ring-2 ring-aqua-100' : 'border-slate-200 hover:border-aqua-200'
                      }`}
                    >
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${active ? 'bg-aqua-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-navy-800">{m.label}</span>
                        <span className="block text-xs text-slate-400">{m.sub}</span>
                      </span>
                      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${active ? 'border-aqua-500' : 'border-slate-300'}`}>
                        {active && <span className="h-2.5 w-2.5 rounded-full bg-aqua-500" />}
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep('address')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-navy-700 hover:border-slate-300">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button type="button" onClick={confirmPayment} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-aqua-500 to-navy-800 px-4 py-3 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
                  Continue to Review <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-bold text-navy-800">Order Items ({cart.length})</h2>
                </div>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.key} className="flex items-center gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <img src={item.image} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-navy-800">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.enquiryOnly ? 'Enquiry' : `${rupee(item.price)} × ${item.qty}`}</p>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-navy-800">
                        {item.enquiryOnly ? '—' : rupee(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft">
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                    <MapPin className="h-3.5 w-3.5" /> Deliver To
                  </h3>
                  <p className="text-sm font-semibold text-navy-800">{address.name}</p>
                  <p className="text-xs text-slate-500">{address.line1}, {address.city}, {address.state} {address.pincode}</p>
                  <p className="text-xs text-slate-500">Phone: {address.phone}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft">
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                    <Wallet className="h-3.5 w-3.5" /> Payment
                  </h3>
                  <p className="text-sm font-semibold text-navy-800">{paymentMeta?.label}</p>
                  <p className="text-xs text-slate-500">{paymentMeta?.sub}</p>
                </div>
              </div>

              <button type="button" onClick={() => setStep('payment')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-aqua-700 hover:text-aqua-800">
                <ArrowLeft className="h-4 w-4" /> Edit payment method
              </button>
            </div>
          )}
        </div>

        {/* Order summary sidebar — only sticks on desktop where it shares a row with the steps */}
        <div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft lg:sticky lg:top-24">
            <h2 className="mb-3 text-sm font-bold text-navy-800">Order Summary</h2>
            <div className="space-y-2 border-b border-slate-100 pb-3 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Items ({cart.reduce((s, i) => s + i.qty, 0)})</span>
                <span className="font-semibold text-navy-800">{rupee(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="font-semibold text-accent-600">Free</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax</span>
                <span className="font-semibold text-navy-800">Included</span>
              </div>
            </div>
            <div className="flex items-baseline justify-between pt-3">
              <span className="text-sm font-semibold text-navy-800">Total</span>
              <span className="text-xl font-extrabold text-navy-900">{rupee(subtotal)}</span>
            </div>
            {step === 'review' ? (
              <button onClick={placeOrder} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-aqua-500 to-navy-800 px-4 py-3 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
                <CheckCircle2 className="h-4 w-4" /> Place Order
              </button>
            ) : (
              <p className="mt-4 text-center text-xs text-slate-400">Complete all steps to place your order.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
