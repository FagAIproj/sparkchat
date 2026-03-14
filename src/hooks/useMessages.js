import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useMessages(conversationId) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [sending,  setSending]  = useState(false)
  const channelRef = useRef(null)

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return
    const { data } = await supabase
      .from('messages')
      .select('*, sender:profiles!messages_sender_id_fkey(id,username,avatar_url)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    if (data) setMessages(data)
    setLoading(false)
  }, [conversationId])

  const markRead = useCallback(async () => {
    if (!user || !conversationId) return
    await supabase.from('messages')
      .update({ status: 'read' })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id)
      .neq('status', 'read')
  }, [conversationId, user])

  const sendMessage = useCallback(async (content) => {
    if (!user || !content.trim()) return
    setSending(true)
    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, sender_id: user.id, content: content.trim(), status: 'sent' })
      .select('*, sender:profiles!messages_sender_id_fkey(id,username,avatar_url)')
      .single()
    if (!error && data) {
      setMessages(prev => prev.some(m => m.id === data.id) ? prev : [...prev, data])
    }
    setSending(false)
    return { error }
  }, [conversationId, user])

  useEffect(() => {
    if (!conversationId) return
    setLoading(true)
    fetchMessages()
    markRead()

    const ch = supabase
      .channel(`msgs:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, async (payload) => {
        const { data } = await supabase
          .from('messages')
          .select('*, sender:profiles!messages_sender_id_fkey(id,username,avatar_url)')
          .eq('id', payload.new.id)
          .single()
        if (data) {
          setMessages(prev => prev.some(m => m.id === data.id) ? prev : [...prev, data])
          if (data.sender_id !== user?.id) {
            await supabase.from('messages').update({ status: 'read' }).eq('id', data.id)
          }
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        setMessages(prev => prev.map(m => m.id === payload.new.id ? { ...m, ...payload.new } : m))
      })
      .subscribe()

    channelRef.current = ch
    return () => { supabase.removeChannel(ch) }
  }, [conversationId, fetchMessages, markRead, user])

  return { messages, loading, sending, sendMessage }
}
