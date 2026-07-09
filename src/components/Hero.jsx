import { useEffect, useState, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { HERO_SLIDES } from '../data'
import SmartImage from './SmartImage'

/**
 * Hero — auto-rotating wide-banner carousel (≈2000×573).
 * Auto-advances every 4.5s, pauses on hover/focus, prev/next on desktop,
 * swipe + dots on mobile, arrow-key navigation for keyboard users.
 * Fully responsive, no cropping, no zoom — full banner artwork always visible.
 *
 * Auto-advance always moves forward, one direction only — at the loop point
 * (last slide → first) it never visually slides backward. A silent clone of
 * slide 0 is appended after the real slides; once the track lands on that
 * clone, we snap the index back to 0 instantly (transition disabled for one
 * frame) so the next auto-advance continues forward seamlessly.
 */
export default function Hero() {
  const realCount = HERO_SLIDES.length
  const slides = [...HERO_SLIDES, HERO_SLIDES[0]] // trailing clone for the seamless loop
  const [index, setIndex] = useState(0)
  const [instant, setInstant] = useState(false)
  const [paused, setPaused] = useState(false)
  const touchX = useRef(null)
  const swiping = useRef(false)

  // Manual navigation (prev/next, swipe, keyboard, dots) jumps straight to a
  // real slide — an instant backward jump on deliberate user action is
  // expected UX, unlike the auto-advance loop point.
  const go = useCallback((dir) => {
    setIndex((i) => {
      const current = i % realCount
      return (current + dir + realCount) % realCount
    })
  }, [realCount])

  useEffect(() => {
    if (paused) return
    // Never advance past the trailing clone — if a pending snap-back hasn't
    // landed yet (e.g. ticks queued up while the tab was backgrounded, where
    // CSS transitions don't run so onTrackTransitionEnd never fired), skip
    // this tick instead of overshooting past the last real slide into an
    // out-of-bounds index, which would render a blank gap.
    const t = setInterval(() => setIndex((i) => (i >= realCount ? i : i + 1)), 4500)
    return () => clearInterval(t)
  }, [paused, realCount])

  // Landed on the trailing clone — snap back to the real slide 0 with the
  // transition disabled, then re-enable it a frame later.
  const onTrackTransitionEnd = () => {
    if (index === realCount) { setInstant(true); setIndex(0) }
  }
  useEffect(() => {
    if (!instant) return
    const raf = requestAnimationFrame(() => setInstant(false))
    return () => cancelAnimationFrame(raf)
  }, [instant])

  // Safety net: if the tab was hidden long enough that the transitionend
  // event never fired (transitions don't run on hidden tabs), force a clean
  // snap back to a real slide the moment the tab becomes visible again,
  // rather than leaving the carousel stuck on the clone.
  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden && index >= realCount) {
        setInstant(true)
        setIndex(0)
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [index, realCount])

  // Swipe gestures for touch devices — tracks whether a real drag happened so
  // we can suppress the slide's click-through navigation on swipe-end.
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; swiping.current = false }
  const onTouchMove = (e) => {
    if (touchX.current == null) return
    if (Math.abs(e.touches[0].clientX - touchX.current) > 10) swiping.current = true
  }
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
    touchX.current = null
  }
  const onSlideClick = (e) => {
    // A real swipe just happened — don't also follow the link.
    if (swiping.current) { e.preventDefault(); swiping.current = false }
  }

  // Left/right arrow keys navigate when the carousel has focus.
  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
  }

  return (
    <section
      className="mx-auto max-w-7xl px-3 pt-2 sm:px-4 sm:pt-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchEnd={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured banners"
    >
      <div
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="group relative overflow-hidden rounded-xl bg-navy-900 shadow-lift outline-none ring-aqua-400 focus-visible:ring-2 sm:rounded-3xl"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides track — includes a trailing clone of slide 0 for the loop */}
        <div
          onTransitionEnd={onTrackTransitionEnd}
          className={`flex ${instant ? '' : 'transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]'}`}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <a
              key={i}
              href="#categories-grid"
              onClick={onSlideClick}
              /* container ratio matches the local carausal banners (1024×288)
                 → fills cleanly with no cropping. Scales responsively. */
              className="relative block aspect-[1024/288] min-w-full overflow-hidden"
              aria-hidden={i !== index}
              aria-label={slide.alt}
            >
              {/* No zoom — keeps the full banner artwork visible at all times. */}
              <SmartImage
                src={slide.image}
                alt={slide.alt}
                eager={i === 0}
                className="h-full w-full"
                imgClassName="h-full w-full object-cover object-center"
              />
              {/* Subtle bottom gradient — adds depth and helps the dots/progress bar read on bright photos */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-navy-900/35 to-transparent" />
            </a>
          ))}
        </div>

        {/* Slide counter */}
        {realCount > 1 && (
          <span className="absolute right-3 top-3 rounded-full bg-navy-900/55 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white backdrop-blur">
            {(index % realCount) + 1} / {realCount}
          </span>
        )}

        {/* Prev / Next — hidden on mobile (swipe / dots instead), shown on sm+ */}
        <button
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-navy-800 opacity-0 shadow-soft backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95 group-hover:opacity-100 group-focus-within:opacity-100 sm:grid"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-navy-800 opacity-0 shadow-soft backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95 group-hover:opacity-100 group-focus-within:opacity-100 sm:grid"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots — active one shows a live progress fill synced to the auto-advance timer */}
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-4">
          {HERO_SLIDES.map((_, i) => {
            const active = index % realCount === i
            return (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={active}
                className={`relative h-1.5 overflow-hidden rounded-full bg-white/35 shadow transition-all duration-300 ${
                  active ? 'w-8' : 'w-2 hover:bg-white/60'
                }`}
              >
                {active && (
                  <span
                    key={index}
                    className={`absolute inset-y-0 left-0 rounded-full bg-white animate-progress-fill ${
                      paused ? '[animation-play-state:paused]' : ''
                    }`}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
