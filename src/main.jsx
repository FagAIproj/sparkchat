import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from './components/UI'
import LandingPage  from './pages/LandingPage'
import AuthPage     from './pages/AuthPage'
import AppPage      from './pages/AppPage'
import AuthCallback from './pages/AuthCallback'
import './index.css'

// ─────────────────────────────────────────────────────────────
// BUG FIX: Supabase email-confirm redirects to:
//   http://yoursite.com/#access_token=...&type=signup
//
// HashRouter treats everything after # as a route path, so it
// tries to match "access_token=..." as a page — and crashes.
//
// Fix: before React renders, detect if the raw hash contains a
// Supabase token and rewrite it to /#/auth/callback?<params>
// so HashRouter routes it to our AuthCallback page cleanly.
// ─────────────────────────────────────────────────────────────
const rawHash = window.location.hash
if (rawHash.includes('access_token=') || rawHash.includes('error_description=')) {
  const params = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash
  window.location.replace(`${window.location.pathname}#/auth/callback?${params}`)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"              element={<LandingPage />} />
          <Route path="/auth"          element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/app"           element={<AppPage />} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
)
