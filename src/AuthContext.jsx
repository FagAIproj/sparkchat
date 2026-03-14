import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [session,  setSession]  = useState(null)
  const [profile,  setProfile]  = useState(null)
  const [loading,  setLoading]  = useState(true)

  const fetchProfile = useCallback(async (uid) => {
    try {
      const { data, error } = await supabase
        .from('profiles').select('*').eq('id', uid).single()

      if (data) { setProfile(data); return data }

      // No profile found — create it manually (trigger may have failed)
      if (error?.code === 'PGRST116' || !data) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null
        const email      = user.email ?? ''
        const rawName    = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') || 'user'
        const friendCode = Math.random().toString(36).substring(2, 8).toUpperCase()
        const { data: created } = await supabase.from('profiles').upsert({
          id: uid,
          email,
          username: rawName + '_' + uid.slice(0, 4),
          friend_code: friendCode,
          is_online: true,
        }).select('*').single()
        if (created) { setProfile(created); return created }
      }
    } catch (e) { console.warn('fetchProfile:', e) }
    return null
  }, [])

  useEffect(() => {
    let dead = false
    // Safety net — never spin forever
    const bail = setTimeout(() => { if (!dead) setLoading(false) }, 5000)

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (dead) return
      setSession(session)
      if (session?.user) fetchProfile(session.user.id).finally(() => { if (!dead) { setLoading(false); clearTimeout(bail) } })
      else { setLoading(false); clearTimeout(bail) }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (dead) return
      setSession(session)
      if (session?.user) await fetchProfile(session.user.id)
      else setProfile(null)
      setLoading(false); clearTimeout(bail)
    })

    return () => { dead = true; clearTimeout(bail); subscription.unsubscribe() }
  }, [fetchProfile])

  useEffect(() => {
    if (!session?.user) return
    const uid = session.user.id
    const set = (v) => supabase.from('profiles').update({ is_online: v, last_seen: new Date().toISOString() }).eq('id', uid)
    set(true)
    window.addEventListener('beforeunload', () => set(false))
    return () => { set(false); window.removeEventListener('beforeunload', () => set(false)) }
  }, [session])

  const signUp = (email, password) =>
    supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + window.location.pathname } })

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + window.location.pathname } })

  const signOut = async () => {
    if (session?.user) await supabase.from('profiles').update({ is_online: false, last_seen: new Date().toISOString() }).eq('id', session.user.id)
    await supabase.auth.signOut()
  }

  const updateProfile = async (updates) => {
    if (!session?.user) return { error: 'Not authenticated' }
    const { error } = await supabase.from('profiles').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', session.user.id)
    if (!error) setProfile(p => ({ ...p, ...updates }))
    return { error }
  }

  const refreshProfile = () => session?.user ? fetchProfile(session.user.id) : Promise.resolve()

  return (
    <Ctx.Provider value={{ session, profile, loading, signUp, signIn, signInWithGoogle, signOut, updateProfile, refreshProfile, user: session?.user ?? null }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
