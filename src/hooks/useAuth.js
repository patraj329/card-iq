import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useAuth = create((set) => ({
  user: null,
  loading: true,

  init() {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ user: session?.user ?? null, loading: false })
    })

    // Listen for auth changes (login, logout, token refresh)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, loading: false })
    })
  },

  async signUp(email, password) {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  },

  async signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  },

  async signOut() {
    await supabase.auth.signOut()
  },
}))

export default useAuth
