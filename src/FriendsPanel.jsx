import React, { useState } from 'react'
import { Avatar, Btn, Empty } from '../UI'
import { useFriends } from '../../hooks/useFriends'
import { useConversations } from '../../hooks/useConversations'
import { useAuth } from '../../context/AuthContext'
import { fmtLastSeen } from '../../utils/dateUtils'

export function FriendsPanel({ onOpenChat }) {
  const { friends, received, sent, loading, findByCode, sendRequest, accept, decline, getOther } = useFriends()
  const { getOrCreate } = useConversations()
  const [tab, setTab] = useState('friends')

  const startChat = async (friendId) => {
    const conv = await getOrCreate(friendId)
    if (conv) onOpenChat(conv)
  }

  const tabs = [
    { id:'friends',  label:'Friends',  badge:0 },
    { id:'requests', label:'Requests', badge: received.length },
    { id:'add',      label:'Add Friend', badge:0 },
  ]

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:'var(--bg-2)', minWidth:0 }}>
      {/* Header */}
      <div style={{ padding:'20px 28px 0', borderBottom:'1px solid var(--border)', background:'var(--panel)', flexShrink:0 }}>
        <h2 style={{ fontFamily:'var(--font-h)', fontWeight:800, fontSize:22, marginBottom:16 }}>Friends</h2>
        <div style={{ display:'flex', gap:4 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{
                padding:'9px 18px', borderRadius:'var(--r-full) var(--r-full) 0 0',
                border:'none', cursor:'pointer', fontFamily:'var(--font-b)',
                fontWeight:600, fontSize:13,
                background: tab===t.id ? 'var(--bg-2)' : 'transparent',
                color: tab===t.id ? 'var(--spark)' : 'var(--text-3)',
                borderBottom: tab===t.id ? '2px solid var(--spark)' : '2px solid transparent',
                display:'flex', alignItems:'center', gap:6, transition:'all .2s',
              }}>
              {t.label}
              {t.badge > 0 && (
                <span style={{ background:'var(--danger)', color:'#fff', fontSize:10, fontWeight:800, minWidth:16, height:16, borderRadius:'var(--r-full)', display:'flex', alignItems:'center', justifyContent:'center', padding:'0 4px' }}>{t.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', padding:'20px 28px' }}>

        {tab === 'friends' && (
          friends.length === 0
            ? <Empty icon="🤝" title="No friends yet" sub="Switch to 'Add Friend' to connect with people using their Spark Code."/>
            : <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {friends.map(f => {
                  const other = getOther(f)
                  if (!other) return null
                  return (
                    <FriendRow key={f.id} user={other}>
                      <Btn size="sm" onClick={()=>startChat(other.id)} icon="💬">Chat</Btn>
                      <Btn size="sm" variant="secondary" onClick={()=>decline(f.id)} icon="✕">Remove</Btn>
                    </FriendRow>
                  )
                })}
              </div>
        )}

        {tab === 'requests' && (
          received.length === 0 && sent.length === 0
            ? <Empty icon="📩" title="No pending requests"/>
            : <>
                {received.length > 0 && (
                  <>
                    <SectionLabel>Received</SectionLabel>
                    <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:24 }}>
                      {received.map(f => {
                        const other = getOther(f)
                        if (!other) return null
                        return (
                          <FriendRow key={f.id} user={other}>
                            <Btn size="sm" variant="success" onClick={()=>accept(f.id)} icon="✓">Accept</Btn>
                            <Btn size="sm" variant="danger" onClick={()=>decline(f.id)} icon="✕">Decline</Btn>
                          </FriendRow>
                        )
                      })}
                    </div>
                  </>
                )}
                {sent.length > 0 && (
                  <>
                    <SectionLabel>Sent</SectionLabel>
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {sent.map(f => {
                        const other = getOther(f)
                        if (!other) return null
                        return (
                          <FriendRow key={f.id} user={other} tag="Pending">
                            <Btn size="sm" variant="secondary" onClick={()=>decline(f.id)}>Cancel</Btn>
                          </FriendRow>
                        )
                      })}
                    </div>
                  </>
                )}
              </>
        )}

        {tab === 'add' && <AddFriend sendRequest={sendRequest} findByCode={findByCode}/>}
      </div>
    </div>
  )
}

/* ─── Add Friend ──────────────────────────────────────────── */
function AddFriend({ sendRequest, findByCode }) {
  const [code,    setCode]    = useState('')
  const [found,   setFound]   = useState(null)
  const [searching, setSearcing] = useState(false)
  const [sending, setSending] = useState(false)
  const [err,     setErr]     = useState('')
  const [success, setSuccess] = useState('')

  const search = async () => {
    if (code.length !== 6) { setErr('Code must be exactly 6 characters'); return }
    setSearcing(true); setErr(''); setFound(null)
    const user = await findByCode(code)
    setSearcing(false)
    if (!user) setErr('No user found with that Spark Code.')
    else setFound(user)
  }

  const send = async () => {
    if (!found) return
    setSending(true)
    const { error } = await sendRequest(found.id)
    setSending(false)
    if (error) setErr(error.toString?.() ?? 'Error sending request')
    else { setSuccess(`Friend request sent to ${found.username}! 🔥`); setFound(null); setCode('') }
  }

  const { profile } = useAuth()

  return (
    <div style={{ maxWidth:480 }}>
      {/* Search card */}
      <div style={{
        background:'var(--panel)', border:'1px solid var(--border)',
        borderRadius:20, padding:'28px 28px 24px', marginBottom:20,
      }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}>
          <div style={{
            width:56, height:56, borderRadius:16,
            background:'rgba(255,107,0,.12)', border:'1px solid rgba(255,107,0,.2)',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:28,
          }}>🔥</div>
        </div>
        <h3 style={{ fontFamily:'var(--font-h)', fontWeight:800, fontSize:20, textAlign:'center', marginBottom:6 }}>Add by Spark Code</h3>
        <p style={{ color:'var(--text-2)', fontSize:13, textAlign:'center', marginBottom:24, lineHeight:1.6 }}>
          Enter the 6-character code of the person you want to add.
        </p>

        {err     && <div style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.25)', borderRadius:10, padding:'10px 14px', marginBottom:14, fontSize:13, color:'#fca5a5' }}>{err}</div>}
        {success && <div style={{ background:'rgba(34,197,94,.1)', border:'1px solid rgba(34,197,94,.25)', borderRadius:10, padding:'10px 14px', marginBottom:14, fontSize:13, color:'#86efac' }}>{success}</div>}

        <div style={{ display:'flex', gap:10, marginBottom:16 }}>
          <input value={code} onChange={e=>{ setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'')); setErr(''); setFound(null); setSuccess('') }}
            placeholder="ABC123" maxLength={6}
            style={{
              flex:1, background:'var(--surface)', border:`1px solid ${err?'var(--danger)':'var(--border)'}`,
              borderRadius:'var(--r-md)', color:'var(--text)', fontSize:24,
              fontWeight:800, textAlign:'center', letterSpacing:8, padding:'12px 16px',
              fontFamily:'var(--font-h)', outline:'none', transition:'border-color .2s',
            }}
            onFocus={e=>e.target.style.borderColor='var(--border-warm)'}
            onBlur={e=>e.target.style.borderColor=err?'var(--danger)':'var(--border)'}
            onKeyDown={e=>e.key==='Enter'&&search()}
          />
          <Btn onClick={search} loading={searching} disabled={code.length!==6} icon="🔍">Search</Btn>
        </div>

        {/* Code boxes visual */}
        <div style={{ display:'flex', gap:6, justifyContent:'center' }}>
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} style={{
              width:38, height:42, borderRadius:8,
              border:`2px solid ${code[i]?'var(--spark)':'var(--border)'}`,
              background:code[i]?'rgba(255,107,0,.08)':'var(--surface)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:16, fontWeight:800, color:code[i]?'var(--text)':'var(--text-3)',
              transition:'all .15s',
            }}>{code[i]??''}</div>
          ))}
        </div>

        {/* Found user */}
        {found && (
          <div className="scale-in" style={{
            marginTop:20, padding:'16px', background:'var(--surface)',
            borderRadius:14, border:'1px solid rgba(255,107,0,.25)',
            display:'flex', alignItems:'center', gap:14,
          }}>
            <Avatar src={found.avatar_url} name={found.username} size={48}/>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:700, fontSize:15 }}>{found.username}</p>
              <p style={{ fontSize:12, color:'var(--text-3)' }}>#{found.friend_code}</p>
            </div>
            <Btn size="sm" onClick={send} loading={sending} icon="➕">Add</Btn>
          </div>
        )}
      </div>

      {/* Your code card */}
      {profile && (
        <div style={{
          background:'var(--panel)', border:'1px solid var(--border)',
          borderRadius:20, padding:'24px 28px', textAlign:'center',
        }}>
          <p style={{ fontSize:12, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'var(--text-3)', marginBottom:8 }}>Your Spark Code</p>
          <p style={{ fontSize:36, fontWeight:800, letterSpacing:10, color:'var(--spark)', fontFamily:'var(--font-h)', marginBottom:6 }}>{profile.friend_code}</p>
          <p style={{ fontSize:12, color:'var(--text-3)', marginBottom:16 }}>Share this with friends so they can find you</p>
          <Btn variant="secondary" size="sm" onClick={()=>{ navigator.clipboard.writeText(profile.friend_code) }} icon="📋">Copy Code</Btn>
        </div>
      )}
    </div>
  )
}

/* ─── Helpers ─────────────────────────────────────────────── */
function FriendRow({ user, children, tag }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:14, padding:'12px 16px',
      background:'var(--panel)', borderRadius:14, border:'1px solid var(--border)',
    }}>
      <Avatar src={user.avatar_url} name={user.username} size={44} online={user.is_online}/>
      <div style={{ flex:1 }}>
        <p style={{ fontWeight:600, fontSize:14 }}>{user.username}</p>
        <p style={{ fontSize:12, color: user.is_online ? 'var(--online)' : 'var(--text-3)' }}>
          {tag ?? (user.is_online ? '● Online' : `Last seen ${fmtLastSeen(user.last_seen)}`)}
        </p>
      </div>
      <div style={{ display:'flex', gap:8 }}>{children}</div>
    </div>
  )
}

function SectionLabel({ children }) {
  return <p style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'var(--text-3)', marginBottom:10 }}>{children}</p>
}
