import React, { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Avatar, Btn, Input } from '../UI'

export function ProfilePanel() {
  const { profile, user, updateProfile, refreshProfile, signOut } = useAuth()
  const [editing,  setEditing]  = useState(false)
  const [username, setUsername] = useState(profile?.username ?? '')
  const [saving,   setSaving]   = useState(false)
  const [uploading,setUploading]= useState(false)
  const [err,      setErr]      = useState('')
  const [success,  setSuccess]  = useState('')
  const fileRef = useRef(null)

  const save = async () => {
    if (!username.trim() || username.trim().length < 3) { setErr('Username must be at least 3 characters'); return }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) { setErr('Only letters, numbers and underscores'); return }
    setSaving(true); setErr(''); setSuccess('')
    const { error } = await updateProfile({ username: username.trim() })
    setSaving(false)
    if (error) setErr(typeof error === 'string' ? error : 'Username may already be taken')
    else { setSuccess('Profile updated!'); setEditing(false) }
  }

  const pickAvatar = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { setErr('Image must be under 3 MB'); return }

    setUploading(true); setErr('')
    const ext  = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}.${ext}`

    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (upErr) { setErr(upErr.message); setUploading(false); return }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
    await updateProfile({ avatar_url: urlData.publicUrl })
    await refreshProfile()
    setUploading(false)
    setSuccess('Avatar updated!')
  }

  const copyCode = () => {
    navigator.clipboard.writeText(profile?.friend_code ?? '')
    setSuccess('Spark Code copied!')
    setTimeout(() => setSuccess(''), 2000)
  }

  if (!profile) return null

  return (
    <div style={{ flex:1, overflowY:'auto', background:'var(--bg-2)', padding:'32px 0', display:'flex', flexDirection:'column', alignItems:'center' }}>
      <div style={{ width:'100%', maxWidth:520, padding:'0 24px', display:'flex', flexDirection:'column', gap:16 }}>

        {/* Avatar card */}
        <Card>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
            <div style={{ position:'relative', cursor:'pointer' }} onClick={() => fileRef.current?.click()}>
              <Avatar src={profile.avatar_url} name={profile.username} size={88}
                style={{ boxShadow:'0 0 30px rgba(255,107,0,.25)' }}/>
              <div style={{
                position:'absolute', bottom:2, right:2,
                width:28, height:28, borderRadius:14,
                background:'linear-gradient(135deg,#FF6B00,#FF4500)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:13, border:'2px solid var(--panel)',
                boxShadow:'0 2px 8px rgba(255,107,0,.4)',
              }}>
                {uploading ? '⏳' : '📷'}
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={pickAvatar}/>

            {!editing
              ? <>
                  <div style={{ textAlign:'center' }}>
                    <h2 style={{ fontFamily:'var(--font-h)', fontSize:22, fontWeight:800 }}>{profile.username}</h2>
                    <p style={{ color:'var(--text-2)', fontSize:13, marginTop:4 }}>{profile.email}</p>
                  </div>
                  <Btn variant="secondary" size="sm" onClick={()=>{ setEditing(true); setUsername(profile.username); setErr(''); setSuccess('') }} icon="✏️">Edit Profile</Btn>
                </>
              : <div style={{ width:'100%' }}>
                  <Input label="Username" value={username} onChange={e=>{ setUsername(e.target.value); setErr('') }}
                    placeholder="your_username" icon="👤" error={err} autoFocus/>
                  <div style={{ display:'flex', gap:10 }}>
                    <Btn onClick={save} loading={saving} style={{ flex:1 }}>Save</Btn>
                    <Btn variant="secondary" onClick={()=>{ setEditing(false); setErr('') }} style={{ flex:1 }}>Cancel</Btn>
                  </div>
                </div>
            }

            {success && <p style={{ fontSize:13, color:'var(--success)' }}>{success}</p>}
          </div>
        </Card>

        {/* Spark Code card */}
        <Card>
          <Label>Your Spark Code</Label>
          <div style={{ textAlign:'center', padding:'8px 0 16px' }}>
            <p style={{ fontSize:38, fontWeight:800, letterSpacing:10, color:'var(--spark)', fontFamily:'var(--font-h)', marginBottom:6 }}>
              {profile.friend_code}
            </p>
            <p style={{ fontSize:12, color:'var(--text-3)', marginBottom:16 }}>
              Share this with friends so they can find and add you
            </p>
            <Btn variant="secondary" size="sm" onClick={copyCode} icon="📋">Copy Code</Btn>
          </div>
        </Card>

        {/* Account info */}
        <Card>
          <Label>Account</Label>
          <InfoRow label="Email" value={profile.email}/>
          <InfoRow label="Username" value={`@${profile.username}`}/>
          <InfoRow label="Member since" value={new Date(profile.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}/>
        </Card>

        {/* Settings */}
        <Card>
          <Label>Settings</Label>
          {[
            { icon:'🔔', label:'Notifications', soon:true },
            { icon:'🎨', label:'Appearance', soon:true },
            { icon:'🔒', label:'Privacy', soon:true },
          ].map(s => (
            <button key={s.label}
              style={{
                width:'100%', display:'flex', alignItems:'center', gap:14,
                padding:'12px 0', background:'none', border:'none', borderBottom:'1px solid var(--border)',
                cursor:'pointer', color:'var(--text)', fontFamily:'var(--font-b)',
              }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,107,0,.04)'}
              onMouseLeave={e=>e.currentTarget.style.background='none'}>
              <span style={{ fontSize:18, width:28, textAlign:'center' }}>{s.icon}</span>
              <span style={{ flex:1, fontSize:14, textAlign:'left' }}>{s.label}</span>
              {s.soon && <span style={{ fontSize:10, color:'var(--text-3)', background:'var(--surface)', padding:'2px 8px', borderRadius:'var(--r-full)' }}>Soon</span>}
              <span style={{ color:'var(--text-3)', fontSize:13 }}>›</span>
            </button>
          ))}
        </Card>

        {/* Sign out */}
        <Btn variant="danger" onClick={signOut} icon="⏏" style={{ width:'100%' }}>Sign Out</Btn>
        <p style={{ textAlign:'center', color:'var(--text-3)', fontSize:12 }}>SparkChat v1.0.0</p>
      </div>
    </div>
  )
}

function Card({ children }) {
  return (
    <div style={{
      background:'var(--panel)', border:'1px solid var(--border)',
      borderRadius:20, padding:'24px',
    }}>{children}</div>
  )
}

function Label({ children }) {
  return <p style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'var(--text-3)', marginBottom:14 }}>{children}</p>
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
      <span style={{ fontSize:13, color:'var(--text-2)' }}>{label}</span>
      <span style={{ fontSize:13, color:'var(--text)', fontWeight:500 }}>{value}</span>
    </div>
  )
}
