import { useState } from 'react'
import { ArrowLeft, Mail, PhoneCall, MapPin, Clock, Send, CheckCircle2, MessageCircle } from 'lucide-react'

const SUBJECTS = ['General Enquiry', 'Become a Seller', 'Order Support', 'Bulk / Wholesale Pricing', 'Report an Issue']

/**
 * ContactView — "Contact Us" page, mirroring romegamart.com/contact-us/.
 * Client-only mock submit (no backend) — mirrors the Footer newsletter
 * pattern: shows a success state instead of actually sending anything.
 */
export default function ContactView({ onClose, onOpenAssistant }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: SUBJECTS[0], message: '' })
  const [sent, setSent] = useState(false)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="mx-auto min-h-[60vh] max-w-6xl px-4 py-6">
      <button onClick={onClose} className="mb-1 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-aqua-700">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to home
      </button>

      <div className="mt-2 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-aqua-600" />
        <h1 className="text-xl font-bold text-navy-900 sm:text-2xl">Contact Us</h1>
      </div>
      <p className="mt-1 max-w-xl text-sm text-slate-500">
        Questions about products, sellers, or your order? Reach out — our team usually replies within one business day.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3">
          {sent ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-accent-200 bg-accent-50/60 px-6 py-12 text-center">
              <CheckCircle2 className="h-10 w-10 text-accent-600" />
              <p className="text-base font-bold text-navy-900">Message sent!</p>
              <p className="max-w-xs text-sm text-slate-500">Thanks for reaching out — our team will get back to you shortly.</p>
              <button
                onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: SUBJECTS[0], message: '' }) }}
                className="mt-2 rounded-lg bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name">
                  <input required value={form.name} onChange={update('name')} placeholder="Your name" className="field" />
                </Field>
                <Field label="Phone">
                  <input required type="tel" value={form.phone} onChange={update('phone')} placeholder="10-digit mobile number" className="field" />
                </Field>
              </div>
              <Field label="Email">
                <input required type="email" value={form.email} onChange={update('email')} placeholder="you@company.com" className="field" />
              </Field>
              <Field label="Subject">
                <select value={form.subject} onChange={update('subject')} className="field">
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Message">
                <textarea required rows={4} value={form.message} onChange={update('message')} placeholder="How can we help?" className="field resize-none" />
              </Field>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-aqua-500 to-navy-800 py-3 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 sm:w-auto sm:px-8"
              >
                <Send className="h-4 w-4" /> Send Message
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4 lg:col-span-2">
          <InfoCard icon={PhoneCall} title="Helpline" lines={['1800-889-8529', 'Mon – Sat, 9:30 AM – 6:30 PM']} href="tel:18008898529" />
          <InfoCard icon={Mail} title="Email" lines={['support@romegamart.com']} href="mailto:support@romegamart.com" />
          <InfoCard icon={MapPin} title="Registered Office" lines={['Sara Aqua Soft, Romegamart', 'India']} />
          <InfoCard icon={Clock} title="Business Hours" lines={['Monday – Saturday', '9:30 AM – 6:30 PM IST']} />

          <button
            onClick={onOpenAssistant}
            className="flex w-full items-center justify-between rounded-2xl border border-aqua-200 bg-aqua-50/60 px-5 py-4 text-left transition-colors hover:bg-aqua-50"
          >
            <span>
              <span className="block text-sm font-bold text-navy-900">Need a faster answer?</span>
              <span className="block text-xs text-slate-500">Ask AquaBot — our AI assistant, online 24/7.</span>
            </span>
            <MessageCircle className="h-5 w-5 shrink-0 text-aqua-600" />
          </button>
        </div>
      </div>

      <style>{`.field{width:100%;border-radius:0.625rem;border:1px solid #e2e8f0;background:#fff;padding:0.625rem 0.875rem;font-size:0.875rem;color:#0a1f44;outline:none;transition:border-color .15s}.field:focus{border-color:#5fc9ec}`}</style>
    </section>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-500">{label}</span>
      {children}
    </label>
  )
}

function InfoCard({ icon: Icon, title, lines, href }) {
  const Wrapper = href ? 'a' : 'div'
  return (
    <Wrapper href={href} className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft transition-shadow hover:shadow-lift">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-aqua-50 text-aqua-600">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold text-navy-900">{title}</p>
        {lines.map((l) => <p key={l} className="text-xs text-slate-500">{l}</p>)}
      </div>
    </Wrapper>
  )
}
