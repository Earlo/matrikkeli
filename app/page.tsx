'use client';
import { useAuth } from './authProvider';
import BaseLayout from '@/components/layout/baseLayout';
import LoadingSpinner from '@/components/generic/loadingSpinner';
import Button from '@/components/generic/button';
import { client } from '@/lib/supabase';

export default function Home() {
  const { session, loading } = useAuth();

  const handleLinkedIn = async () => {
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
    });
    if (error) {
      throw new Error(error.message);
    }
    if (data) {
      console.log(data);
    } else {
      throw new Error('Failed to sign in with LinkedIn');
    }
  };

  const LandingPage = () => (
    <BaseLayout>
      <div className="container mx-auto pt-20 text-center">
        <h1 className="mb-5 text-6xl font-extrabold">ENKK</h1>
        <p className="mb-8 text-2xl">Jäsenmatrikkeli</p>
        <div className="flex justify-center">
          <Button
            label={'Login with LinkedIn'}
            type="button"
            onClick={handleLinkedIn}
          />
        </div>
      </div>
    </BaseLayout>
  );

  return (
    <>
      {loading && (
        <BaseLayout className="items-center justify-center">
          <LoadingSpinner />
        </BaseLayout>
      )}
      {session ? <BaseLayout>Welcome</BaseLayout> : <LandingPage />}
    </>
  );
}
