import { client } from '@/lib/supabase';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, AuthError } from '@supabase/supabase-js';

// Create a context for the auth state
interface AuthContextProps {
  session: Session | null;
  logout: () => Promise<{ error: AuthError | null }>;
  loading?: boolean;
}
const AuthContext = createContext<AuthContextProps>({
  session: null,
  logout: async () => ({
    error: null,
  }),
  loading: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Check active sessions and set the user
      const { data, error } = await client.auth.getSession();
      if (!error && data) {
        setSession(data.session);
      } else {
        console.error(error);
      }
      setLoading(false);
    };
    setLoading(true);
    fetchData();
    const { data: listener } = client.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    logout: () => client.auth.signOut(),
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
