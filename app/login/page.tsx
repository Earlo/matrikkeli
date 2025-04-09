'use client';

import Button from '@/components/generic/button';
import LoadingSpinner from '@/components/generic/loadingSpinner';
import { client } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '../userProvider';
import { login } from './actions';

export default function LoginPage() {
  const { loading } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return;
    }

    if (code) {
      (async () => {
        const { error } = await client.auth.exchangeCodeForSession(code);
        if (error) {
          console.error('Error exchanging code:', error.message);
        } else {
          // Redirect to root or dashboard after login
          router.push('/');
        }
      })();
    }
  }, [searchParams, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto pt-20 text-center">
      <h1 className="mb-5 text-6xl font-white font-extrabold">ENKK</h1>
      <p className="mb-8 font-white text-2xl">Jäsenmatrikkeli</p>
      <div className="flex justify-center">
        <Button
          label={'Login with LinkedIn'}
          type="button"
          onClick={() => login()}
        />
      </div>
    </div>
  );
}
