import React, { useState } from 'react'

/* ─── Avatar ─────────────────────────────────────────────── */
export function Avatar({ src, name = '?', size = 40, online, style }) {
  const initials = (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const hue = (name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0, ...style }}>
      {src
        ? <img src={src} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
        : <div style={{
            width: size, height: size, borderRadius: '50%',
            background: `hsl(${hue},50%,32%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.36, fontWeight: 700, color: '#fff',
            fontFamily: 'var(--font-h)',
          }}>{initials}</div>
      }
      {online !== undefined && (
        <span style={{
          position: 'absolute', bottom: 1, right: 1,
          width: size * 0.26, height: size * 0.26,
          borderRadius: '50%',
          background: online ? 'var(--online)' : 'var(--text-3)',
          border: '2px solid var(--panel)',
        }} />
      )}
    </div>
  )
}

/* ─── Button ──────────────────────────────────────────────── */
export function Btn({ children, onClick, variant = 'primary', size = 'md', loading, disabled, style, icon }) {
  const [hov, setHov] = useState(false)
  const isDisabled = disabled || loading

  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    fontFamily: 'var(--font-b)', fontWeight: 600, cursor: isDisabled ? 'not-allowed' : 'pointer',
    border: 'none', borderRadius: 'var(--r-full)', transition: 'all .2s ease',
    opacity: isDisabled ? 0.5 : 1,
    transform: hov && !isDisabled ? 'translateY(-1px)' : 'none',
  }
  const sizes   = { sm: { padding: '7px 16px', fontSize: 13 }, md: { padding: '11px 24px', fontSize: 15 }, lg: { padding: '14px 32px', fontSize: 16 } }
  const variants = {
    primary: { background: hov ? 'linear-gradient(135deg,#ff8c00,#e03b00)' : 'linear-gradient(135deg,#FF6B00,#FF4500)', color: '#fff', boxShadow: hov ? '0 6px 24px rgba(255,107,0,.45)' : '0 3px 14px rgba(255,107,0,.3)' },
    secondary: { background: hov ? 'var(--surface-2)' : 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' },
    ghost: { background: 'transparent', color: hov ? 'var(--spark)' : 'var(--text-2)', padding: sizes[size].padding },
    danger: { background: hov ? '#dc2626' : 'var(--danger)', color: '#fff' },
    success: { background: hov ? '#16a34a' : 'var(--success)', color: '#fff' },
  }

  return (
    <button onClick={onClick} disabled={isDisabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {loading ? <Spinner size={14} /> : icon}
      {children}
    </button>
  )
}

/* ─── Input ───────────────────────────────────────────────── */
export function Input({ value, onChange, placeholder, type = 'text', label, error, icon, rightEl, style, autoFocus, maxLength, onKeyDown }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: 14, ...style }}>
      {label && <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>}
      <div style={{
        display: 'flex', alignItems: 'center',
        background: 'var(--surface)', borderRadius: 'var(--r-md)',
        border: `1px solid ${error ? 'var(--danger)' : focused ? 'var(--border-warm)' : 'var(--border)'}`,
        transition: 'border-color .2s',
        boxShadow: focused ? '0 0 0 3px rgba(255,107,0,.08)' : 'none',
      }}>
        {icon && <span style={{ paddingLeft: 12, color: 'var(--text-3)', fontSize: 16, flexShrink: 0 }}>{icon}</span>}
        <input value={value} onChange={onChange} placeholder={placeholder} type={type}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          autoFocus={autoFocus} maxLength={maxLength} onKeyDown={onKeyDown}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--text)', fontSize: 14, padding: '11px 12px',
            fontFamily: 'var(--font-b)',
          }} />
        {rightEl && <div style={{ paddingRight: 10, flexShrink: 0 }}>{rightEl}</div>}
      </div>
      {error && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 5 }}>{error}</p>}
    </div>
  )
}

/* ─── Spinner ─────────────────────────────────────────────── */
export function Spinner({ size = 20, color = 'var(--spark)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ animation: 'spin 0.7s linear infinite' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="3" strokeDasharray="50" strokeDashoffset="20" strokeLinecap="round" />
    </svg>
  )
}

/* ─── Empty state ─────────────────────────────────────────── */
export function Empty({ icon, title, sub }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12, opacity: 0.7 }}>
      <div style={{ fontSize: 40 }}>{icon}</div>
      <p style={{ fontFamily: 'var(--font-h)', fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>{title}</p>
      {sub && <p style={{ fontSize: 13, color: 'var(--text-2)', textAlign: 'center', lineHeight: 1.6 }}>{sub}</p>}
    </div>
  )
}

/* ─── Toast ───────────────────────────────────────────────── */
let _toast = null
export function setToastRef(fn) { _toast = fn }
export function toast(msg, type = 'info') { _toast?.(msg, type) }

export function ToastContainer() {
  const [items, setItems] = useState([])
  useEffect(() => {
    setToastRef((msg, type) => {
      const id = Date.now()
      setItems(p => [...p, { id, msg, type }])
      setTimeout(() => setItems(p => p.filter(t => t.id !== id)), 3500)
    })
  }, [])

  const colors = { info: 'var(--surface-2)', success: '#14532d', error: '#450a0a' }
  const icons  = { info: 'ℹ️', success: '✅', error: '❌' }

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map(t => (
        <div key={t.id} className="scale-in" style={{
          background: colors[t.type], border: '1px solid var(--border)',
          borderRadius: 12, padding: '11px 18px',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,.4)',
          fontSize: 14, color: 'var(--text)',
        }}>
          <span>{icons[t.type]}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  )
}

// need useEffect for ToastContainer
import { useEffect } from 'react'
