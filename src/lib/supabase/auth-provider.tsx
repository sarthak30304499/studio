'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { getProfile, type Profile } from '@/lib/supabase/db'

interface AuthContextType {
    user: User | null
    session: Session | null
    profile: Profile | null
    profileLoading: boolean
    loading: boolean
    signOut: () => Promise<void>
    refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    profile: null,
    profileLoading: true,
    loading: true,
    signOut: async () => { },
    refreshProfile: async () => { },
})

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [profileLoading, setProfileLoading] = useState(true)
    const supabase = createClient()

    const fetchProfile = async (userId: string) => {
        setProfileLoading(true)
        try {
            const p = await getProfile(userId)
            setProfile(p)
        } finally {
            setProfileLoading(false)
        }
    }

    const refreshProfile = async () => {
        if (user?.id) await fetchProfile(user.id)
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
            if (session?.user) fetchProfile(session.user.id)
            else setProfileLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session)
                setUser(session?.user ?? null)
                setLoading(false)
                if (session?.user) fetchProfile(session.user.id)
                else { setProfile(null); setProfileLoading(false) }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{ user, session, profile, profileLoading, loading, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
