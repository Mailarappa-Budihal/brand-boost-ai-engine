
import { useEffect, useState } from 'react'
import { User, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session) => {
        setUser(session?.user ?? null)
        setLoading(false)

        // Create profile when user signs up
        if (event === 'SIGNED_UP' && session?.user) {
          await createUserProfile(session.user)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const createUserProfile = async (user: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email!.split('@')[0],
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`
        })

      if (error) throw error
    } catch (error) {
      console.error('Error creating user profile:', error)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return {
    user,
    loading,
    signOut
  }
}
