'use client';
import Button from '@/components/generic/button';
import LoadingSpinner from '@/components/generic/loadingSpinner';
import PersonForm from '@/components/personForm';
import { client } from '@/lib/supabase';
import { useAuth } from './authProvider';

export default function Home() {
  const { session, person, loading } = useAuth();

  const handleLinkedIn = async () => {
    console.log('HHASHADSJKHJK');
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000/'}auth/callback`,
      },
    });
    if (error) {
      throw new Error(error.message);
    }
    if (data?.url) {
      window.location.href = data.url;
    } else {
      throw new Error('Failed to sign in with LinkedIn');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return (
      <div className="container mx-auto pt-20 text-center">
        <div className="container mx-auto pt-20 text-center">
          <h1 className="mb-5 text-6xl font-white font-extrabold">ENKK</h1>
          <p className="mb-8 font-white text-2xl">Jäsenmatrikkeli</p>
          <div className="flex justify-center">
            <Button
              label={'Login with LinkedIn'}
              type="button"
              onClick={handleLinkedIn}
            />
          </div>
        </div>
      </div>
    );
  }

  return <PersonForm person={person} />;
}
