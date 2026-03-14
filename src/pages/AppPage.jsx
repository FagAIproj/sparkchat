import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useConversations } from '../hooks/useConversations'
import { useFriends } from '../hooks/useFriends'
import { Sidebar } from '../components/chat/Sidebar'
import { ConversationList } from '../components/chat/ConversationList'
import { ChatWindow, NoChatSelected } from '../components/chat/ChatWindow'
import { FriendsPanel } from '../components/chat/FriendsPanel'
import { ProfilePanel } from '../components/chat/ProfilePanel'
import logo from '../logo.png'

export default function AppPage() {
  const navigate = useNavigate()
  const { session, profile, loading: authLoading } = useAuth()
  const { conversations, loading: convLoading, getOrCreate } = useConversations()
  const { received } = useFriends()

  const [view,       setView]       = useState('chats')
  const [activeConv, setActiveConv] = useState(null)
  // Hard UI timeout — never show spinner more than 6 seconds
  const [timedOut,   setTimedOut]   = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 6000)
    return () => clearTimeout(t)
  }, [])

  // Redirect to landing if not authenticated (only after loading is done)
  useEffect(() => {
    if (!authLoading && !session) navigate('/')
  }, [session, authLoading, navigate])

  // Update active conv when conversations refresh
  useEffect(() => {
    if (activeConv) {
      const updated = conversations.find(c => c.id === activeConv.id)
      if (updated) setActiveConv(updated)
    }
  }, [conversations])

  const handleOpenChat = async (conv) => {
    if (!conv) return
    let fullConv = conv
    if (!conv.other_user) {
      const found = conversations.find(c => c.id === conv.id)
      fullConv = found ?? conv
    }
    setActiveConv(fullConv)
    setView('chats')
  }

  // Show spinner only while loading AND not timed out AND no profile yet
  const showSpinner = authLoading && !timedOut && !profile

  if (showSpinner) {
    return (
      <div style={{
        height: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', gap: 20,
      }}>
        <img src={logo} alt="SparkChat" style={{
          width: 72, height: 72,
          filter: 'drop-shadow(0 0 24px rgba(255,107,0,.5))',
          animation: 'floatY 2s ease-in-out infinite',
        }}/>
        <style>{`@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--spark)',
            animation: 'spin .7s linear infinite',
          }}/>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Loading SparkChat…</p>
        </div>
      </div>
    )
  }

  // If timed out but still no session → go home
  if (timedOut && !session) {
    navigate('/')
    return null
  }

  return (
    <div style={{
      height: '100vh', display: 'flex',
      background: 'var(--bg)', overflow: 'hidden',
    }}>
      <Sidebar
        view={view}
        setView={(v) => { setView(v); if (v !== 'chats') setActiveConv(null) }}
        pendingCount={received.length}
      />

      {view === 'chats' && (
        <ConversationList
          conversations={conversations}
          loading={convLoading}
          activeId={activeConv?.id}
          onSelect={(conv) => setActiveConv(conv)}
        />
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {view === 'chats' && (
          activeConv
            ? <ChatWindow key={activeConv.id} conversation={activeConv} />
            : <NoChatSelected />
        )}
        {view === 'friends' && <FriendsPanel onOpenChat={handleOpenChat} />}
        {view === 'profile' && <ProfilePanel />}
      </div>
    </div>
  )
}
