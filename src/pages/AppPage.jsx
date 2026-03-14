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
import { Spinner } from '../components/UI'

export default function AppPage() {
  const navigate = useNavigate()
  const { session, loading: authLoading } = useAuth()
  const { conversations, loading: convLoading, getOrCreate } = useConversations()
  const { received } = useFriends()

  const [view,       setView]       = useState('chats')   // 'chats' | 'friends' | 'profile'
  const [activeConv, setActiveConv] = useState(null)

  // Redirect to landing if not authenticated
  useEffect(() => {
    if (!authLoading && !session) navigate('/')
  }, [session, authLoading, navigate])

  // When a conversation is opened from FriendsPanel
  const handleOpenChat = async (conv) => {
    // Enrich with other_user if missing
    let fullConv = conv
    if (!conv.other_user) {
      const found = conversations.find(c => c.id === conv.id)
      fullConv = found ?? conv
    }
    setActiveConv(fullConv)
    setView('chats')
  }

  // Update active conv when conversations refresh (for real-time last_message etc.)
  useEffect(() => {
    if (activeConv) {
      const updated = conversations.find(c => c.id === activeConv.id)
      if (updated) setActiveConv(updated)
    }
  }, [conversations])

  if (authLoading) {
    return (
      <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
        <Spinner size={36}/>
      </div>
    )
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      background: 'var(--bg)',
      overflow: 'hidden',
    }}>
      {/* ── Left: icon sidebar ── */}
      <Sidebar
        view={view}
        setView={(v) => { setView(v); if (v !== 'chats') setActiveConv(null) }}
        pendingCount={received.length}
      />

      {/* ── Middle: conversation list (only visible in chats view) ── */}
      {view === 'chats' && (
        <ConversationList
          conversations={conversations}
          loading={convLoading}
          activeId={activeConv?.id}
          onSelect={(conv) => setActiveConv(conv)}
        />
      )}

      {/* ── Right: main content area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {view === 'chats' && (
          activeConv
            ? <ChatWindow key={activeConv.id} conversation={activeConv} />
            : <NoChatSelected />
        )}
        {view === 'friends' && (
          <FriendsPanel onOpenChat={handleOpenChat} />
        )}
        {view === 'profile' && (
          <ProfilePanel />
        )}
      </div>
    </div>
  )
}
