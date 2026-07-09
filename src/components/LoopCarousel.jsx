import { useState, useEffect, useRef } from 'react'

/**
 * LoopCarousel — generic auto-advancing, swipeable banner carousel.
 * Loops in one direction only: a clone of slide 0 is appended after the
 * last real slide, so auto-advance always slides forward, then snaps
 * instantly (no transition) back to the real slide 0 once the clone is
 * fully in view — the viewer never sees it slide backwards.
 */
export default function LoopCarousel({ slides, heightClass = 'h-40 sm:h-44 lg:h-52', intervalMs = 5000, onSlideClick, className = '' }) {
  const realCount = slides.length
  const [index, setIndex] = useState(0)
  const [instant, setInstant] = useState(false)
  const touchX = useRef(null)
  const swiping = useRef(false)

  useEffect(() => {
    if (realCount <= 1) return
    const t = setInterval(() => setIndex((i) => (i >= realCount ? i : i + 1)), intervalMs)
    return () => clearInterval(t)
  }, [realCount, intervalMs])

  const onTransitionEnd = () => {
    if (index === realCount) {
      setInstant(true)
      setIndex(0)
    }
  }
  useEffect(() => {
    if (!instant) return
    const raf = requestAnimationFrame(() => setInstant(false))
    return () => cancelAnimationFrame(raf)
  }, [instant])

  // Safety net: force a clean snap back once the tab becomes visible again
  // if it's stuck on the clone (transitionend doesn't fire on hidden tabs).
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

  const goTo = (i) => setIndex(i)

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; swiping.current = false }
  const onTouchMove = (e) => {
    if (touchX.current == null) return
    if (Math.abs(e.touches[0].clientX - touchX.current) > 10) swiping.current = true
  }
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) {
      const current = index % realCount
      goTo(dx < 0 ? (current + 1) % realCount : (current - 1 + realCount) % realCount)
    }
    touchX.current = null
  }

  const handleClick = () => {
    if (swiping.current) { swiping.current = false; return }
    onSlideClick?.()
  }

  if (realCount === 0) return null

  return (
    <div
      className={`group relative w-full overflow-hidden rounded-2xl shadow-soft transition-all duration-300 hover:shadow-lift ${className}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        onTransitionEnd={onTransitionEnd}
        className={`flex ${heightClass} ${instant ? '' : 'transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]'}`}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            role={onSlideClick ? 'button' : undefined}
            tabIndex={onSlideClick ? 0 : undefined}
            onClick={onSlideClick ? handleClick : undefined}
            className="relative h-full min-w-full"
          >
            {slide}
          </div>
        ))}
        {/* Trailing clone of slide 0 — only used to keep the loop sliding forward */}
        {realCount > 1 && (
          <div aria-hidden="true" className="relative h-full min-w-full">
            {slides[0]}
          </div>
        )}
      </div>

      {realCount > 1 && (
        <div className="absolute bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {Array.from({ length: realCount }).map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); goTo(i) }}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full bg-white shadow transition-all ${
                index % realCount === i ? 'w-6 opacity-100' : 'w-1.5 opacity-50 hover:opacity-80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
