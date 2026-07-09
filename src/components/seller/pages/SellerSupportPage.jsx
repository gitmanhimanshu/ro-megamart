import { useState } from 'react'
import { LifeBuoy, Plus, Clock, CheckCircle2, AlertCircle, MessageSquare, CreditCard, User, Package, UploadCloud } from 'lucide-react'
import { DonutChart, BarChart, StatCard } from '../Charts'

const SEED_TICKETS = [
  { id: 'TKT1042', subject: 'Payment not credited for order ROM10241', status: 'Open', date: '2 days ago', priority: 'High', category: 'Payment' },
  { id: 'TKT1038', subject: 'Need help updating GST certificate', status: 'Resolved', date: '1 week ago', priority: 'Medium', category: 'Account' },
  { id: 'TKT1029', subject: 'Product listing showing wrong category', status: 'Resolved', date: '2 weeks ago', priority: 'Low', category: 'Products' },
  { id: 'TKT1015', subject: 'Bulk upload failed for 50+ items', status: 'Open', date: '3 weeks ago', priority: 'High', category: 'Upload' },
]

const PRIORITY_CLS = {
  High: 'bg-red-50 text-red-500',
  Medium: 'bg-amber-50 text-amber-600',
  Low: 'bg-aqua-50 text-aqua-700',
}

// Selected-state styling for the priority picker buttons (explicit map —
// avoids fragile runtime string-replacement on PRIORITY_CLS).
const PRIORITY_SELECTED_CLS = {
  High: 'border-red-300 bg-red-50 text-red-600',
  Medium: 'border-amber-300 bg-amber-50 text-amber-700',
  Low: 'border-aqua-300 bg-aqua-50 text-aqua-700',
}

const CATEGORY_ICONS = {
  Payment: CreditCard,
  Account: User,
  Products: Package,
  Upload: UploadCloud,
}

export default function SellerSupportPage({ onToast }) {
  const [tickets, setTickets] = useState(SEED_TICKETS)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [errors, setErrors] = useState({})

  const submit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!subject.trim()) newErrors.subject = 'Subject is required'
    else if (subject.trim().length < 5) newErrors.subject = 'Subject must be at least 5 characters'
    if (!message.trim()) newErrors.message = 'Please describe your issue'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({})
    setTickets((t) => [{
      id: `TKT${1000 + t.length + 50}`,
      subject,
      status: 'Open',
      date: 'Just now',
      priority,
      category: 'General',
    }, ...t])
    setSubject('')
    setMessage('')
    setPriority('Medium')
    onToast?.('Support ticket raised — our team will get back to you soon.')
  }

  const openCount = tickets.filter((t) => t.status === 'Open').length
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length

  const statusDonut = [
    { label: 'Open', value: openCount, color: '#f59e0b' },
    { label: 'Resolved', value: resolvedCount, color: '#8cc63f' },
  ]

  const priorityData = [
    { label: 'High', value: tickets.filter((t) => t.priority === 'High').length, color: '#ef4444' },
    { label: 'Medium', value: tickets.filter((t) => t.priority === 'Medium').length, color: '#f59e0b' },
    { label: 'Low', value: tickets.filter((t) => t.priority === 'Low').length, color: '#14a4e0' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Support Tickets</h1>
        <p className="text-sm text-slate-500">Track issues you've raised with the Romegamart team</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Tickets" value={tickets.length} sub="All time" icon={LifeBuoy} color="aqua" />
        <StatCard label="Open" value={openCount} sub="Need attention" icon={AlertCircle} color="accent" />
        <StatCard label="Resolved" value={resolvedCount} sub="Completed" icon={CheckCircle2} color="green" />
        <StatCard label="Avg. Response" value="4.2 hrs" sub="Response time" icon={Clock} color="navy" />
      </div>

      {/* Charts */}
      <div className="grid gap-5 lg:grid-cols-2">
        <DonutChart
          data={statusDonut}
          title="Ticket Status"
          size={140}
          centerValue={tickets.length}
          centerLabel="Total"
        />
        <BarChart data={priorityData} title="Tickets by Priority" height={150} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ticket list */}
        <div className="lg:col-span-2">
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
                <div className="flex items-start gap-3">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${t.status === 'Open' ? 'bg-amber-50 text-amber-600' : 'bg-accent-50 text-accent-600'}`}>
                    {t.status === 'Open' ? <Clock className="h-3.5 w-3.5" strokeWidth={1.5} /> : <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.5} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-navy-800" title={t.subject}>{t.subject}</p>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${PRIORITY_CLS[t.priority]}`}>
                          {t.priority}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${t.status === 'Open' ? 'bg-amber-50 text-amber-600' : 'bg-accent-50 text-accent-600'}`}>
                          {t.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">{t.id}</span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[11px] text-slate-400">{t.date}</span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[11px] text-slate-400">{(() => { const Icon = CATEGORY_ICONS[t.category]; return Icon ? <Icon className="inline h-3 w-3 mr-0.5 -mt-0.5" strokeWidth={1.5} /> : null })()} {t.category}</span>
                    </div>
                    {t.status === 'Open' && (
                      <button className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-aqua-700 hover:text-aqua-800">
                        <MessageSquare className="h-3 w-3" strokeWidth={1.5} /> Add Response
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Raise ticket form */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-navy-800">
              <LifeBuoy className="h-3.5 w-3.5 text-aqua-600" strokeWidth={1.5} /> Raise a Ticket
            </h2>
            <form onSubmit={submit} className="space-y-3">
              <div>
                <span className="mb-1 block text-xs font-semibold text-slate-500">Priority</span>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                        priority === p
                          ? PRIORITY_SELECTED_CLS[p]
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <input
                value={subject}
                onChange={(e) => { setSubject(e.target.value); setErrors((p) => ({ ...p, subject: '' })) }}
                placeholder="Subject"
                required
                className={`w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-aqua-400 focus:bg-white ${errors.subject ? 'border-red-300' : ''}`}
              />
              {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
              <textarea
                value={message}
                onChange={(e) => { setMessage(e.target.value); setErrors((p) => ({ ...p, message: '' })) }}
                placeholder="Describe your issue…"
                rows={4}
                className={`w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-aqua-400 focus:bg-white ${errors.message ? 'border-red-300' : ''}`}
              />
              {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-aqua-500 to-navy-800 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} /> Submit Ticket
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
