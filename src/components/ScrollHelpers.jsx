import { useEffect, useState } from 'react'
import { ArrowUp, ArrowUpRight, Smartphone, X } from 'lucide-react'
import { storeUrlForDevice } from '../utils/storeLinks'
import { isDismissed, dismissFor } from '../utils/dismissible'

const APP_CARD_DISMISS_KEY = 'rm_app_card_dismissed'
const APP_CARD_FIRST_DELAY_MS = 4000
const APP_CARD_REPEAT_MS = 45000
const APP_CARD_VISIBLE_MS = 8000

/**
 * ScrollProgress — thin gradient bar at the very top showing read progress.
 */
export function ScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setPct(max > 0 ? (h.scrollTop / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-[65] h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-aqua-500 via-aqua-400 to-accent-500 transition-[width] duration-150"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

/**
 * BackToTop — floating left-side stack. Neither button is shown until the
 * shopper actually scrolls: the "Download App" icon slides in from off the
 * left edge with a one-time overshoot/spring bounce + fade-in, then settles
 * and stays still (no infinite animation sitting on top of page content),
 * and the scroll-to-top arrow fades/slides up above it once they're further
 * down the page. Both are compact with a crisp white ring so they read as a
 * floating control rather than blending into whatever scrolls underneath,
 * and sit above the mobile bottom nav on small screens.
 *
 * On top of the icon, a richer "Explore on the go" card resurfaces every
 * APP_CARD_REPEAT_MS while the icon is visible — a few seconds after it
 * first appears, then periodically — so the app stays discoverable without
 * being a one-shot popup. Dismissing it via the ✕ hides it for 24 hours,
 * then it starts resurfacing again.
 */
export function BackToTop() {
  const [scrollY, setScrollY] = useState(0)
  const [showCard, setShowCard] = useState(false)
  const [cardDismissed, setCardDismissed] = useState(
    () => isDismissed(APP_CARD_DISMISS_KEY),
  )

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const showApp = scrollY > 150
  const showTop = scrollY > 600

  useEffect(() => {
    if (!showApp || cardDismissed) { setShowCard(false); return }
    let hideTimer
    const reveal = () => {
      setShowCard(true)
      hideTimer = setTimeout(() => setShowCard(false), APP_CARD_VISIBLE_MS)
    }
    const firstTimer = setTimeout(reveal, APP_CARD_FIRST_DELAY_MS)
    const repeatTimer = setInterval(reveal, APP_CARD_REPEAT_MS)
    return () => {
      clearTimeout(firstTimer)
      clearInterval(repeatTimer)
      clearTimeout(hideTimer)
    }
  }, [showApp, cardDismissed])

  const dismissCard = () => {
    dismissFor(APP_CARD_DISMISS_KEY)
    setCardDismissed(true)
    setShowCard(false)
  }

  return (
    <div className="fixed bottom-20 left-6 z-[55] flex flex-col items-center gap-3 md:bottom-6 md:left-8">
      {showCard && (
        <div className="absolute bottom-full left-0 z-10 mb-3.5 w-[78vw] max-w-[260px] animate-fade-up rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-aqua-700 p-4 text-left shadow-lift sm:w-72 sm:max-w-none">
          <button
            onClick={dismissCard}
            aria-label="Dismiss"
            className="absolute right-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <p className="pr-6 text-base font-extrabold text-white">Want your work made easy?</p>
          <p className="mt-1 text-xs leading-relaxed text-aqua-100/80">Download the app and manage your business on the go.</p>
          <a
            href={storeUrlForDevice()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-navy-900 transition-transform hover:-translate-y-0.5"
          >
            Download App <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          {/* Speech-bubble pointer toward the icon below */}
          <span className="absolute -bottom-1.5 left-6 h-3 w-3 rotate-45 bg-aqua-700" />
        </div>
      )}

      <a
        href={storeUrlForDevice()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download the Romegamart App"
        aria-hidden={!showApp}
        tabIndex={showApp ? 0 : -1}
        className={`grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-aqua-500 to-accent-500 text-white shadow-lift ring-2 ring-white transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 ${
          showApp ? 'translate-x-0 opacity-100' : '-translate-x-24 opacity-0 pointer-events-none'
        }`}
      >
        <Smartphone className="h-5 w-5" />
      </a>
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="grid h-12 w-12 animate-fade-up place-items-center rounded-full bg-navy-800 text-white shadow-lift ring-2 ring-white transition-all hover:-translate-y-0.5 hover:bg-navy-700"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
