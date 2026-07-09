import { useState } from 'react'
import { Store, MapPin, CreditCard, Save, Bell } from 'lucide-react'

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-navy-900 transition-colors focus:border-aqua-400 focus:bg-white'
const labelCls = 'mb-1 block text-xs font-semibold text-slate-500'

export default function SellerSettingsPage({ user, onToast }) {
  const [shopName, setShopName] = useState(`${user?.name || 'My'}'s RO Store`)
  const [gst, setGst] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [bank, setBank] = useState({ accountName: '', accountNumber: '', ifsc: '' })
  const [notifications, setNotifications] = useState({ orders: true, messages: true, promos: false })
  const [errors, setErrors] = useState({})

  const save = (section) => {
    const newErrors = {}
    if (section === 'Shop profile') {
      if (!shopName.trim()) newErrors.shopName = 'Shop name is required'
      if (phone && !/^[6-9]\d{9}$/.test(phone)) newErrors.phone = 'Enter a valid 10-digit number'
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email'
    }
    if (section === 'Address') {
      if (!address.trim()) newErrors.address = 'Address is required'
    }
    if (section === 'Bank details') {
      if (!bank.accountName.trim()) newErrors.accountName = 'Account holder name is required'
      if (!bank.accountNumber.trim()) newErrors.accountNumber = 'Account number is required'
      else if (bank.accountNumber.length < 9) newErrors.accountNumber = 'Enter a valid account number'
      if (!bank.ifsc.trim()) newErrors.ifsc = 'IFSC code is required'
      else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bank.ifsc)) newErrors.ifsc = 'Enter a valid IFSC code'
    }
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({})
    onToast?.(`${section} saved — demo only.`)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Shop Settings</h1>
        <p className="text-sm text-slate-500">Manage your store profile and payout details</p>
      </div>

      {/* Shop Profile */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-aqua-50 text-aqua-600">
            <Store className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <div>
            <h2 className="text-sm font-bold text-navy-800">Shop Profile</h2>
            <p className="text-xs text-slate-400">Your public store information</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className={labelCls}>Shop / Store Name *</span>
            <input value={shopName} onChange={(e) => { setShopName(e.target.value); setErrors((p) => ({ ...p, shopName: '' })) }} className={`${inputCls} ${errors.shopName ? 'border-red-300' : ''}`} />
            {errors.shopName && <p className="mt-1 text-xs text-red-500">{errors.shopName}</p>}
          </label>
          <label className="block">
            <span className={labelCls}>GST Number</span>
            <input value={gst} onChange={(e) => setGst(e.target.value)} placeholder="22AAAAA0000A1Z5" className={inputCls} />
          </label>
          <label className="block">
            <span className={labelCls}>Business Phone</span>
            <input value={phone} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setErrors((p) => ({ ...p, phone: '' })) }} placeholder="10-digit number" className={`${inputCls} ${errors.phone ? 'border-red-300' : ''}`} />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </label>
          <label className="block sm:col-span-2">
            <span className={labelCls}>Business Email</span>
            <input value={email} onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })) }} type="email" placeholder="seller@example.com" className={`${inputCls} ${errors.email ? 'border-red-300' : ''}`} />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </label>
        </div>
        <button onClick={() => save('Shop profile')} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700">
          <Save className="h-3.5 w-3.5" strokeWidth={1.5} /> Save Profile
        </button>
      </div>

      {/* Pickup Address */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-600">
            <MapPin className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <div>
            <h2 className="text-sm font-bold text-navy-800">Pickup Address</h2>
            <p className="text-xs text-slate-400">Warehouse / shop address for order pickups</p>
          </div>
        </div>
        <label className="block">
          <span className={labelCls}>Full Address *</span>
          <textarea
            value={address}
            onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: '' })) }}
            rows={3}
            className={`${inputCls} resize-none ${errors.address ? 'border-red-300' : ''}`}
            placeholder="Plot no., street, city, state, PIN code"
          />
          {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
        </label>
        <button onClick={() => save('Address')} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700">
          <Save className="h-3.5 w-3.5" strokeWidth={1.5} /> Save Address
        </button>
      </div>

      {/* Bank / Payout Details */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-50 text-accent-600">
            <CreditCard className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <div>
            <h2 className="text-sm font-bold text-navy-800">Bank / Payout Details</h2>
            <p className="text-xs text-slate-400">Where your earnings will be transferred</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className={labelCls}>Account Holder Name *</span>
            <input value={bank.accountName} onChange={(e) => { setBank({ ...bank, accountName: e.target.value }); setErrors((p) => ({ ...p, accountName: '' })) }} className={`${inputCls} ${errors.accountName ? 'border-red-300' : ''}`} />
            {errors.accountName && <p className="mt-1 text-xs text-red-500">{errors.accountName}</p>}
          </label>
          <label className="block">
            <span className={labelCls}>Account Number *</span>
            <input value={bank.accountNumber} onChange={(e) => { setBank({ ...bank, accountNumber: e.target.value.replace(/\D/g, '') }); setErrors((p) => ({ ...p, accountNumber: '' })) }} className={`${inputCls} ${errors.accountNumber ? 'border-red-300' : ''}`} />
            {errors.accountNumber && <p className="mt-1 text-xs text-red-500">{errors.accountNumber}</p>}
          </label>
          <label className="block">
            <span className={labelCls}>IFSC Code *</span>
            <input value={bank.ifsc} onChange={(e) => { setBank({ ...bank, ifsc: e.target.value.toUpperCase() }); setErrors((p) => ({ ...p, ifsc: '' })) }} placeholder="SBIN0001234" className={`${inputCls} font-mono ${errors.ifsc ? 'border-red-300' : ''}`} />
            {errors.ifsc && <p className="mt-1 text-xs text-red-500">{errors.ifsc}</p>}
          </label>
        </div>
        <button onClick={() => save('Bank details')} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-aqua-500 to-navy-800 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
          <Save className="h-3.5 w-3.5" strokeWidth={1.5} /> Save Bank Details
        </button>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-600">
            <Bell className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <div>
            <h2 className="text-sm font-bold text-navy-800">Notification Preferences</h2>
            <p className="text-xs text-slate-400">Choose what updates you receive</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { key: 'orders', label: 'New order notifications', desc: 'Get alerted when a buyer places an order' },
            { key: 'messages', label: 'Buyer messages', desc: 'Receive notifications for buyer enquiries' },
            { key: 'promos', label: 'Promotional updates', desc: 'Platform offers and feature announcements' },
          ].map((n) => (
            <label key={n.key} className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 p-3 transition-colors hover:bg-slate-50">
              <div>
                <p className="text-sm font-semibold text-navy-800">{n.label}</p>
                <p className="text-[11px] text-slate-400">{n.desc}</p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={notifications[n.key]}
                  onChange={(e) => setNotifications({ ...notifications, [n.key]: e.target.checked })}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-slate-200 transition-colors peer-checked:bg-aqua-500" />
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          ))}
        </div>
        <button onClick={() => save('Notifications')} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700">
          <Save className="h-3.5 w-3.5" strokeWidth={1.5} /> Save Preferences
        </button>
      </div>
    </div>
  )
}
