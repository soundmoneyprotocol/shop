'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let supabaseClient: SupabaseClient | null = null;

function initializeSupabase() {
  if (!supabaseClient && typeof window !== 'undefined') {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseClient;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = initializeSupabase();

    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!mounted) return;

        if (data.session?.user) {
          const { data: buyer } = await supabase
            .from('buyers')
            .select('*')
            .eq('email', data.session.user.email)
            .single();

          if (mounted) {
            setUser({
              id: data.session.user.id,
              email: data.session.user.email!,
              firstName: buyer?.first_name,
              lastName: buyer?.last_name,
            });
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
        try {
          const { data: buyer } = await supabase
            .from('buyers')
            .select('*')
            .eq('email', session.user.email)
            .single();

          if (mounted) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              firstName: buyer?.first_name,
              lastName: buyer?.last_name,
            });
          }
        } catch (error) {
          console.error('Error fetching buyer profile:', error);
        }
      } else {
        if (mounted) {
          setUser(null);
        }
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const supabase = initializeSupabase();
    if (!supabase) throw new Error('Supabase client not initialized');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    const supabase = initializeSupabase();
    if (!supabase) throw new Error('Supabase client not initialized');

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      await supabase.from('buyers').insert({
        email,
        first_name: firstName,
        last_name: lastName,
        profile_completed: true,
      });
    }
  };

  const logout = async () => {
    const supabase = initializeSupabase();
    if (!supabase) throw new Error('Supabase client not initialized');

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
