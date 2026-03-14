import React from 'react'
import { Avatar } from '../UI'
import { fmtTime, fmtDateSep, needsDateSep } from '../../utils/dateUtils'

function StatusIcon({ status }) {
  if (status === 'read')      return <span title="Read"      style={{ color:'#60a5fa', fontSize:12 }}>✓✓</span>
  if (status === 'delivered') return <span title="Delivered" style={{ color:'var(--spark)', fontSize:12 }}>✓✓</span>
  return                             <span title="Sent"      style={{ color:'var(--text-3)', fontSize:12 }}>✓</span>
}

export function DateSep({ date }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 20px' }}>
      <div style={{ flex:1, height:1, background:'var(--border)' }}/>
      <span style={{
        fontSize:11, fontWeight:600, color:'var(--text-3)', letterSpacing:.5,
        textTransform:'uppercase', padding:'3px 12px',
        background:'var(--panel-2)', borderRadius:'var(--r-full)',
        border:'1px solid var(--border)',
      }}>{fmtDateSep(date)}</span>
      <div style={{ flex:1, height:1, background:'var(--border)' }}/>
    </div>
  )
}

export function MessageBubble({ message, isOwn, showAvatar, otherAvatar, otherName }) {
  return (
    <div style={{
      display:'flex', flexDirection: isOwn ? 'row-reverse' : 'row',
      alignItems:'flex-end', gap:8,
      padding:'2px 16px',
      maxWidth:'80%', alignSelf: isOwn ? 'flex-end' : 'flex-start',
    }}>
      {/* Avatar slot */}
      {!isOwn && (
        <div style={{ width:28, flexShrink:0 }}>
          {showAvatar
            ? <Avatar src={otherAvatar} name={otherName} size={28}/>
            : null
          }
        </div>
      )}

      <div style={{
        background: isOwn ? 'linear-gradient(135deg,#FF5500,#cc2200)' : 'var(--surface)',
        color: 'var(--text)',
        padding:'9px 14px',
        borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        boxShadow: isOwn ? '0 4px 16px rgba(255,85,0,.25)' : 'none',
        border: isOwn ? 'none' : '1px solid var(--border)',
        maxWidth: 380,
      }}>
        <p style={{ fontSize:14, lineHeight:1.55, wordBreak:'break-word', whiteSpace:'pre-wrap' }}>
          {message.content}
        </p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:5, marginTop:4 }}>
          <span style={{ fontSize:11, opacity:.6 }}>{fmtTime(message.created_at)}</span>
          {isOwn && <StatusIcon status={message.status}/>}
        </div>
      </div>
    </div>
  )
}
