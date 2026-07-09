import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Smartphone, ArrowLeft, ShieldCheck, RotateCw } from 'lucide-react'
import { registerPhone } from '../utils/registeredUsers'

const inputCls = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-navy-900 placeholder:text-slate-400 transition-colors focus:border-aqua-400 focus:bg-white focus:ring-2 focus:ring-aqua-100'
const primaryBtn = 'inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-aqua-500 to-navy-800 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-aqua-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl'

const SELLER_PHONE = '7080159181'
const BUYER_PHONE = '9648676532'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const gatePhone = location.state?.autoOtp ? location.state.phone : ''
  // Where to return after a successful buyer login — the page the shopper was
  // on when the login was triggered (e.g. the product they clicked "View" on),
  // falling back to home.
  const returnTo = location.state?.from || '/'
  const [step, setStep] = useState(gatePhone ? 'otp' : 'mobile') // mobile | otp
  const [phone, setPhone] = useState(gatePhone)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [resendIn, setResendIn] = useState(gatePhone ? 30 : 0)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (resendIn <= 0) return
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendIn])

  const submitMobile = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!phone.trim()) {
      newErrors.phone = 'Mobile number is required'
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone = 'Enter a valid 10-digit mobile number starting with 6-9'
    }
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({})
    setOtp('')
    setOtpError('')
    setResendIn(30)
    setStep('otp')
  }

  const verifyOtp = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!otp.trim()) {
      newErrors.otp = 'OTP is required'
    } else if (otp.length < 4) {
      newErrors.otp = 'Enter at least 4 digits of OTP'
    }
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({})
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      registerPhone(phone)
      if (phone === SELLER_PHONE) {
        const user = { name: 'Seller', role: 'seller', contact: phone, kyc: { image: null, status: 'none' } }
        localStorage.setItem('rmg_user', JSON.stringify(user))
        navigate('/seller/dashboard')
      } else if (phone === BUYER_PHONE) {
        const user = { name: 'Buyer', role: 'buyer', contact: phone, kyc: { image: null, status: 'none' } }
        localStorage.setItem('rmg_user', JSON.stringify(user))
        navigate(returnTo)
      } else {
        const user = { name: 'Buyer', role: 'buyer', contact: phone, kyc: { image: null, status: 'none' } }
        localStorage.setItem('rmg_user', JSON.stringify(user))
        navigate(returnTo)
      }
    }, 800)
  }

  const resend = () => {
    setOtp('')
    setOtpError('')
    setResendIn(30)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-aqua-50/30">
      {/* Top bar */}
      <div className="border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/romegamart-logo.webp" alt="Romegamart" className="h-9 w-9 rounded-full shadow-soft" />
            <span className="font-display text-lg font-bold tracking-tight text-navy-800">
              ROME<span className="text-aqua-600">GAMART</span>
            </span>
          </Link>
          <Link to="/register" className="text-sm font-semibold text-aqua-600 hover:text-aqua-700">
            Create Account
          </Link>
        </div>
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-57px)] max-w-7xl flex-col lg:flex-row">
        {/* Left panel — branding (decorative blur orbs match the rest of the site's hero/stats treatment) */}
        <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-aqua-700 p-12 lg:flex">
          <div className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-aqua-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-80 w-80 rounded-full bg-accent-400/10 blur-3xl" />
          <div className="relative max-w-md text-center">
            <img src="/romegamart-logo.webp" alt="" className="mx-auto mb-8 h-20 w-20 rounded-2xl shadow-2xl" />
            <h1 className="text-3xl font-extrabold text-white">Welcome to Romegamart</h1>
            <p className="mt-1 text-lg font-medium text-aqua-300">India's #1 B2B Marketplace for the RO Industry</p>
            <div className="mt-10 grid grid-cols-2 gap-4 text-center">
              {[
                { val: '10K+', label: 'Active Sellers' },
                { val: '28+', label: 'States Covered' },
                { val: '₹5Cr+', label: 'Monthly Trade' },
                { val: '50K+', label: 'Products Listed' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-white/10 p-4 backdrop-blur transition-colors hover:bg-white/15">
                  <p className="text-xl font-extrabold text-white">{s.val}</p>
                  <p className="mt-1 text-xs text-aqua-200/70">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex flex-1 items-center justify-center p-4 sm:p-10">
          <div key={step} className="w-full max-w-md animate-fade-up rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
            {step === 'otp' && (
              <button onClick={() => setStep('mobile')} className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-navy-800">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            )}

            <h2 className="text-2xl font-extrabold tracking-tight text-navy-900">
              {step === 'mobile' ? 'Welcome Back' : 'Verify OTP'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {step === 'mobile' ? 'Sign in to your Romegamart account' : `Code sent to +91 ${phone}`}
            </p>

            {step === 'mobile' ? (
              <form onSubmit={submitMobile} className="mt-8 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Mobile Number</label>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-500">+91</span>
                    <input
                      type="tel" inputMode="numeric" maxLength={10} required
                      value={phone} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setErrors((p) => ({ ...p, phone: '' })) }}
                      placeholder="Enter 10-digit mobile number"
                      className={`${inputCls} ${errors.phone ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                    />
                  </div>
                  {errors.phone && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.phone}</p>}
                  {phone.length > 0 && phone.length < 10 && !errors.phone && (
                    <p className="mt-1.5 text-xs text-slate-400">{10 - phone.length} digits remaining</p>
                  )}
                </div>
                <button type="submit" className={primaryBtn} disabled={phone.length !== 10}>
                  <Smartphone className="h-4 w-4" /> Send OTP
                </button>

                {/* Demo hints */}
                <div className="rounded-xl border border-dashed border-aqua-200 bg-aqua-50/50 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-aqua-600">Demo Accounts</p>
                  <div className="mt-2 space-y-1 text-xs text-slate-600">
                    <p><span className="font-mono font-bold text-navy-800">7080159181</span> → Seller</p>
                    <p><span className="font-mono font-bold text-navy-800">9648676532</span> → Buyer</p>
                    <p className="text-slate-400">Any OTP works for demo</p>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className="mt-8 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Enter OTP</label>
                  <input
                    type="text" inputMode="numeric" maxLength={6} autoFocus
                    value={otp} onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setErrors((p) => ({ ...p, otp: '' })) }}
                    placeholder="6-digit code"
                    className={`${inputCls} text-center text-lg tracking-[0.5em] ${errors.otp ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                  />
                  {errors.otp && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.otp}</p>}
                </div>
                <button type="submit" className={primaryBtn} disabled={loading}>
                  {loading ? (
                    <span className="inline-flex items-center gap-2"><RotateCw className="h-4 w-4 animate-spin" /> Verifying...</span>
                  ) : (
                    <><ShieldCheck className="h-4 w-4" /> Verify & Sign In</>
                  )}
                </button>
                <div className="text-center">
                  {resendIn > 0 ? (
                    <p className="text-sm text-slate-400">Resend OTP in <span className="font-bold text-navy-800">{resendIn}s</span></p>
                  ) : (
                    <button type="button" onClick={resend} className="text-sm font-semibold text-aqua-600 hover:text-aqua-700">Resend OTP</button>
                  )}
                </div>
              </form>
            )}

            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-aqua-600 hover:text-aqua-700">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
