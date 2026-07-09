import { useState, useEffect } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import Modal from './Modal'

const inputCls = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-navy-900 placeholder:text-slate-400 outline-none transition-colors focus:border-aqua-400 focus:bg-white'

/**
 * EnquiryModal — bulk/quote enquiry form for enquiry-only products
 * (bottling plants, treatment systems, etc.). Opens instead of adding the
 * item to the cart: the buyer leaves name + mobile + quantity + message and
 * the seller follows up — mirroring romegamart.com's "Send Enquiry" flow.
 */
export default function EnquiryModal({ open, product, onClose, onToast }) {
  const [form, setForm] = useState({ name: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  // Reset whenever a new product's enquiry is opened.
  useEffect(() => {
    if (open) {
      setForm({ name: '', phone: '' })
      setErrors({})
      setSubmitted(false)
    }
  }, [open, product?.key])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setSubmitted(true)
    onToast?.('Enquiry sent — the seller will contact you shortly.')
  }

  return (
    <Modal open={open} onClose={onClose} title="Send Enquiry" maxWidth="max-w-md">
      {submitted ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-50">
            <CheckCircle2 className="h-7 w-7 text-accent-600" />
          </span>
          <p className="text-base font-bold text-navy-900">Enquiry Submitted!</p>
          <p className="max-w-xs text-sm text-slate-500">
            Thanks{form.name ? `, ${form.name.split(' ')[0]}` : ''}. The seller will reach out to you on
            <span className="font-semibold text-navy-800"> +91 {form.phone}</span> shortly.
          </p>
          <button onClick={onClose} className="mt-2 rounded-lg bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          {product && (
            <p className="line-clamp-1 text-xs text-slate-500">
              Enquiry for <span className="font-semibold text-navy-800">{product.name}</span>
            </p>
          )}

          <div>
            <input
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }) }}
              placeholder="Your name"
              className={`${inputCls} ${errors.name ? 'border-red-300' : ''}`}
            />
            {errors.name && <p className="mt-1 text-[11px] text-red-500">{errors.name}</p>}
          </div>

          <div>
            <div className="flex gap-2">
              <span className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-500">+91</span>
              <input
                type="tel" inputMode="numeric" maxLength={10}
                value={form.phone}
                onChange={(e) => { setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }); setErrors({ ...errors, phone: '' }) }}
                placeholder="Mobile number"
                className={`${inputCls} ${errors.phone ? 'border-red-300' : ''}`}
              />
            </div>
            {errors.phone && <p className="mt-1 text-[11px] text-red-500">{errors.phone}</p>}
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-aqua-500 to-navy-800 px-4 py-3 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <Send className="h-4 w-4" /> Send Enquiry
          </button>
        </form>
      )}
    </Modal>
  )
}
