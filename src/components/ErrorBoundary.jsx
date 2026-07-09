import { Component } from 'react'

/**
 * ErrorBoundary — catches any runtime render error in the tree below it and
 * shows a friendly recovery screen instead of a blank white page. Without
 * this, a single thrown error unmounts the whole app and leaves nothing
 * visible ("screen crash, kuch dikh nahi raha").
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Surface it in the console for debugging.
    console.error('App crashed:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-aqua-50 text-3xl">💧</div>
          <h1 className="text-xl font-bold text-navy-900">Something went wrong</h1>
          <p className="max-w-sm text-sm text-slate-500">
            The page hit an unexpected error. Reloading usually fixes it.
          </p>
          {this.state.error?.message && (
            <pre className="max-w-md overflow-x-auto rounded-lg bg-slate-100 p-3 text-left text-[11px] text-red-500">
              {String(this.state.error.message)}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded-lg bg-gradient-to-r from-aqua-500 to-navy-800 px-6 py-3 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5"
          >
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
