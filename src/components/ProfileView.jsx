import { useRef, useState } from 'react'
import {
  ArrowLeft, User, Mail, ShieldCheck, ShieldAlert, ShieldQuestion,
  UploadCloud, RefreshCw, CheckCircle2, ShoppingBag, Factory, LayoutDashboard,
  MapPin, Navigation, X, Search, Package,
} from 'lucide-react'

/**
 * ProfileView — opens right after login/role-selection.
 * Editable profile fields + a KYC section (visiting/business card upload
 * with a Verified / Pending / Not Verified status). UI only — no backend;
 * "Simulate Verification" is a stand-in for a real admin-approval step.
 */
export default function ProfileView({ user, onExit, onOpenDashboard, onOpenOrders, onUploadKyc, onSimulateVerify }) {
  const [name, setName] = useState(user?.name || '')
  const [contact, setContact] = useState(user?.contact || '')
  const [business, setBusiness] = useState('')
  const [location, setLocation] = useState(user?.location || 'New Delhi, India')
  const [showLocationEdit, setShowLocationEdit] = useState(false)
  const [locationSearch, setLocationSearch] = useState('')
  const fileRef = useRef(null)

  const isSeller = user?.role === 'seller'
  const kyc = user?.kyc || { image: null, status: 'none' }

  const PRESET_LOCATIONS = [
    'New Delhi, India', 'Mumbai, Maharashtra', 'Bangalore, Karnataka',
    'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Hyderabad, Telangana',
    'Pune, Maharashtra', 'Ahmedabad, Gujarat', 'Jaipur, Rajasthan',
    'Lucknow, Uttar Pradesh', 'Chandigarh, India', 'Bhopal, Madhya Pradesh',
  ]

  const filteredLocations = PRESET_LOCATIONS.filter((l) =>
    l.toLowerCase().includes(locationSearch.toLowerCase())
  )

  const saveLocation = (loc) => {
    setLocation(loc)
    setShowLocationEdit(false)
    setLocationSearch('')
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    onUploadKyc(URL.createObjectURL(file))
  }

  const initials = (name || 'U').trim().slice(0, 2).toUpperCase()

  return (
    <section className="mx-auto max-w-4xl px-4 py-6">
      <button onClick={onExit} className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-aqua-700 hover:text-aqua-800">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-aqua-700 p-6 text-white sm:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white/15 text-xl font-bold ring-2 ring-white/30">
            {initials}
          </span>
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">{name || 'Your Profile'}</h1>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                isSeller ? 'bg-white text-navy-800' : 'bg-accent-500 text-white'
              }`}>
                {isSeller ? <Factory className="h-3 w-3" /> : <ShoppingBag className="h-3 w-3" />}
                {user?.role}
              </span>
              <KycBadge status={kyc.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Personal details */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">Personal Details</h2>
          <div className="space-y-3">
            <Field icon={User} label="Full Name" value={name} onChange={setName} />
            <Field icon={Mail} label="Email / Phone" value={contact} onChange={setContact} />
            {isSeller && <Field icon={Factory} label="Business / Firm Name" value={business} onChange={setBusiness} placeholder="e.g. Sharma Water Solutions" />}
          </div>
          <button
            onClick={() => { /* demo only */ }}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
          >
            Save Changes
          </button>
        </div>

        {/* Location */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Delivery Location</h2>
            <button onClick={() => setShowLocationEdit(!showLocationEdit)} className="text-xs font-semibold text-aqua-600 hover:text-aqua-700">
              {showLocationEdit ? 'Cancel' : 'Change'}
            </button>
          </div>

          {!showLocationEdit ? (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-aqua-50 text-aqua-600">
                <MapPin className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy-800">{location}</p>
                <p className="text-xs text-slate-400">Used for delivery & nearby sellers</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Search city or area..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-aqua-400 focus:bg-white"
                  autoFocus
                />
              </div>
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-slate-200">
                {filteredLocations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => saveLocation(loc)}
                    className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors hover:bg-aqua-50 ${loc === location ? 'bg-aqua-50 text-aqua-700 font-semibold' : 'text-slate-600'}`}
                  >
                    <Navigation className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    {loc}
                    {loc === location && <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-aqua-500" />}
                  </button>
                ))}
                {filteredLocations.length === 0 && (
                  <button
                    onClick={() => saveLocation(locationSearch || location)}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-aqua-600 hover:bg-aqua-50"
                  >
                    <MapPin className="h-3.5 w-3.5" /> Set "{locationSearch || 'Current Location'}"
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* KYC */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">KYC Verification</h2>
            <KycBadge status={kyc.status} />
          </div>

          <p className="mb-3 text-xs text-slate-500">
            Upload a photo of your visiting card / business card to verify your identity and unlock full B2B pricing.
          </p>

          {kyc.image ? (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img src={kyc.image} alt="Visiting card" className="h-40 w-full object-contain p-2" />
              </div>

              {kyc.status === 'pending' && (
                <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
                  Your card is under review. Verification usually takes 24–48 hours.
                </div>
              )}
              {kyc.status === 'verified' && (
                <div className="flex items-center gap-2 rounded-xl bg-accent-500/10 p-3 text-xs font-semibold text-accent-600">
                  <CheckCircle2 className="h-4 w-4" /> Your account is verified!
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-navy-700 transition-colors hover:border-aqua-300 hover:text-aqua-700"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Replace Card
                </button>
                {kyc.status === 'pending' && (
                  <button
                    onClick={onSimulateVerify}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-aqua-500 to-navy-800 px-3 py-2 text-xs font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" /> Simulate Verification
                  </button>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-8 text-center transition-colors hover:border-aqua-400 hover:bg-aqua-50/50"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-aqua-50 text-aqua-600">
                <UploadCloud className="h-6 w-6" />
              </span>
              <span className="text-sm font-semibold text-navy-800">Upload Visiting Card</span>
              <span className="text-xs text-slate-400">PNG, JPG up to 5MB</span>
            </button>
          )}

          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

          <p className="mt-3 text-[11px] text-slate-400">
            Demo only — verification is simulated locally; no document is uploaded to a server.
          </p>
        </div>
      </div>

      {/* Exit CTA */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {isSeller ? (
          <button
            onClick={onOpenDashboard}
            className="inline-flex items-center gap-2 rounded-lg bg-navy-800 px-6 py-3 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <LayoutDashboard className="h-4 w-4" /> Go to Seller Dashboard
          </button>
        ) : (
          <>
            <button
              onClick={onOpenOrders}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-6 py-3 text-sm font-bold text-navy-700 transition-all hover:-translate-y-0.5 hover:border-aqua-300 hover:text-aqua-700"
            >
              <Package className="h-4 w-4" /> My Orders
            </button>
            <button
              onClick={onExit}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-aqua-500 to-navy-800 px-6 py-3 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <ShoppingBag className="h-4 w-4" /> Continue Shopping
            </button>
          </>
        )}
      </div>
    </section>
  )
}

function Field({ icon: Icon, label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-navy-900 transition-colors focus:border-aqua-400 focus:bg-white"
      />
    </label>
  )
}

function KycBadge({ status }) {
  const map = {
    none: { label: 'Not Verified', cls: 'bg-slate-100 text-slate-500', icon: ShieldQuestion },
    pending: { label: 'Pending Verification', cls: 'bg-amber-100 text-amber-700', icon: ShieldAlert },
    verified: { label: 'Verified', cls: 'bg-accent-500/15 text-accent-600', icon: ShieldCheck },
  }
  const { label, cls, icon: Icon } = map[status] || map.none
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${cls}`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  )
}
