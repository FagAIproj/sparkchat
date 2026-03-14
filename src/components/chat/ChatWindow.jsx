import React, { useState, useRef, useEffect } from 'react'
import { Avatar, Spinner, Empty } from '../UI'
import { MessageBubble, DateSep } from './MessageBubble'
import { useMessages } from '../../hooks/useMessages'
import { useAuth } from '../../context/AuthContext'
import { needsDateSep, fmtLastSeen } from '../../utils/dateUtils'

export function ChatWindow({ conversation }) {
  const { user } = useAuth()
  const other = conversation.other_user
  const { messages, loading, sending, sendMessage } = useMessages(conversation.id)
  const [text, setText] = useState('')
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when window opens
  useEffect(() => { inputRef.current?.focus() }, [conversation.id])

  const send = async () => {
    const t = text.trim()
    if (!t || sending) return
    setText('')
    await sendMessage(t)
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:'var(--bg-2)', minWidth:0 }}>

      {/* Header */}
      <div style={{
        display:'flex', alignItems:'center', gap:14, padding:'12px 20px',
        borderBottom:'1px solid var(--border)', background:'var(--panel)',
        flexShrink:0,
      }}>
        <Avatar src={other?.avatar_url} name={other?.username} size={40} online={other?.is_online}/>
        <div>
          <p style={{ fontWeight:700, fontSize:15, color:'var(--text)' }}>{other?.username}</p>
          <p style={{ fontSize:12, color: other?.is_online ? 'var(--online)' : 'var(--text-3)' }}>
            {other?.is_online ? '● Online' : `Last seen ${fmtLastSeen(other?.last_seen)}`}
          </p>
        </div>
        <div style={{ flex:1 }}/>
        <button style={{ background:'none', border:'none', cursor:'pointer', fontSize:18, color:'var(--text-3)', padding:8 }}>⋮</button>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', padding:'8px 0' }}>
        {loading
          ? <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}><Spinner size={28}/></div>
          : messages.length === 0
            ? <Empty icon="👋" title={`Say hi to ${other?.username}!`} sub="This is the beginning of your conversation."/>
            : messages.map((msg, i) => {
                const prev = i > 0 ? messages[i-1] : null
                const next = i < messages.length-1 ? messages[i+1] : null
                const isOwn = msg.sender_id === user?.id
                const showAvatar = !isOwn && (!next || next.sender_id !== msg.sender_id)
                const showDate   = needsDateSep(msg.created_at, prev?.created_at)
                return (
                  <React.Fragment key={msg.id}>
                    {showDate && <DateSep date={msg.created_at}/>}
                    <MessageBubble
                      message={msg} isOwn={isOwn}
                      showAvatar={showAvatar}
                      otherAvatar={other?.avatar_url}
                      otherName={other?.username}
                    />
                  </React.Fragment>
                )
              })
        }
        <div ref={bottomRef}/>
      </div>

      {/* Input bar */}
      <div style={{
        padding:'12px 16px', borderTop:'1px solid var(--border)',
        background:'var(--panel)', display:'flex', alignItems:'flex-end', gap:10, flexShrink:0,
      }}>
        <div style={{
          flex:1, background:'var(--surface)', border:'1px solid var(--border)',
          borderRadius:20, padding:'10px 16px',
          display:'flex', alignItems:'flex-end', gap:8,
        }}>
          <textarea ref={inputRef} value={text} onChange={e=>setText(e.target.value)} onKeyDown={onKey}
            placeholder="Type a message…" rows={1} maxLength={2000}
            style={{
              flex:1, background:'transparent', border:'none', outline:'none',
              color:'var(--text)', fontSize:14, fontFamily:'var(--font-b)',
              resize:'none', lineHeight:1.5, maxHeight:120, overflowY:'auto',
            }}
            onInput={e => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
          />
          <button style={{ background:'none', border:'none', cursor:'pointer', fontSize:18, color:'var(--text-3)', padding:2, flexShrink:0 }}>😊</button>
        </div>
        <button onClick={send} disabled={!text.trim() || sending}
          style={{
            width:44, height:44, borderRadius:22, border:'none',
            background: text.trim() ? 'linear-gradient(135deg,#FF6B00,#FF4500)' : 'var(--surface)',
            color: text.trim() ? '#fff' : 'var(--text-3)',
            cursor: text.trim() ? 'pointer' : 'default',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:17, flexShrink:0,
            boxShadow: text.trim() ? '0 4px 16px rgba(255,107,0,.35)' : 'none',
            transition:'all .2s',
          }}>
          {sending ? <Spinner size={16}/> : '➤'}
        </button>
      </div>
    </div>
  )
}

export function NoChatSelected() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'var(--bg-2)', gap:12 }}>
      <div style={{ fontSize:52, animation:'floatY 4s ease-in-out infinite' }}>✨</div>
      <h3 style={{ fontFamily:'var(--font-h)', fontSize:22, fontWeight:800, color:'var(--text)' }}>Select a chat</h3>
      <p style={{ color:'var(--text-3)', fontSize:14 }}>Choose a conversation or start a new one</p>
      <style>{`@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </div>
  )
}
