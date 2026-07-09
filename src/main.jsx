import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// Remove the static HTML splash screen (index.html). Called once React has
// painted — but also on a hard timeout so the loader can NEVER get stuck
// covering the page, even if something below throws before first paint.
function hideLoader() {
  const loader = document.getElementById('initial-loader')
  if (!loader) return
  loader.classList.add('loader-hide')
  setTimeout(() => loader.remove(), 500)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<App />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>,
)

requestAnimationFrame(() => requestAnimationFrame(hideLoader))
// Safety net — guarantee the splash is gone within 4s no matter what.
setTimeout(hideLoader, 4000)
