import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Smartphone, ShieldCheck } from 'lucide-react'
import Modal from './Modal'
import { isRegisteredPhone } from '../utils/registeredUsers'

const inputCls = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-navy-900 placeholder:text-slate-400 transition-colors focus:border-aqua-400 focus:bg-white focus:ring-2 focus:ring-aqua-100'

/**
 * PhoneGatePopup — the entry point for every "Login to view price" /
 * "Login to Buy" prompt. Asks only for a mobile number, then decides where
 * to send the shopper: an existing number goes straight to the login OTP
 * step, an unrecognised one goes to the register OTP step — mirroring how
 * romegamart.com itself routes a wholesale-price click.
 */
export default function PhoneGatePopup({ open, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const close = () => {
    setPhone('')
    setError('')
    setLoading(false)
    onClose()
  }

  const submit = (e) => {
    e.preventDefault()
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number starting with 6-9')
      return
    }
    setError('')
    setLoading(true)
    // Simulate the "check number + send OTP" round-trip.
    setTimeout(() => {
      setLoading(false)
      const destination = isRegisteredPhone(phone) ? '/login' : '/register'
      // Remember where the gate was opened (e.g. the product page) so login /
      // register can send the shopper straight back after authenticating.
      const from = location.pathname + location.search
      navigate(destination, { state: { phone, autoOtp: true, from } })
      close()
    }, 600)
  }

  return (
    <Modal open={open} onClose={close} title="Get Wholesale Price" maxWidth="max-w-sm">
      <p className="text-sm text-slate-500">Enter your mobile number — we'll check your account and send an OTP to continue.</p>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Mobile Number</label>
          <div className="flex gap-2">
            <span className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-500">+91</span>
            <input
              type="tel" inputMode="numeric" maxLength={10} autoFocus required
              value={phone}
              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError('') }}
              placeholder="Enter 10-digit mobile number"
              className={`${inputCls} ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
            />
          </div>
          {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={phone.length !== 10 || loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-aqua-500 to-navy-800 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-aqua-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? (
            <><ShieldCheck className="h-4 w-4 animate-pulse" /> Checking number...</>
          ) : (
            <><Smartphone className="h-4 w-4" /> Continue</>
          )}
        </button>
      </form>
    </Modal>
  )
}
