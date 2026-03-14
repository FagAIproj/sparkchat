import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [session,  setSession]  = useState(null)
  const [profile,  setProfile]  = useState(null)
  const [loading,  setLoading]  = useState(true)

  const fetchProfile = useCallback(async (uid) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single()
    if (data) setProfile(data)
  }, [])

  /* ── bootstrap ─────────────────────────────────── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) fetchProfile(session.user.id).finally(() => setLoading(false))
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )
    return () => subscription.unsubscribe()
  }, [fetchProfile])

  /* ── online status ──────────────────────────────── */
  useEffect(() => {
    if (!session?.user) return
    const uid = session.user.id
    const set = (v) => supabase.from('profiles')
      .update({ is_online: v, last_seen: new Date().toISOString() })
      .eq('id', uid)
    set(true)
    window.addEventListener('beforeunload', () => set(false))
    return () => { set(false); window.removeEventListener('beforeunload', () => set(false)) }
  }, [session])

  /* ── methods ────────────────────────────────────── */
  const signUp = (email, password) =>
    supabase.auth.signUp({ email, password })

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + window.location.pathname },
    })

  const signOut = async () => {
    if (session?.user) {
      await supabase.from('profiles')
        .update({ is_online: false, last_seen: new Date().toISOString() })
        .eq('id', session.user.id)
    }
    await supabase.auth.signOut()
  }

  const updateProfile = async (updates) => {
    if (!session?.user) return { error: 'Not authenticated' }
    const { error } = await supabase.from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', session.user.id)
    if (!error) setProfile(p => ({ ...p, ...updates }))
    return { error }
  }

  const refreshProfile = () => session?.user && fetchProfile(session.user.id)

  return (
    <Ctx.Provider value={{
      session, profile, loading,
      signUp, signIn, signInWithGoogle, signOut,
      updateProfile, refreshProfile,
      user: session?.user ?? null,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
