'use client';
import { client } from '@/lib/supabase/client';
import { Person } from '@/schemas/user';
import { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface UserContextProps {
  person: Person | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextProps>({
  person: null,
  loading: true,
  logout: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrCreatePerson = async () => {
    const {
      data: { session },
      error,
    } = await client.auth.getSession();

    if (error || !session?.user) {
      console.warn('No session found');
      return null;
    }

    const { id, email, user_metadata } = session.user;

    const { data, error: fetchError } = await client
      .from('people')
      .select()
      .eq('user_id', id)
      .maybeSingle();

    if (fetchError) {
      console.error(fetchError);
      return null;
    }

    if (data) return data;

    const newPerson: Partial<Person> = {
      user_id: id,
      email,
      contact_info: {
        Email: { data: email, order: 0, id: uuidv4() },
      },
      first_name: user_metadata?.given_name || '',
      last_name: user_metadata?.family_name || '',
      image_url_session: user_metadata?.picture || '',
    };

    const { data: inserted, error: insertError } = await client
      .from('people')
      .upsert([newPerson], { onConflict: 'user_id' })
      .select()
      .single();

    if (insertError) {
      console.error('Insert failed:', insertError);
      return null;
    }

    return inserted as Person;
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const fetched = await fetchOrCreatePerson();
      setPerson(fetched);
      setLoading(false);
    };

    init();

    const { data: listener } = client.auth.onAuthStateChange(
      async (_, session) => {
        if (session) {
          const fetched = await fetchOrCreatePerson();
          setPerson(fetched);
        } else {
          setPerson(null);
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        person,
        loading,
        logout: async () => {
          await client.auth.signOut();
          setPerson(null);
          window.location.href = '/login';
        },
      }}
    >
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
