import { client } from '@/lib/supabase';
import { AuthError, Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

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

  const attachUserRole = async (session: Session) => {
    try {
      const userId = session.user.id;
      const { data: roleData, error: roleError } = await client
        .from('people')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError) {
        console.error('Error fetching role:', roleError);
        return session;
      }

      if (roleData?.role) {
        session.user.user_metadata = {
          ...session.user.user_metadata,
          role: roleData.role,
        };
      }
      return session;
    } catch (err) {
      console.error('Unhandled error while attaching user role:', err);
      return session;
    }
  };

  useEffect(() => {
    const fetchSessionAndRole = async () => {
      setLoading(true);
      const { data, error } = await client.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }

      if (data?.session) {
        const sessionWithRole = await attachUserRole(data.session);
        setSession(sessionWithRole);
      } else {
        setSession(null);
      }

      setLoading(false);
    };

    fetchSessionAndRole();

    const { data: listener } = client.auth.onAuthStateChange(
      async (event, newSession) => {
        if (newSession) {
          const sessionWithRole = await attachUserRole(newSession);
          setSession(sessionWithRole);
        } else {
          setSession(null);
        }
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
