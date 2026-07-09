import { useEffect, useRef } from 'react'

/**
 * useScrollReveal — adds `.is-visible` to the element when it scrolls into view.
 * Pairs with the `.reveal` utility class in index.css for a fade/slide-up entrance.
 * Respects `prefers-reduced-motion` by revealing immediately.
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      el.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            obs.unobserve(entry.target) // reveal once, then stop watching
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px', ...options },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
