import { useState, useRef, useEffect } from 'react'
import {
  Bot, X, Send, Sparkles, PackageSearch, Truck, MessageSquareText, SearchCheck,
  History, Heart, ShoppingCart, Package,
} from 'lucide-react'
import { sendGlobalMessage } from '../lib/globalSend'
import { CATEGORIES, PRODUCT_INDEX } from '../data'

const ALL_PRODUCTS = Object.values(PRODUCT_INDEX)

// Tiny local "AI" — no LLM call, just keyword matching against our own
// product/category data, fast and free. Good enough to feel like a real
// assistant for a catalogue this size.
function findAnswer(query) {
  const q = query.trim().toLowerCase()
  if (!q) return { products: [], category: null }
  const products = ALL_PRODUCTS
    .filter((p) => `${p.name} ${p.catName} ${p.brand || ''} ${p.seller}`.toLowerCase().includes(q))
    .slice(0, 3)
  const category = CATEGORIES.find((c) => c.name.toLowerCase().includes(q) || q.includes(c.name.toLowerCase()))
  return { products, category }
}

// Small local FAQ knowledge base — common RO-industry & marketplace
// questions, matched by keyword. Runs only when no product/category match
// is found, so it doesn't interfere with catalogue search.
const FAQS = [
  { keywords: ['what is tds', 'tds meaning', 'tds kya'], answer: 'TDS (Total Dissolved Solids) measures dissolved salts and minerals in water, in ppm. Most Indian tap/borewell water ranges 200–2000+ ppm — RO systems bring this down to safe drinking levels (usually under 100 ppm).' },
  { keywords: ['what is gpd', 'gpd meaning', 'gpd kya'], answer: "GPD (Gallons Per Day) is an RO membrane's rated output — e.g. an 80 GPD membrane produces roughly 80 gallons (~300 litres) of purified water per day under test conditions." },
  { keywords: ['how does ro work', 'how ro works', 'what is reverse osmosis', 'reverse osmosis kaise'], answer: 'Reverse Osmosis pushes water through a semi-permeable membrane under pressure, blocking dissolved salts, heavy metals and contaminants while letting clean water pass — usually paired with sediment, carbon and UV stages for complete purification.' },
  { keywords: ['delivery time', 'how many days', 'shipping time', 'kab tak deliver'], answer: 'Delivery time depends on the seller and your location — most B2B orders are dispatched within 2–5 business days, with PAN-India delivery available.' },
  { keywords: ['return policy', 'refund', 'return kr sakte'], answer: "Returns/refunds are handled directly with the seller per their listed policy — check the product page, or use 'Get Wholesale Price' to ask the seller directly." },
  { keywords: ['moq', 'minimum order', 'minimum quantity'], answer: 'MOQ (Minimum Order Quantity) varies by product and seller — check the product detail page for the listed MOQ, or see the wholesale pricing tiers for bulk rates.' },
  { keywords: ['payment method', 'how to pay', 'cod available', 'upi payment'], answer: 'We support UPI, Credit/Debit Card, Net Banking and Cash on Delivery (COD) at checkout.' },
  { keywords: ['gst invoice', 'gst number', 'gst bill'], answer: "Yes — add your GST number at checkout, and download a GST-ready invoice anytime from 'My Orders' once your order is placed." },
  { keywords: ['become a seller', 'sell on romegamart', 'seller registration', 'seller kaise bane'], answer: 'To sell on Romegamart, choose Seller during registration and complete KYC (business card / GST verification) — once verified you get full access to the Seller Dashboard.' },
  { keywords: ['wholesale price', 'bulk price', 'bulk discount', 'wholesale kya'], answer: "Most products show tiered wholesale pricing (1–9 / 10–49 / 50+ pcs) right on the product page — tap a tier to see the discounted rate, or use 'Get Wholesale Price' for custom large-quantity quotes." },
]

function findFAQ(query) {
  const q = query.trim().toLowerCase()
  return FAQS.find((f) => f.keywords.some((k) => q.includes(k)))
}

// Greeting / small-talk detector — handled locally so a plain "hi" always
// gets a warm welcome instead of random product matches or a dead-end.
const GREETING_RE = /^(hi+|he+y+|he?llo+|helo|hii+|namaste|namaskar|hola|yo|good\s*(morning|afternoon|evening)|gm|gn)[\s!.]*$/i
const GREETING_REPLY =
  "Hello there! 👋 Great to connect with you. I'm AquaBot, your friendly guide from Romegamart — " +
  "India's #1 B2B marketplace for the RO industry. How can I help you explore our range of RO spares, " +
  'systems and solutions today? You can ask me about any product, or use the quick actions below!'

// Local AI proxy (server/index.js) — keeps the real Gemini key server-side.
// Run with `npm run server`. If it isn't running, askBot() falls back to
// the local FAQ list below, so the assistant still works either way.
const AI_ENDPOINT = 'http://localhost:5179/api/ask'

// Streams the reply — calls onStart() once the connection is confirmed
// (safe to show a live bubble), then onChunk(accumulatedText) per token.
async function streamAI(query, onStart, onChunk) {
  const res = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  if (!res.ok || !res.body) throw new Error('AI request failed')

  onStart()
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let full = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    full += decoder.decode(value, { stream: true })
    onChunk(full)
  }
  if (!full.trim()) throw new Error('Empty AI response')
  return full
}

/**
 * AssistantWidget - "AquaBot", a floating RO assistant on the bottom-right.
 * Greets the user, answers free-text product/category questions with real
 * matches from our catalogue, offers quick actions, and collects an enquiry.
 */
export default function AssistantWidget({
  open, setOpen, onTrack, onToast, onPickProduct, onPickCategory,
  user, hasRecentlyViewed, onShowRecentlyViewed, onOpenWishlist, onOpenCart, onOpenOrders, onRequireLogin,
}) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm AquaBot - your RO assistant. Ask me about any product, or use the quick actions below." },
  ])
  const [askText, setAskText] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showEnquiryForm, setShowEnquiryForm] = useState(false)
  const [asking, setAsking] = useState(false)
  const bodyRef = useRef(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sent, open])

  const say = (from, text, extra = {}) => setMessages((current) => [...current, { from, text, ...extra }])

  const scrollToCategories = () => {
    setOpen(false)
    document.getElementById('categories-grid')?.scrollIntoView({ behavior: 'smooth' })
  }

  const showRecentlyViewed = () => {
    if (!hasRecentlyViewed) {
      say('bot', "You haven't viewed any products yet. Browse our categories and they'll show up here for quick access next time!")
      return
    }
    setOpen(false)
    onShowRecentlyViewed?.()
  }

  const goToWishlist = () => { setOpen(false); onOpenWishlist?.() }
  const goToCart = () => { setOpen(false); onOpenCart?.() }
  const goToOrders = () => {
    setOpen(false)
    if (!user) { onRequireLogin?.(); return }
    onOpenOrders?.()
  }

  const askBot = async (e) => {
    e.preventDefault()
    const q = askText.trim()
    if (!q || asking) return
    say('user', q)
    setAskText('')

    // Greetings get a warm welcome (handled before catalogue search so a
    // plain "hi" never returns random products that happen to contain "hi").
    if (GREETING_RE.test(q)) {
      say('bot', GREETING_REPLY)
      return
    }

    // Direct product/category matches stay instant and local — they're more
    // useful as a precise catalogue jump than a generated answer.
    const { products, category } = findAnswer(q)
    if (products.length > 0) {
      say('bot', `Here's what I found for "${q}":`, { products })
      return
    }
    if (category) {
      say('bot', `We have a full "${category.name}" category with ${category.subcategories?.length || 0} sub-categories — check it out!`, { category })
      return
    }

    // Otherwise, ask the real AI (Gemini, via our local server-side proxy) —
    // streamed token-by-token into a live bubble.
    setAsking(true)
    let bubbleAdded = false
    try {
      await streamAI(
        q,
        () => { say('bot', '', { streaming: true }); bubbleAdded = true },
        (partial) => {
          setMessages((current) => {
            const next = [...current]
            next[next.length - 1] = { ...next[next.length - 1], text: partial, streaming: true }
            return next
          })
        },
      )
      // Streaming finished — drop the blinking cursor.
      setMessages((current) => {
        const next = [...current]
        next[next.length - 1] = { ...next[next.length - 1], streaming: false }
        return next
      })
    } catch {
      // AI server not running/unreachable, or returned nothing — remove any
      // half-streamed bubble and fall back to the local FAQ list.
      if (bubbleAdded) setMessages((current) => current.slice(0, -1))
      const faq = findFAQ(q)
      if (faq) {
        say('bot', faq.answer)
      } else {
        say('bot', `I couldn't find an exact match for "${q}". Try browsing our categories below, or make an enquiry and our team will help you find it.`)
        setShowEnquiryForm(true)
      }
    } finally {
      setAsking(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()

    if (!/^\d{10}$/.test(form.phone)) {
      say('bot', 'Please enter a valid 10-digit phone number so our team can reach you.')
      return
    }

    setSubmitting(true)

    try {
      await sendGlobalMessage({
        source: 'aquabot-enquiry',
        name: form.name,
        email: form.email,
        phone: form.phone,
      })
    } catch (error) {
      say('bot', error.message || 'We could not send your enquiry right now. Please try again.')
      setSubmitting(false)
      return
    }

    say('user', `Name: ${form.name} | ${form.email} | ${form.phone}`)
    say('bot', `Thanks ${form.name.split(' ')[0] || 'there'}! Your enquiry is received. Our RO experts will contact you at ${form.phone} shortly.`)
    setSent(true)
    setSubmitting(false)
    onToast?.('Enquiry sent - AquaBot will connect you with a seller soon.')
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open AquaBot assistant"
          className="group fixed bottom-20 right-4 z-[60] flex items-center gap-2 rounded-full bg-gradient-to-r from-aqua-500 to-navy-800 py-3 pl-3 pr-4 text-white shadow-lift transition-all hover:-translate-y-0.5 md:bottom-6 md:right-6"
        >
          <span className="relative grid h-8 w-8 place-items-center rounded-full bg-white/20">
            <Bot className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent-400 ring-2 ring-navy-800" />
          </span>
          <span className="text-sm font-semibold">Ask AquaBot</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-20 right-4 z-[60] flex h-[70vh] max-h-[560px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-lift animate-fade-up md:bottom-6 md:right-6">
          <div className="flex items-center gap-3 bg-gradient-to-r from-aqua-500 to-navy-800 px-4 py-3 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
              <Bot className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold leading-tight">AquaBot</p>
              <p className="flex items-center gap-1 text-[11px] text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400" /> RO Assistant | Online
              </p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant" className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white/20">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.from === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-snug shadow-soft ${
                    m.from === 'user'
                      ? 'rounded-br-md bg-navy-800 text-white'
                      : 'rounded-bl-md bg-white text-navy-800'
                  }`}
                >
                  {m.text}
                  {m.streaming && <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-aqua-500 align-middle" />}
                </div>

                {/* Inline product suggestions returned by the local search */}
                {m.products?.length > 0 && (
                  <div className="mt-2 w-full max-w-[85%] space-y-2">
                    {m.products.map((p) => (
                      <button
                        key={p.key}
                        onClick={() => { setOpen(false); onPickProduct?.(p) }}
                        className="flex w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2 text-left shadow-soft transition-colors hover:border-aqua-300"
                      >
                        <img src={p.image} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-navy-800">{p.name}</span>
                          <span className="block truncate text-[11px] text-slate-400">{p.catName}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Inline category suggestion */}
                {m.category && (
                  <button
                    onClick={() => { setOpen(false); onPickCategory?.(m.category.id) }}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-aqua-500 to-navy-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5"
                  >
                    <PackageSearch className="h-3.5 w-3.5" /> View {m.category.name}
                  </button>
                )}
              </div>
            ))}

            {/* Typing indicator — only before the streaming bubble appears;
                once it does, its own blinking cursor takes over. */}
            {asking && !messages[messages.length - 1]?.streaming && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-soft">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-aqua-400 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-aqua-400 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-aqua-400" />
                </div>
              </div>
            )}

            {!sent && !asking && (
              <div className="flex flex-wrap gap-2 pt-1">
                <Chip icon={PackageSearch} onClick={scrollToCategories}>Browse products</Chip>
                <Chip icon={History} onClick={showRecentlyViewed}>Recently viewed</Chip>
                <Chip icon={Heart} onClick={goToWishlist}>Wishlist</Chip>
                <Chip icon={ShoppingCart} onClick={goToCart}>My cart</Chip>
                {user?.role === 'buyer' && <Chip icon={Package} onClick={goToOrders}>My orders</Chip>}
                {onTrack && <Chip icon={Truck} onClick={() => { setOpen(false); onTrack() }}>Track order</Chip>}
                <Chip icon={MessageSquareText} onClick={() => { say('bot', 'Sure. Fill the quick form below and our team will get back to you.'); setShowEnquiryForm(true) }}>
                  Make an enquiry
                </Chip>
              </div>
            )}
          </div>

          {/* Ask-a-question — local keyword search over the real catalogue.
              Hidden once the enquiry form takes over, to keep the footer uncluttered. */}
          {!sent && !showEnquiryForm && (
            <form onSubmit={askBot} className="flex items-center gap-2 border-t border-slate-100 bg-white p-3">
              <div className="relative flex-1">
                <SearchCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={askText}
                  onChange={(e) => setAskText(e.target.value)}
                  disabled={asking}
                  placeholder={asking ? 'AquaBot is typing…' : "Ask in Hindi or English…"}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-navy-900 placeholder:text-slate-400 transition-colors focus:border-aqua-400 focus:bg-white disabled:opacity-60"
                />
              </div>
              <button type="submit" disabled={asking} aria-label="Ask AquaBot" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-navy-800 text-white transition-colors hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-60">
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}

          {sent ? (
            <div className="flex items-center gap-2 border-t border-slate-100 bg-white px-4 py-3 text-sm text-slate-600">
              <Sparkles className="h-4 w-4 text-accent-500" />
              We'll be in touch soon. Need anything else? Just browse away.
            </div>
          ) : showEnquiryForm ? (
            <form onSubmit={submit} className="space-y-2 border-t border-slate-100 bg-white p-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Quick enquiry</p>
                <button type="button" onClick={() => setShowEnquiryForm(false)} className="text-[11px] font-semibold text-aqua-600 hover:text-aqua-700">
                  ← Back to chat
                </button>
              </div>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className={inputCls}
              />
              <div className="flex gap-2">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email"
                  className={inputCls}
                />
                <input
                  required
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  placeholder="Phone"
                  className={`${inputCls} w-32`}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-aqua-500 to-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Send className="h-4 w-4" /> {submitting ? 'Sending...' : 'Send Enquiry'}
              </button>
            </form>
          ) : null}
        </div>
      )}
    </>
  )
}

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-navy-900 placeholder:text-slate-400 transition-colors focus:border-aqua-400 focus:bg-white'

function Chip({ icon: Icon, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-aqua-200 bg-white px-3 py-1.5 text-xs font-semibold text-aqua-700 transition-colors hover:bg-aqua-50"
    >
      <Icon className="h-3.5 w-3.5" /> {children}
    </button>
  )
}
