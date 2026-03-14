import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from './components/UI'
import LandingPage from './pages/LandingPage'
import AuthPage    from './pages/AuthPage'
import AppPage     from './pages/AppPage'
import './index.css'

// HashRouter is used so GitHub Pages works without a custom 404.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"    element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/app"  element={<AppPage />} />
          <Route path="*"     element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
)
