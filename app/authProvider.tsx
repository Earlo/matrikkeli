import { client } from '@/lib/supabase';
import { Person } from '@/schemas/user';
import { AuthError, Session } from '@supabase/supabase-js';
import crypto from 'crypto';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextProps {
  session: Session | null;
  logout: () => Promise<{ error: AuthError | null }>;
  loading?: boolean;
  person?: Person;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  logout: async () => ({ error: null }),
  loading: false,
  person: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [person, setPerson] = useState<Person | null>(null);
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

  const fetchOrCreateUserData = async (
    session: Session,
  ): Promise<Person | null> => {
    try {
      const userId = session.user.id;
      const email = session.user.email!;
      // Check for existing person row
      const { data, error } = await client
        .from('people')
        .select()
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching person data:', error);
        return null;
      }

      if (!data) {
        const newUser: Partial<Person> = {
          user_id: userId,
          email,
          contact_info: {
            Email: { data: email, order: 0, id: crypto.randomUUID() },
          },
          first_name: '',
          last_name: '',
          roles: [],
          image_url_session: '',
          description: '',
          birthday: '',
          work_history: [],
          joined: '',
          left: '',
          qr_code: '',
          questions: [],
        };

        const { error: insertError, data: insertedData } = await client
          .from('people')
          .insert(newUser)
          .single();

        if (insertError) {
          console.error('Error inserting person data:', insertError);
          return null;
        }
        return insertedData as Person;
      }

      // If row does exist, make sure we have a fallback for contact_info
      return {
        ...data,
        contact_info: data.contact_info || {},
      } as Person;
    } catch (err) {
      console.error('Unhandled error in fetchOrCreateUserData:', err);
      return null;
    }
  };

  /**
   * Main effect that runs once on mount to initialize session + person data.
   */
  useEffect(() => {
    const fetchSessionAndRoleAndPerson = async () => {
      setLoading(true);
      const { data, error } = await client.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }

      // If we have a Supabase session, also attach role + fetch Person
      if (data?.session) {
        const sessionWithRole = await attachUserRole(data.session);
        setSession(sessionWithRole);

        // Here we fetch or create the person row
        const fetchedPerson = await fetchOrCreateUserData(sessionWithRole);
        setPerson(fetchedPerson);
      } else {
        // No session => user is logged out
        setSession(null);
        setPerson(null);
      }

      setLoading(false);
    };

    fetchSessionAndRoleAndPerson();

    // Listen to onAuthStateChange so that we can update user data
    // whenever the session changes (login/logout).
    const { data: listener } = client.auth.onAuthStateChange(
      async (event, newSession) => {
        if (newSession) {
          const sessionWithRole = await attachUserRole(newSession);
          setSession(sessionWithRole);

          const fetchedPerson = await fetchOrCreateUserData(sessionWithRole);
          setPerson(fetchedPerson);
        } else {
          setSession(null);
          setPerson(null);
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextProps = {
    session,
    person,
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
