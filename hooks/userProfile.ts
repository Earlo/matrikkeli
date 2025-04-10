'use client';

import { client } from '@/lib/supabase/browser';
import { Person } from '@/schemas/user';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useUserProfile() {
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrCreate = async () => {
      const {
        data: { session },
        error,
      } = await client.auth.getSession();

      if (error || !session?.user) {
        console.warn('No session');
        setLoading(false);
        return;
      }

      const { id, email, user_metadata } = session.user;

      const { data, error: fetchError } = await client
        .from('people')
        .select()
        .eq('user_id', id)
        .maybeSingle();

      if (fetchError) {
        console.error(fetchError);
        setLoading(false);
        return;
      }

      if (data) {
        setPerson(data);
        setLoading(false);
        return;
      }

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
      }

      setPerson(inserted ?? null);
      setLoading(false);
    };

    fetchOrCreate();
  }, []);

  return { person, loading };
}
