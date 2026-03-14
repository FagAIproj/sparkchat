import React from 'react'
import logo from '../../logo.png'
import { Avatar } from '../UI'
import { useAuth } from '../../context/AuthContext'

const NavBtn = ({ icon, label, active, onClick, badge }) => (
  <button onClick={onClick} title={label}
    style={{
      width:44, height:44, borderRadius:14,
      background: active ? 'rgba(255,107,0,0.15)' : 'transparent',
      border: active ? '1px solid rgba(255,107,0,0.3)' : '1px solid transparent',
      color: active ? 'var(--spark)' : 'var(--text-3)',
      cursor:'pointer', fontSize:19, display:'flex',
      alignItems:'center', justifyContent:'center',
      transition:'all .2s', position:'relative',
    }}
    onMouseEnter={e=>{ if(!active){ e.currentTarget.style.background='var(--surface)'; e.currentTarget.style.color='var(--text-2)' }}}
    onMouseLeave={e=>{ if(!active){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-3)' }}}>
    {icon}
    {badge > 0 && (
      <span style={{
        position:'absolute', top:4, right:4,
        background:'var(--danger)', color:'#fff',
        fontSize:9, fontWeight:700, minWidth:14, height:14,
        borderRadius:'var(--r-full)', display:'flex',
        alignItems:'center', justifyContent:'center', padding:'0 3px',
        border:'2px solid var(--panel)',
      }}>{badge > 9 ? '9+' : badge}</span>
    )}
  </button>
)

export function Sidebar({ view, setView, pendingCount }) {
  const { profile, signOut } = useAuth()

  return (
    <div style={{
      width:64, background:'var(--panel)', borderRight:'1px solid var(--border)',
      display:'flex', flexDirection:'column', alignItems:'center',
      padding:'12px 0', flexShrink:0, gap:6,
    }}>
      {/* Logo */}
      <img src={logo} alt="SparkChat" style={{ width:34, height:34, marginBottom:8 }}/>

      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:6, alignItems:'center' }}>
        <NavBtn icon="💬" label="Chats"   active={view==='chats'}   onClick={()=>setView('chats')}/>
        <NavBtn icon="👥" label="Friends" active={view==='friends'} onClick={()=>setView('friends')} badge={pendingCount}/>
        <NavBtn icon="👤" label="Profile" active={view==='profile'} onClick={()=>setView('profile')}/>
      </div>

      {/* Avatar + logout */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
        <button onClick={()=>setView('profile')} title={profile?.username}
          style={{ background:'none', border:'none', cursor:'pointer', padding:0 }}>
          <Avatar src={profile?.avatar_url} name={profile?.username} size={36} online={true}/>
        </button>
        <button onClick={signOut} title="Sign out"
          style={{
            width:36, height:36, borderRadius:10,
            background:'transparent', border:'1px solid transparent',
            color:'var(--text-3)', cursor:'pointer', fontSize:17,
            transition:'all .2s',
          }}
          onMouseEnter={e=>{ e.currentTarget.style.background='rgba(239,68,68,.12)'; e.currentTarget.style.color='var(--danger)'; e.currentTarget.style.borderColor='rgba(239,68,68,.2)' }}
          onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-3)'; e.currentTarget.style.borderColor='transparent' }}>
          ⏏
        </button>
      </div>
    </div>
  )
}
