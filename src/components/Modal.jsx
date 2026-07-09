import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

/**
 * Modal — generic centered dialog.
 * Closes on backdrop click + Escape, locks body scroll, traps Tab focus,
 * and restores focus to the previously-focused element on close.
 *
 * Rendered via a portal straight into document.body — several pages mount
 * inside <main className="animate-fade-up">, whose entrance animation has
 * fill-mode "forwards" and so leaves `transform: translateY(0)` set on
 * <main> permanently. Any non-`none` transform on an ancestor creates a new
 * containing block for `position: fixed` descendants, which silently
 * re-anchors a non-portaled modal to <main>'s box instead of the viewport —
 * the popup ends up positioned far down the page instead of centered on
 * screen. Portaling sidesteps that ancestor entirely.
 */
export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  const panelRef = useRef(null)
  const lastFocused = useRef(null)
  // Keep the latest onClose without it being an effect dependency — AuthModal
  // (and others) pass a new `close` function identity on every render, which
  // previously re-ran this effect on every keystroke and yanked focus back
  // to the first focusable element (e.g. the Back button) mid-typing.
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    lastFocused.current = document.activeElement

    const panel = panelRef.current
    const focusables = () =>
      panel?.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')

    // Move focus into the dialog.
    focusables()?.[0]?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') return onCloseRef.current()
      if (e.key !== 'Tab') return
      const items = focusables()
      if (!items || items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      lastFocused.current?.focus?.()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-navy-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        ref={panelRef}
        className={`relative w-full ${maxWidth} max-h-[92vh] overflow-y-auto rounded-t-3xl bg-white shadow-lift animate-fade-up sm:rounded-3xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
          <h2 className="text-lg font-bold text-navy-800">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-navy-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
