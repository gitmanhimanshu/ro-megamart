import { useEffect, useRef } from 'react'
import { CheckCircle2 } from 'lucide-react'

/**
 * Toast — tiny transient confirmation (e.g. "Enquiry sent").
 * Auto-dismisses; purely visual feedback, no real network call.
 */
export default function Toast({ message, onDone, duration = 2200 }) {
  // onDone is typically a fresh inline function every parent render — keep
  // it in a ref so the dismiss timer only (re)starts when the message
  // itself changes, not on every unrelated re-render of the app.
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => onDoneRef.current(), duration)
    return () => clearTimeout(t)
  }, [message, duration])

  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full bg-navy-900 px-5 py-3 text-sm font-medium text-white shadow-lift animate-fade-up"
    >
      <CheckCircle2 className="h-4 w-4 text-accent-400" />
      {message}
    </div>
  )
}
