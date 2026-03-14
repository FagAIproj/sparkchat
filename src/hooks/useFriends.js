import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useFriends() {
  const { user } = useAuth()
  const [friends,   setFriends]   = useState([])
  const [received,  setReceived]  = useState([])
  const [sent,      setSent]      = useState([])
  const [loading,   setLoading]   = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('friendships')
      .select(`
        *,
        requester:profiles!friendships_requester_id_fkey(id,username,avatar_url,friend_code,is_online,last_seen),
        addressee:profiles!friendships_addressee_id_fkey(id,username,avatar_url,friend_code,is_online,last_seen)
      `)
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
      .neq('status', 'blocked')

    if (!data) return
    setFriends(data.filter(f => f.status === 'accepted'))
    setReceived(data.filter(f => f.status === 'pending' && f.addressee_id === user.id))
    setSent(data.filter(f => f.status === 'pending' && f.requester_id === user.id))
    setLoading(false)
  }, [user])

  const findByCode = useCallback(async (code) => {
    const { data } = await supabase
      .from('profiles').select('*')
      .eq('friend_code', code.toUpperCase().trim()).single()
    if (!data || data.id === user?.id) return null
    return data
  }, [user])

  const sendRequest = useCallback(async (addresseeId) => {
    if (!user) return { error: 'Not authenticated' }
    const { data: ex } = await supabase
      .from('friendships').select('*')
      .or(`and(requester_id.eq.${user.id},addressee_id.eq.${addresseeId}),and(requester_id.eq.${addresseeId},addressee_id.eq.${user.id})`)
      .single()
    if (ex) return { error: ex.status === 'accepted' ? 'Already friends' : 'Request already sent' }
    const { error } = await supabase.from('friendships')
      .insert({ requester_id: user.id, addressee_id: addresseeId, status: 'pending' })
    if (!error) fetch()
    return { error }
  }, [user, fetch])

  const accept  = useCallback(async (id) => { await supabase.from('friendships').update({ status: 'accepted' }).eq('id', id); fetch() }, [fetch])
  const decline = useCallback(async (id) => { await supabase.from('friendships').delete().eq('id', id); fetch() }, [fetch])

  const getOther = useCallback((f) =>
    f.requester_id === user?.id ? f.addressee : f.requester, [user])

  useEffect(() => {
    if (!user) return
    fetch()
    const ch = supabase.channel('friends:' + user.id)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'friendships' }, fetch)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [user, fetch])

  return { friends, received, sent, loading, findByCode, sendRequest, accept, decline, getOther, refresh: fetch }
}
