import { useState } from 'react'

/**
 * SmartImage — image with a shimmer skeleton until load, a smooth fade-in,
 * and a graceful fallback (e.g. the real category image) if the source 404s.
 *
 * Props:
 *  - src, alt, fallback (optional secondary src), className (wrapper),
 *    imgClassName (the <img> itself), eager (skip lazy-loading, for above-the-fold images).
 */
export default function SmartImage({ src, alt = '', fallback, className = '', imgClassName = '', eager = false }) {
  const [loaded, setLoaded] = useState(false)
  const [current, setCurrent] = useState(src)
  const [failed, setFailed] = useState(false)

  return (
    <span className={`relative block overflow-hidden ${className}`}>
      {/* Shimmer skeleton */}
      {!loaded && (
        <span className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200" />
      )}
      <img
        src={current}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        onError={() => {
          // Try the fallback once, then give up gracefully.
          if (fallback && !failed) {
            setFailed(true)
            setLoaded(false)
            setCurrent(fallback)
          } else {
            setLoaded(true)
          }
        }}
        className={`${imgClassName} transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </span>
  )
}
