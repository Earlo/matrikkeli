'use client';
import { client } from '@/lib/supabase/browser';
import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const {
        data: { session },
      } = await client.auth.getSession();
      setSession(session ?? null);
      setLoading(false);
    };

    fetch();

    const { data: listener } = client.auth.onAuthStateChange(
      async (_, newSession) => {
        setSession(newSession ?? null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
}
