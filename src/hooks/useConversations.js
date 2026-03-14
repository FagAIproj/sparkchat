import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useConversations() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('conversations')
      .select(`
        *,
        p1:profiles!conversations_participant_1_fkey(id,username,avatar_url,is_online,last_seen),
        p2:profiles!conversations_participant_2_fkey(id,username,avatar_url,is_online,last_seen)
      `)
      .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
      .order('updated_at', { ascending: false })

    if (!data) return

    const enriched = await Promise.all(data.map(async c => {
      const other = c.participant_1 === user.id ? c.p2 : c.p1
      const { data: last } = await supabase
        .from('messages').select('*')
        .eq('conversation_id', c.id)
        .order('created_at', { ascending: false })
        .limit(1).single()
      const { count } = await supabase
        .from('messages').select('*', { count: 'exact', head: true })
        .eq('conversation_id', c.id)
        .neq('sender_id', user.id)
        .neq('status', 'read')
      return { ...c, other_user: other, last_message: last, unread: count ?? 0 }
    }))

    setConversations(enriched)
    setLoading(false)
  }, [user])

  const getOrCreate = useCallback(async (otherId) => {
    if (!user) return null
    const [p1, p2] = user.id < otherId ? [user.id, otherId] : [otherId, user.id]
    const { data: ex } = await supabase
      .from('conversations').select('*')
      .eq('participant_1', p1).eq('participant_2', p2).single()
    if (ex) return ex
    const { data } = await supabase
      .from('conversations').insert({ participant_1: p1, participant_2: p2 })
      .select('*').single()
    await fetch()
    return data
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
