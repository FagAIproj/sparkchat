import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useConversations() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return }

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          p1:profiles!conversations_participant_1_fkey(id,username,avatar_url,is_online,last_seen),
          p2:profiles!conversations_participant_2_fkey(id,username,avatar_url,is_online,last_seen)
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('updated_at', { ascending: false })

      if (error) { console.warn('conversations fetch:', error); setLoading(false); return }
      if (!data || data.length === 0) { setConversations([]); setLoading(false); return }

      // Enrich each conversation — but don't let one failure break everything
      const enriched = await Promise.all(data.map(async (c) => {
        const other = c.participant_1 === user.id ? c.p2 : c.p1
        let last = null
        let count = 0
        try {
          const { data: lastMsg } = await supabase
            .from('messages').select('*')
            .eq('conversation_id', c.id)
            .order('created_at', { ascending: false })
            .limit(1).maybeSingle()
          last = lastMsg

          const { count: unreadCount } = await supabase
            .from('messages').select('*', { count: 'exact', head: true })
            .eq('conversation_id', c.id)
            .neq('sender_id', user.id)
            .neq('status', 'read')
          count = unreadCount ?? 0
        } catch (e) { /* ignore per-conversation errors */ }

        return { ...c, other_user: other, last_message: last, unread: count }
      }))

      setConversations(enriched)
    } catch (e) {
      console.warn('useConversations error:', e)
    }

    setLoading(false)
  }, [user])

  const getOrCreate = useCallback(async (otherId) => {
    if (!user) return null
    try {
      const [p1, p2] = user.id < otherId ? [user.id, otherId] : [otherId, user.id]
      const { data: ex } = await supabase
        .from('conversations').select('*')
        .eq('participant_1', p1).eq('participant_2', p2).maybeSingle()
      if (ex) return ex
      const { data, error } = await supabase
        .from('conversations').insert({ participant_1: p1, participant_2: p2 })
        .select('*').single()
      if (error) { console.warn('getOrCreate:', error); return null }
      await fetch()
      return data
    } catch (e) { console.warn('getOrCreate error:', e); return null }
  }, [user, fetch])

  useEffect(() => {
    if (!user) return
    fetch()
    const ch = supabase.channel('convs:' + user.id)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, fetch)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, fetch)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [user, fetch])

  return { conversations, loading, getOrCreate, refresh: fetch }
}
