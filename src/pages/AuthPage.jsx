import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../logo.png'
import { useAuth } from '../context/AuthContext'
import { Btn, Input, Spinner } from '../components/UI'

export default function AuthPage() {
  const navigate = useNavigate()
  const { signIn, signUp, signInWithGoogle } = useAuth()

  const [tab,      setTab]      = useState('login')   // 'login' | 'register'
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const [errors,   setErrors]   = useState({})
  const [msg,      setMsg]      = useState('')

  const validate = () => {
    const e = {}
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Valid email required'
    if (!password || password.length < 8) e.password = 'Min. 8 characters'
    if (tab === 'register' && password !== confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return !Object.keys(e).length
  }

  const submit = async () => {
    if (!validate()) return
    setLoading(true)
    setMsg('')

    if (tab === 'login') {
      const { error } = await signIn(email.trim(), password)
      if (error) { setErrors({ form: error.message }); setLoading(false) }
      else navigate('/app')
    } else {
      const { error } = await signUp(email.trim(), password)
      setLoading(false)
      if (error) { setErrors({ form: error.message }) }
      else setMsg('✅ Check your email for a confirmation link, then sign in.')
    }
  }

  const google = async () => {
    setGLoading(true)
    const { error } = await signInWithGoogle()
    if (error) { setErrors({ form: error.message }); setGLoading(false) }
    // redirect happens automatically via Supabase OAuth
  }

  const pwStrength = (() => {
    if (!password) return 0
    let s = 0
    if (password.length >= 8) s++
    if (/[A-Z]/.test(password)) s++
    if (/[0-9]/.test(password)) s++
    if (/[^A-Za-z0-9]/.test(password)) s++
    return s
  })()
  const strColors = ['#EF4444','#F59E0B','#22C55E','#16A34A']
  const strLabels = ['Weak','Fair','Good','Strong']

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      {/* bg glow */}
      <div style={{
        position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
        width:700, height:500,
        background:'radial-gradient(ellipse, rgba(255,107,0,0.09) 0%, transparent 70%)',
        pointerEvents:'none',
      }}/>

      <div className="scale-in" style={{
        width: '100%', maxWidth: 420,
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: 24,
        padding: '40px 36px',
        position: 'relative', zIndex: 1,
        boxShadow: '0 24px 80px rgba(0,0,0,.5)',
      }}>
        {/* Logo + back */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <img src={logo} alt="SparkChat" style={{ width:36, height:36 }}/>
            <span style={{
              fontFamily:'var(--font-h)', fontWeight:800, fontSize:20,
              background:'linear-gradient(90deg,#FF6B00,#FFD700)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>SparkChat</span>
          </div>
          <button onClick={() => navigate('/')} style={{
            background:'none', border:'none', cursor:'pointer', color:'var(--text-3)',
            fontSize:22, lineHeight:1, padding:4, transition:'color .2s',
          }} onMouseEnter={e=>e.target.style.color='var(--text)'} onMouseLeave={e=>e.target.style.color='var(--text-3)'}>
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{
          display:'flex', background:'var(--surface)', borderRadius:'var(--r-full)',
          padding:3, marginBottom:28,
        }}>
          {['login','register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setErrors({}); setMsg('') }}
              style={{
                flex:1, padding:'9px 0', borderRadius:'var(--r-full)', border:'none',
                cursor:'pointer', fontFamily:'var(--font-b)', fontWeight:600, fontSize:14,
                transition:'all .2s',
                background: tab === t ? 'linear-gradient(135deg,#FF6B00,#FF4500)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--text-2)',
                boxShadow: tab === t ? '0 3px 12px rgba(255,107,0,.3)' : 'none',
              }}>
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Success msg */}
        {msg && (
          <div style={{
            background:'rgba(34,197,94,.12)', border:'1px solid rgba(34,197,94,.3)',
            borderRadius:10, padding:'11px 14px', marginBottom:16,
            fontSize:13, color:'#86efac', lineHeight:1.5,
          }}>{msg}</div>
        )}

        {/* Form error */}
        {errors.form && (
          <div style={{
            background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.25)',
            borderRadius:10, padding:'11px 14px', marginBottom:16,
            fontSize:13, color:'#fca5a5',
          }}>{errors.form}</div>
        )}

        {/* Fields */}
        <Input label="Email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="you@email.com" type="email" icon="✉️" error={errors.email}
          onKeyDown={e => e.key === 'Enter' && submit()} />

        <Input label="Password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder={tab === 'register' ? 'Min. 8 characters' : '••••••••'}
          type={showPw ? 'text' : 'password'} icon="🔒" error={errors.password}
          onKeyDown={e => e.key === 'Enter' && submit()}
          rightEl={
            <button onClick={() => setShowPw(p => !p)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', fontSize:16, padding:2 }}>
              {showPw ? '🙈' : '👁️'}
            </button>
          }
        />

        {/* Password strength */}
        {tab === 'register' && password.length > 0 && (
          <div style={{ marginTop:-8, marginBottom:14 }}>
            <div style={{ display:'flex', gap:4, marginBottom:4 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{
                  flex:1, height:3, borderRadius:2,
                  background: i <= pwStrength ? strColors[pwStrength-1] : 'var(--border)',
                  transition:'background .3s',
                }}/>
              ))}
            </div>
            {pwStrength > 0 && <p style={{ fontSize:11, color: strColors[pwStrength-1] }}>{strLabels[pwStrength-1]} password</p>}
          </div>
        )}

        {tab === 'register' && (
          <Input label="Confirm Password" value={confirm} onChange={e => setConfirm(e.target.value)}
            placeholder="Repeat password" type={showPw ? 'text' : 'password'} icon="🛡️"
            error={errors.confirm} onKeyDown={e => e.key === 'Enter' && submit()} />
        )}

        <Btn onClick={submit} loading={loading} style={{ width:'100%', marginBottom:16 }}>
          {tab === 'login' ? 'Sign In' : 'Create Account'}
        </Btn>

        {/* Divider */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
          <div style={{ flex:1, height:1, background:'var(--border)' }}/>
          <span style={{ fontSize:12, color:'var(--text-3)' }}>or</span>
          <div style={{ flex:1, height:1, background:'var(--border)' }}/>
        </div>

        {/* Google */}
        <button onClick={google} disabled={gLoading}
          style={{
            width:'100%', padding:'11px 0',
            background:'var(--surface)', border:'1px solid var(--border)',
            borderRadius:'var(--r-full)', cursor: gLoading ? 'wait' : 'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:10,
            color:'var(--text)', fontSize:14, fontWeight:600, fontFamily:'var(--font-b)',
            transition:'all .2s',
          }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--border-warm)'; e.currentTarget.style.background='var(--surface-2)' }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--surface)' }}>
          {gLoading
            ? <><Spinner size={16}/> Opening Google…</>
            : <><GoogleIcon/> Continue with Google</>
          }
        </button>

        <p style={{ textAlign:'center', fontSize:12, color:'var(--text-3)', marginTop:20, lineHeight:1.6 }}>
          By continuing, you agree to SparkChat's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
