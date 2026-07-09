import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Smartphone, ArrowLeft, ShieldCheck, User, Store, Upload, CheckCircle2, FileText, Building2 } from 'lucide-react'
import { registerPhone } from '../utils/registeredUsers'

const inputCls = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-navy-900 placeholder:text-slate-400 transition-colors focus:border-aqua-400 focus:bg-white focus:ring-2 focus:ring-aqua-100'
const primaryBtn = 'inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-aqua-500 to-navy-800 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-aqua-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl'
const outlineBtn = 'inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-navy-800 transition-all hover:-translate-y-0.5 hover:border-aqua-300 hover:shadow-lg'

export default function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const gatePhone = location.state?.autoOtp ? location.state.phone : ''
  // Return the shopper to the page that triggered registration (e.g. the
  // product they were viewing), falling back to home.
  const returnTo = location.state?.from || '/'
  const [role, setRole] = useState(null) // null | buyer | seller
  const [step, setStep] = useState(gatePhone ? 'otp' : 'mobile') // mobile | otp | role | kyc
  const [phone, setPhone] = useState(gatePhone)
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [resendIn, setResendIn] = useState(gatePhone ? 30 : 0)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // KYC state
  const [visitingCard, setVisitingCard] = useState(null)
  const [visitingCardPreview, setVisitingCardPreview] = useState(null)

  // Seller GST state
  const [gstNumber, setGstNumber] = useState('')
  const [gstCertificate, setGstCertificate] = useState(null)
  const [gstCertPreview, setGstCertPreview] = useState(null)
  const [businessName, setBusinessName] = useState('')
  const [businessAddress, setBusinessAddress] = useState('')

  useEffect(() => {
    if (resendIn <= 0) return
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendIn])

  const submitMobile = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!name.trim()) {
      newErrors.name = 'Name is required'
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
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
      setStep('role')
    }, 800)
  }

  const selectRole = (r) => {
    setRole(r)
    setStep('kyc')
  }

  const handleFile = (file, type) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      if (type === 'visiting') { setVisitingCard(file); setVisitingCardPreview(e.target.result) }
      else { setGstCertificate(file); setGstCertPreview(e.target.result) }
    }
    reader.readAsDataURL(file)
  }

  const completeRegistration = () => {
    const newErrors = {}
    if (role === 'seller') {
      if (!businessName.trim()) newErrors.businessName = 'Business name is required'
      if (gstNumber && gstNumber.length !== 15) newErrors.gstNumber = 'GST number must be 15 characters'
    }
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({})
    setLoading(true)
    setTimeout(() => {
      const user = {
        name: name || 'User',
        role,
        contact: phone,
        kyc: role === 'buyer'
          ? { image: visitingCardPreview, status: visitingCard ? 'pending' : 'none' }
          : { gstNumber, gstCertificate: gstCertPreview, businessName, businessAddress, status: gstCertificate ? 'pending' : 'none' },
      }
      localStorage.setItem('rmg_user', JSON.stringify(user))
      registerPhone(phone)
      setLoading(false)
      if (role === 'seller') navigate('/seller/dashboard')
      else navigate(returnTo)
    }, 1000)
  }

  const skipKyc = () => {
    const user = { name: name || 'User', role, contact: phone, kyc: { image: null, status: 'none' } }
    localStorage.setItem('rmg_user', JSON.stringify(user))
    registerPhone(phone)
    if (role === 'seller') navigate('/seller/dashboard')
    else navigate(returnTo)
  }

  const resend = () => { setOtp(''); setOtpError(''); setResendIn(30) }

  const stepTitle = step === 'mobile'
    ? 'Create Account'
    : step === 'otp'
      ? 'Verify OTP'
      : step === 'role'
        ? 'Choose Account Type'
        : role === 'buyer' ? 'Complete Your Profile' : 'Business Details'

  const stepDesc = step === 'mobile'
    ? "Join India's fastest growing RO industry platform"
    : step === 'otp'
      ? `Code sent to +91 ${phone}`
      : step === 'role'
        ? 'How do you want to use Romegamart?'
        : role === 'buyer' ? 'Upload your visiting card for verification' : 'Provide your GST and business information'

  const goBack = () => {
    if (step === 'otp') setStep('mobile')
    else if (step === 'role') setStep('otp')
    else if (step === 'kyc') setStep('role')
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
          <Link to="/login" className="text-sm font-semibold text-aqua-600 hover:text-aqua-700">
            Sign In
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
            <h1 className="text-3xl font-extrabold text-white">Join Romegamart</h1>
            <p className="mt-1 text-lg font-medium text-aqua-300">India's #1 B2B RO Platform</p>
            <div className="mt-10 space-y-4">
              {[
                { icon: CheckCircle2, text: 'Free product listing — no setup fees' },
                { icon: CheckCircle2, text: 'Pan-India verified buyer network' },
                { icon: CheckCircle2, text: 'Dedicated seller support team' },
                { icon: CheckCircle2, text: '50,000+ products across 200+ categories' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-white/10 px-5 py-3 text-left text-sm text-white backdrop-blur transition-colors hover:bg-white/15">
                  <f.icon className="h-5 w-5 shrink-0 text-aqua-300" />
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex flex-1 items-center justify-center p-4 py-8 sm:p-10">
          <div key={step} className="w-full max-w-md animate-fade-up rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
            {step !== 'mobile' && (
              <button onClick={goBack} className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-navy-800">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            )}

            <h2 className="text-2xl font-extrabold tracking-tight text-navy-900">{stepTitle}</h2>
            <p className="mt-2 text-sm text-slate-500">{stepDesc}</p>

            {/* ── Step 1: Mobile + Name ────────────────────────── */}
            {step === 'mobile' && (
              <form onSubmit={submitMobile} className="mt-8 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                  <input type="text" required value={name} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })) }} placeholder="Business or personal name" className={`${inputCls} ${errors.name ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`} />
                  {errors.name && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Mobile Number</label>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-500">+91</span>
                    <input type="tel" inputMode="numeric" maxLength={10} required value={phone} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setErrors((p) => ({ ...p, phone: '' })) }} placeholder="10-digit mobile number" className={`${inputCls} ${errors.phone ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`} />
                  </div>
                  {errors.phone && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.phone}</p>}
                  {phone.length > 0 && phone.length < 10 && !errors.phone && (
                    <p className="mt-1.5 text-xs text-slate-400">{10 - phone.length} digits remaining</p>
                  )}
                </div>
                <button type="submit" className={primaryBtn} disabled={phone.length !== 10 || !name.trim()}>
                  <Smartphone className="h-4 w-4" /> Register & Send OTP
                </button>
              </form>
            )}

            {/* ── Step 2: OTP ──────────────────────────────────── */}
            {step === 'otp' && (
              <form onSubmit={verifyOtp} className="mt-8 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Enter OTP</label>
                  <input type="text" inputMode="numeric" maxLength={6} autoFocus value={otp} onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setErrors((p) => ({ ...p, otp: '' })) }} placeholder="6-digit code" className={`${inputCls} text-center text-lg tracking-[0.5em] ${errors.otp ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`} />
                  {errors.otp && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.otp}</p>}
                </div>
                <button type="submit" className={primaryBtn} disabled={loading}>
                  {loading ? 'Verifying...' : <><ShieldCheck className="h-4 w-4" /> Verify OTP</>}
                </button>
                <div className="text-center">
                  {resendIn > 0 ? (
                    <p className="text-sm text-slate-400">Resend in <span className="font-bold text-navy-800">{resendIn}s</span></p>
                  ) : (
                    <button type="button" onClick={resend} className="text-sm font-semibold text-aqua-600 hover:text-aqua-700">Resend OTP</button>
                  )}
                </div>
              </form>
            )}

            {/* ── Step 3: Choose Role ──────────────────────────── */}
            {step === 'role' && (
              <div className="mt-8 space-y-4">
                <button
                  onClick={() => selectRole('buyer')}
                  className="w-full rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition-all hover:-translate-y-1 hover:border-aqua-400 hover:shadow-lift"
                >
                  <div className="flex items-center gap-4">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-aqua-50 text-aqua-600">
                      <User className="h-7 w-7" />
                    </span>
                    <div>
                      <p className="text-lg font-bold text-navy-800">I'm a Buyer</p>
                      <p className="mt-1 text-sm text-slate-500">Browse & purchase RO products from verified sellers across India</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => selectRole('seller')}
                  className="w-full rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition-all hover:-translate-y-1 hover:border-aqua-400 hover:shadow-lift"
                >
                  <div className="flex items-center gap-4">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-navy-50 text-navy-600">
                      <Store className="h-7 w-7" />
                    </span>
                    <div>
                      <p className="text-lg font-bold text-navy-800">I'm a Seller</p>
                      <p className="mt-1 text-sm text-slate-500">List your products, receive orders & grow your RO business</p>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* ── Step 4: KYC / GST ────────────────────────────── */}
            {step === 'kyc' && (
              <div className="mt-6 space-y-5">
                {role === 'buyer' ? (
                  /* ── Buyer: Visiting Card ────────────────── */
                  <>
                    <div className="rounded-xl border border-dashed border-aqua-300 bg-aqua-50/50 p-5 text-center">
                      <Upload className="mx-auto h-8 w-8 text-aqua-500" />
                      <p className="mt-2 text-sm font-semibold text-navy-800">Upload Visiting Card</p>
                      <p className="mt-1 text-xs text-slate-400">JPEG, PNG or PDF (max 5MB)</p>
                      <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-navy-800 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lg">
                        <Upload className="h-4 w-4" /> Choose File
                        <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFile(e.target.files?.[0], 'visiting')} />
                      </label>
                    </div>
                    {visitingCardPreview && (
                      <div className="rounded-xl border border-slate-200 p-3">
                        <img src={visitingCardPreview} alt="Visiting card" className="mx-auto max-h-40 rounded-lg object-contain" />
                        <p className="mt-2 text-center text-xs text-slate-400">{visitingCard?.name}</p>
                      </div>
                    )}
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Why is this needed?</p>
                      <p className="mt-1 text-xs text-amber-800">Romegamart verifies all buyers to maintain a trusted B2B marketplace. Your visiting card helps us confirm your business identity.</p>
                    </div>
                  </>
                ) : (
                  /* ── Seller: GST Details ─────────────────── */
                  <>
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Building2 className="h-5 w-5 text-aqua-600" />
                        <p className="text-sm font-bold text-navy-800">Business Information</p>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-400">Business Name *</label>
                          <input type="text" value={businessName} onChange={(e) => { setBusinessName(e.target.value); setErrors((p) => ({ ...p, businessName: '' })) }} placeholder="e.g. Aqua Tech Solutions" className={`${inputCls} ${errors.businessName ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`} />
                          {errors.businessName && <p className="mt-1 text-xs font-medium text-red-500">{errors.businessName}</p>}
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-400">GST Number</label>
                          <input type="text" value={gstNumber} onChange={(e) => { setGstNumber(e.target.value.toUpperCase()); setErrors((p) => ({ ...p, gstNumber: '' })) }} placeholder="22AAAAA0000A1Z5" maxLength={15} className={`${inputCls} font-mono ${errors.gstNumber ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`} />
                          {errors.gstNumber && <p className="mt-1 text-xs font-medium text-red-500">{errors.gstNumber}</p>}
                          {!errors.gstNumber && <p className="mt-1 text-[11px] text-slate-400">15-digit GSTIN (e.g. 22AAAAA0000A1Z5)</p>}
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-400">Business Address</label>
                          <textarea value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} placeholder="Full address with city, state, pincode" rows={2} className={inputCls} />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-dashed border-aqua-300 bg-aqua-50/50 p-5 text-center">
                      <FileText className="mx-auto h-8 w-8 text-aqua-500" />
                      <p className="mt-2 text-sm font-semibold text-navy-800">Upload GST Certificate</p>
                      <p className="mt-1 text-xs text-slate-400">JPEG, PNG or PDF (max 5MB)</p>
                      <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-navy-800 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lg">
                        <Upload className="h-4 w-4" /> Choose File
                        <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFile(e.target.files?.[0], 'gst')} />
                      </label>
                    </div>
                    {gstCertPreview && (
                      <div className="rounded-xl border border-slate-200 p-3">
                        <img src={gstCertPreview} alt="GST Certificate" className="mx-auto max-h-40 rounded-lg object-contain" />
                        <p className="mt-2 text-center text-xs text-slate-400">{gstCertificate?.name}</p>
                      </div>
                    )}
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Why is GST required?</p>
                      <p className="mt-1 text-xs text-amber-800">Romegamart is a B2B platform. GST registration is mandatory for sellers to generate valid tax invoices and maintain compliance.</p>
                    </div>
                  </>
                )}

                <button onClick={completeRegistration} className={primaryBtn} disabled={loading}>
                  {loading ? 'Creating Account...' : <><CheckCircle2 className="h-4 w-4" /> Complete Registration</>}
                </button>
                <button onClick={skipKyc} className={outlineBtn}>
                  Skip for Now
                </button>
              </div>
            )}

            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-aqua-600 hover:text-aqua-700">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
