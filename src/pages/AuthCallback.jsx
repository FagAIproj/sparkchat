import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Spinner } from '../components/UI'
import logo from '../logo.png'

// ─────────────────────────────────────────────────────────────
// AuthCallback — handles Supabase auth redirects
//
// Supabase sends users here after:
//   • Email confirmation (type=signup)
//   • Magic link login   (type=magiclink)
//   • Password reset     (type=recovery)
//
// Tokens arrive as query params (we moved them from hash in main.jsx):
//   /#/auth/callback?access_token=...&refresh_token=...&type=signup
// ─────────────────────────────────────────────────────────────
export default function AuthCallback() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [status, setStatus] = useState('Verifying your account…')
  const [error,  setError]  = useState(null)

  useEffect(() => {
    const handle = async () => {
      try {
        // Parse tokens from query string (we put them here in main.jsx)
        const params       = new URLSearchParams(location.search)
        const accessToken  = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        const type         = params.get('type')        // 'signup' | 'recovery' | 'magiclink'
        const errorDesc    = params.get('error_description')

        // Handle error from Supabase (e.g. expired link)
        if (errorDesc) {
          setError(decodeURIComponent(errorDesc.replace(/\+/g, ' ')))
          return
        }

        if (!accessToken || !refreshToken) {
          // No tokens — maybe user landed here directly. Try existing session.
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            navigate('/app', { replace: true })
          } else {
            navigate('/auth', { replace: true })
          }
          return
        }

        // Set the session using the tokens from the URL
        setStatus(type === 'recovery' ? 'Preparing password reset…' : 'Confirming your email…')

        const { error: sessionError } = await supabase.auth.setSession({
          access_token:  accessToken,
          refresh_token: refreshToken,
        })

        if (sessionError) {
          setError(sessionError.message)
          return
        }

        // Success — redirect based on type
        if (type === 'recovery') {
          setStatus('Redirecting to password reset…')
          navigate('/auth?mode=reset', { replace: true })
        } else {
          // signup or magiclink — go straight into the app
          setStatus('Welcome to SparkChat! 🔥')
          setTimeout(() => navigate('/app', { replace: true }), 800)
        }

      } catch (err) {
        setError(err?.message ?? 'Something went wrong. Please try signing in again.')
      }
    }

    handle()
  }, [navigate, location.search])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', gap: 20, padding: 24,
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 600, height: 400,
        background: 'radial-gradient(ellipse, rgba(255,107,0,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <img src={logo} alt="SparkChat" style={{
        width: 72, height: 72,
        filter: 'drop-shadow(0 0 24px rgba(255,107,0,0.5))',
        animation: 'floatY 3s ease-in-out infinite',
      }}/>
      <style>{`@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>

      {error ? (
        /* ── Error state ── */
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 16, padding: '20px 24px', marginBottom: 20,
          }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>😕</p>
            <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 20, fontWeight: 800, marginBottom: 8, color: 'var(--text)' }}>
              Link expired or invalid
            </h2>
            <p style={{ fontSize: 14, color: '#fca5a5', lineHeight: 1.6 }}>{error}</p>
          </div>
          <button onClick={() => navigate('/auth')} style={{
            padding: '12px 28px', borderRadius: 'var(--r-full)',
            background: 'linear-gradient(135deg,#FF6B00,#FF4500)',
            border: 'none', color: '#fff', fontWeight: 700,
            fontFamily: 'var(--font-b)', fontSize: 15, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(255,107,0,0.35)',
          }}>
            Back to Sign In
          </button>
        </div>
      ) : (
        /* ── Loading state ── */
        <div style={{ textAlign: 'center' }}>
          <Spinner size={32}/>
          <p style={{
            marginTop: 16, fontFamily: 'var(--font-h)', fontWeight: 700,
            fontSize: 18, color: 'var(--text)',
          }}>{status}</p>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6 }}>
            Just a moment…
          </p>
        </div>
      )}
    </div>
  )
}
