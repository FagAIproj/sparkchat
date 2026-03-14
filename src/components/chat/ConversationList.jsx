import React, { useState } from 'react'
import { Avatar, Empty } from '../UI'
import { fmtConvTime } from '../../utils/dateUtils'
import { useAuth } from '../../context/AuthContext'

export function ConversationList({ conversations, loading, activeId, onSelect }) {
  const { user } = useAuth()
  const [search, setSearch] = useState('')

  const filtered = conversations.filter(c =>
    (c.other_user?.username ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{
      width:300, borderRight:'1px solid var(--border)',
      display:'flex', flexDirection:'column', flexShrink:0,
      background:'var(--panel)',
    }}>
      {/* Header */}
      <div style={{ padding:'16px 16px 10px', borderBottom:'1px solid var(--border)' }}>
        <h2 style={{ fontFamily:'var(--font-h)', fontWeight:800, fontSize:18, marginBottom:12 }}>Messages</h2>
        <div style={{
          display:'flex', alignItems:'center', gap:8,
          background:'var(--surface)', borderRadius:10,
          border:'1px solid var(--border)', padding:'8px 12px',
        }}>
          <span style={{ fontSize:14, color:'var(--text-3)' }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search chats…"
            style={{
              flex:1, background:'transparent', border:'none', outline:'none',
              color:'var(--text)', fontSize:13, fontFamily:'var(--font-b)',
            }}/>
        </div>
      </div>

      {/* List */}
      <div style={{ flex:1, overflowY:'auto' }}>
        {loading && (
          <div style={{ display:'flex', justifyContent:'center', padding:30 }}>
            <div style={{ width:24, height:24, borderRadius:'50%', border:'2px solid var(--border)', borderTopColor:'var(--spark)', animation:'spin .7s linear infinite' }}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <Empty icon="💬" title="No chats yet" sub="Add a friend and start chatting!"/>
        )}
        {filtered.map(c => (
          <ConvItem key={c.id} conv={c} active={c.id === activeId} onClick={()=>onSelect(c)}/>
        ))}
      </div>
    </div>
  )
}

function ConvItem({ conv, active, onClick }) {
  const [hov, setHov] = useState(false)
  const other  = conv.other_user
  const last   = conv.last_message
  const unread = conv.unread ?? 0

  return (
    <div onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        display:'flex', alignItems:'center', gap:12, padding:'11px 16px', cursor:'pointer',
        background: active ? 'rgba(255,107,0,0.1)' : hov ? 'var(--surface)' : 'transparent',
        borderLeft: active ? '3px solid var(--spark)' : '3px solid transparent',
        transition:'all .15s',
      }}>
      <Avatar src={other?.avatar_url} name={other?.username} size={46} online={other?.is_online}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3 }}>
          <span style={{ fontWeight:600, fontSize:14, color:'var(--text)', truncate:true }}
            className="truncate">{other?.username ?? '—'}</span>
          <span style={{ fontSize:11, color: unread > 0 ? 'var(--spark)' : 'var(--text-3)', flexShrink:0, marginLeft:8 }}>
            {fmtConvTime(last?.created_at)}
          </span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{
            fontSize:13, color: unread > 0 ? 'var(--text-2)' : 'var(--text-3)',
            fontWeight: unread > 0 ? 500 : 400,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1,
          }}>{last?.content ?? 'Start chatting…'}</span>
          {unread > 0 && (
            <span style={{
              background:'var(--spark)', color:'#fff', fontSize:10, fontWeight:800,
              minWidth:18, height:18, borderRadius:'var(--r-full)',
              display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px',
              flexShrink:0, marginLeft:6,
            }}>{unread > 99 ? '99+' : unread}</span>
          )}
        </div>
      </div>
    </div>
  )
}
