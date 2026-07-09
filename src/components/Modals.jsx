import { useState, useEffect } from 'react'
import {
  Heart, ShoppingCart, Zap, Store, Truck, PackageCheck, Trash2,
  Minus, Plus, MessageSquare, CheckCircle2, ShoppingBag, Factory, ArrowRight,
  Smartphone, ArrowLeft, ShieldCheck, RotateCw,
} from 'lucide-react'
import Modal from './Modal'
import { sendGlobalMessage } from '../lib/globalSend'

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-navy-900 placeholder:text-slate-400 transition-colors focus:border-aqua-400 focus:bg-white'
const primaryBtn =
  'inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy-800 px-4 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-navy-700'
const accentBtn =
  'inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-aqua-500 to-navy-800 px-4 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift'

const rupee = (n) => `Rs.${Number(n).toLocaleString('en-IN')}`

// Demo accounts: seller=7080159181, buyer=9648676532
const SELLER_PHONE = '7080159181'
const BUYER_PHONE = '9648676532'

/**
 * AuthModal — Mobile OTP only flow:
 *   mobile  → phone + name (register) or just phone (login)
 *   otp     → 6-digit code
 *   role    → only shown during registration
 */
export function AuthModal({ open, onClose, onLogin }) {
  const [step, setStep] = useState('mobile') // mobile | otp | role
  const [isRegister, setIsRegister] = useState(false)
  const [pendingName, setPendingName] = useState('')
  const [pendingContact, setPendingContact] = useState('')
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [resendIn, setResendIn] = useState(0)
  const [welcomeMsg, setWelcomeMsg] = useState('Logged in successfully')

  useEffect(() => {
    if (resendIn <= 0) return
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendIn])

  const reset = () => {
    setStep('mobile'); setIsRegister(false); setPendingName(''); setPendingContact('')
    setOtp(''); setOtpError(''); setResendIn(0)
  }
  const close = () => { reset(); onClose() }

  const submitMobile = (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const phone = data.get('phone')
    const name = data.get('fullname') || ''
    setPendingName(name)
    setPendingContact(phone)
    setOtp('')
    setOtpError('')
    setResendIn(30)
    setStep('otp')
  }

  const verifyOtp = (e) => {
    e.preventDefault()
    if (otp.trim().length === 0) {
      setOtpError('Enter the code sent to your phone.')
      return
    }

    const phone = pendingContact

    // Demo accounts — auto-assign role based on phone number
    if (phone === SELLER_PHONE) {
      onLogin({ name: pendingName || 'Seller', role: 'seller', contact: phone }, 'Seller account logged in')
      reset()
      return
    }
    if (phone === BUYER_PHONE) {
      onLogin({ name: pendingName || 'Buyer', role: 'buyer', contact: phone }, 'Logged in successfully')
      reset()
      return
    }

    // New number — if registering, ask role; if not found, treat as buyer
    if (isRegister) {
      setStep('role')
    } else {
      // Unknown number on login — treat as buyer
      onLogin({ name: pendingName || 'Buyer', role: 'buyer', contact: phone }, 'Logged in successfully')
      reset()
    }
  }

  const pickRole = (role) => {
    onLogin({ name: pendingName || 'User', role, contact: pendingContact }, welcomeMsg)
    reset()
  }

  return (
    <Modal open={open} onClose={close} title={step === 'otp' ? 'Verify OTP' : step === 'role' ? 'Choose Account Type' : 'Sign in to Romegamart'}>
      {step !== 'mobile' && (
        <button
          onClick={() => setStep('mobile')}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-800"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} /> Back
        </button>
      )}

      {/* ── Step: mobile number ───────────────────────────────────────── */}
      {step === 'mobile' && (
        <div className="space-y-4">
          {/* Login / Register toggle */}
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setIsRegister(false)}
              className={`rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                !isRegister ? 'bg-white text-navy-800 shadow-soft' : 'text-slate-500'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                isRegister ? 'bg-white text-navy-800 shadow-soft' : 'text-slate-500'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={submitMobile} className="space-y-3">
            {isRegister && (
              <input name="fullname" placeholder="Full name" className={inputCls} required />
            )}
            <div className="flex gap-2">
              <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500">+91</span>
              <input
                name="phone" type="tel" inputMode="numeric" maxLength={10}
                placeholder="10-digit mobile number" required
                pattern="[0-9]{10}" className={inputCls}
              />
            </div>
            <button type="submit" className={primaryBtn}>
              <Smartphone className="h-3.5 w-3.5" strokeWidth={1.5} /> {isRegister ? 'Register & Send OTP' : 'Send OTP'}
            </button>
          </form>

          <div className="rounded-xl bg-aqua-50 p-3 text-center">
            <p className="text-[11px] font-medium text-aqua-700">
              Demo: Seller — <strong>7080159181</strong> | Buyer — <strong>9648676532</strong>
            </p>
            <p className="text-[10px] text-aqua-600/70">Any OTP code works</p>
          </div>
        </div>
      )}

      {/* ── Step: OTP verification ────────────────────────────────────── */}
      {step === 'otp' && (
        <form onSubmit={verifyOtp} className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl bg-aqua-50 p-3 text-sm text-navy-700">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-aqua-600" strokeWidth={1.5} />
            <span>
              Enter the code sent to <strong>+91 {pendingContact || '••••••••••'}</strong>.
              <br />
              <span className="text-xs text-slate-500">Demo: any code works — type any digits.</span>
            </span>
          </div>
          <input
            value={otp}
            onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setOtpError('') }}
            inputMode="numeric"
            placeholder="• • • • • •"
            className={`${inputCls} text-center text-2xl font-bold tracking-[0.5em]`}
            autoFocus
          />
          {otpError && <p className="text-xs font-medium text-red-500">{otpError}</p>}
          <button type="submit" className={primaryBtn}>
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} /> Verify &amp; Continue
          </button>
          <button
            type="button"
            disabled={resendIn > 0}
            onClick={() => setResendIn(30)}
            className="inline-flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-aqua-700 transition-colors hover:text-aqua-800 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            <RotateCw className="h-3 w-3" strokeWidth={1.5} />
            {resendIn > 0 ? `Resend OTP in ${resendIn}s` : 'Resend OTP'}
          </button>
        </form>
      )}

      {/* ── Step: choose role (only for new registrations) ─────────────── */}
      {step === 'role' && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">
            Hi {pendingName || 'there'}! How would you like to use Romegamart?
          </p>
          <button
            onClick={() => pickRole('buyer')}
            className="group flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-aqua-300 hover:shadow-lift"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-aqua-50 text-aqua-600 group-hover:bg-aqua-500 group-hover:text-white">
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-bold text-navy-800">Buyer</span>
              <span className="block text-xs text-slate-500">Browse, enquire & purchase RO products at wholesale prices</span>
            </span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-aqua-600" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => pickRole('seller')}
            className="group flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-lift"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700 group-hover:bg-navy-800 group-hover:text-white">
              <Factory className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-bold text-navy-800">Seller</span>
              <span className="block text-xs text-slate-500">List products, manage orders & grow your RO business</span>
            </span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-navy-700" strokeWidth={1.5} />
          </button>
        </div>
      )}
    </Modal>
  )
}

export function SellerModal({ open, onClose, onDone }) {
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    setSubmitting(true)

    try {
      await sendGlobalMessage({
        source: 'seller-onboarding',
        businessName: formData.get('businessName'),
        workEmail: formData.get('workEmail'),
        gstNumber: formData.get('gstNumber'),
        phone: formData.get('phone'),
      })
    } catch (error) {
      setSubmitting(false)
      onDone(error.message || 'We could not send your seller request right now.')
      return
    }

    setSubmitting(false)
    onDone('Thanks! Our team will reach out about seller onboarding.')
  }

  return (
    <Modal open={open} onClose={onClose} title="Sell on Romegamart">
      <div className="mb-4 flex items-center gap-3 rounded-xl bg-aqua-50 p-3 text-sm text-navy-700">
        <Store className="h-4 w-4 shrink-0 text-aqua-600" strokeWidth={1.5} />
        List your RO products at <strong>zero listing fee</strong> and reach 2000+ verified buyers.
      </div>
      <form onSubmit={submit} className="space-y-3">
        <input name="businessName" placeholder="Business / firm name" className={inputCls} required />
        <input name="workEmail" type="email" placeholder="Work email" className={inputCls} required />
        <input name="gstNumber" placeholder="GST number" className={inputCls} />
        <input name="phone" type="tel" placeholder="Mobile number" className={inputCls} required />
        <button type="submit" disabled={submitting} className={`${accentBtn} disabled:cursor-not-allowed disabled:opacity-70`}>
          <Store className="h-3.5 w-3.5" strokeWidth={1.5} /> {submitting ? 'Sending...' : 'Start selling'}
        </button>
      </form>
    </Modal>
  )
}

export function TrackModal({ open, onClose }) {
  const [status, setStatus] = useState(null)
  const steps = ['Order Confirmed', 'Packed', 'Shipped', 'Out for Delivery']
  const submit = (e) => {
    e.preventDefault()
    setStatus({ id: new FormData(e.target).get('oid') || 'ROM12345', stage: 2 })
  }
  const close = () => {
    setStatus(null)
    onClose()
  }
  return (
    <Modal open={open} onClose={close} title="Track Your Order">
      <form onSubmit={submit} className="flex gap-2">
        <input name="oid" placeholder="Enter order ID (e.g. ROM12345)" className={inputCls} required />
        <button type="submit" className="shrink-0 rounded-lg bg-navy-800 px-4 text-sm font-semibold text-white transition-colors hover:bg-navy-700">
          Track
        </button>
      </form>

      {status && (
        <div className="mt-6">
          <p className="text-sm text-slate-500">
            Order <span className="font-semibold text-navy-800">#{status.id}</span> - estimated delivery in 3 days
          </p>
          <ol className="mt-4 space-y-4">
            {steps.map((s, i) => {
              const done = i <= status.stage
              return (
                <li key={s} className="flex items-center gap-3">
                  <span className={`grid h-7 w-7 place-items-center rounded-full ${done ? 'bg-accent-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    {done ? <CheckCircle2 className="h-3 w-3" strokeWidth={1.5} /> : <Truck className="h-3 w-3" strokeWidth={1.5} />}
                  </span>
                  <span className={`text-sm ${done ? 'font-semibold text-navy-800' : 'text-slate-400'}`}>{s}</span>
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </Modal>
  )
}

export function ProductModal({ product, onClose, onAddToCart, onBuyNow, wished, onToggleWish }) {
  const [qty, setQty] = useState(1)
  if (!product) return null
  const { name, seller, price, image, enquiryOnly, catName } = product

  return (
    <Modal open={!!product} onClose={onClose} title="Product Details" maxWidth="max-w-3xl">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl bg-slate-100">
          <img src={image} alt={name} className="aspect-[4/3] w-full object-cover" />
          <span className="absolute left-3 top-3 rounded-full bg-navy-800/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            {catName}
          </span>
        </div>

        <div className="flex flex-col">
          <h3 className="text-lg font-bold leading-snug text-navy-800">{name}</h3>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-slate-500">
            <Store className="h-3.5 w-3.5 text-aqua-500" strokeWidth={1.5} /> {seller}
          </p>

          <div className="mt-4">
            {enquiryOnly ? (
              <span className="text-lg font-bold text-aqua-700">Price on request</span>
            ) : (
              <span className="text-2xl font-bold text-navy-800">{rupee(price)}</span>
            )}
          </div>

          {!enquiryOnly && (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500">Qty</span>
              <div className="inline-flex items-center rounded-full border border-slate-200">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="grid h-9 w-9 place-items-center text-slate-600 hover:text-navy-800">
                  <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-navy-800">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity" className="grid h-9 w-9 place-items-center text-slate-600 hover:text-navy-800">
                  <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          )}

          <div className="mt-auto space-y-2 pt-5">
            {enquiryOnly ? (
              <button onClick={() => onBuyNow(product, qty)} className={accentBtn}>
                <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.5} /> Send Enquiry
              </button>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row">
                <button onClick={() => onAddToCart(product, qty)} className={`${primaryBtn} sm:flex-1`}>
                  <ShoppingCart className="h-3.5 w-3.5" strokeWidth={1.5} /> Add to Cart
                </button>
                <button onClick={() => onBuyNow(product, qty)} className={`${accentBtn} sm:flex-1`}>
                  <Zap className="h-3.5 w-3.5" strokeWidth={1.5} /> Buy Now
                </button>
              </div>
            )}
            <button
              onClick={() => onToggleWish(product.key)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:border-accent-400 hover:text-accent-600"
            >
              <Heart className={`h-3.5 w-3.5 ${wished ? 'fill-accent-500 text-accent-500' : ''}`} strokeWidth={1.5} />
              {wished ? 'In your wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export function CartModal({ open, onClose, cart, onRemove, onUpdateQty, onCheckout }) {
  const total = cart.reduce((sum, i) => sum + (i.enquiryOnly ? 0 : i.price * i.qty), 0)
  return (
    <Modal open={open} onClose={onClose} title={`Your Cart (${cart.length})`}>
      {cart.length === 0 ? (
        <EmptyState icon={ShoppingCart} text="Your cart is empty. Add some products to get started." />
      ) : (
        <>
          <ul className="space-y-3">
            {cart.map((item) => (
              <li key={item.key} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5">
                <img src={item.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-800">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {item.enquiryOnly ? 'Enquiry' : `${rupee(item.price)} each`}
                  </p>
                  {!item.enquiryOnly && (
                    <div className="mt-1.5 inline-flex items-center rounded-full border border-slate-200">
                      <button
                        onClick={() => item.qty > 1 && onUpdateQty(item.key, item.qty - 1)}
                        disabled={item.qty <= 1}
                        aria-label="Decrease quantity"
                        className="grid h-7 w-7 place-items-center text-slate-600 hover:text-navy-800 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:text-slate-300"
                      >
                        <Minus className="h-3 w-3" strokeWidth={1.5} />
                      </button>
                      <span className="w-7 text-center text-xs font-semibold text-navy-800">{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.key, item.qty + 1)} aria-label="Increase quantity" className="grid h-7 w-7 place-items-center text-slate-600 hover:text-navy-800">
                        <Plus className="h-3 w-3" strokeWidth={1.5} />
                      </button>
                    </div>
                  )}
                </div>
                <button onClick={() => onRemove(item.key)} aria-label="Remove item" className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500">
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-sm text-slate-500">Subtotal</span>
            <span className="text-lg font-bold text-navy-800">{rupee(total)}</span>
          </div>
          <button onClick={onCheckout} className={`mt-4 ${accentBtn}`}>
            <PackageCheck className="h-3.5 w-3.5" strokeWidth={1.5} /> Checkout
          </button>
        </>
      )}
    </Modal>
  )
}

export function WishlistModal({ open, onClose, items, onRemove, onMoveToCart, isLoggedIn = false }) {
  return (
    <Modal open={open} onClose={onClose} title={`Wishlist (${items.length})`}>
      {items.length === 0 ? (
        <EmptyState icon={Heart} text="No saved items yet. Tap the heart on any product to save it here." />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.key} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5">
              <img src={item.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy-800">{item.name}</p>
                <p className="text-xs text-slate-500">{item.enquiryOnly ? 'Enquiry' : isLoggedIn ? rupee(item.price) : 'Login to view price'}</p>
              </div>
              <button onClick={() => onMoveToCart(item)} className="rounded-full bg-aqua-50 px-3 py-1.5 text-xs font-semibold text-aqua-700 hover:bg-aqua-500 hover:text-white">
                Add
              </button>
              <button onClick={() => onRemove(item.key)} aria-label="Remove" className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <p className="max-w-xs text-sm text-slate-500">{text}</p>
    </div>
  )
}
