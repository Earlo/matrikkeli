'use client';
import { useAuth } from './authProvider';
import BaseLayout from '@/components/layout/baseLayout';
import LoadingSpinner from '@/components/generic/loadingSpinner';
import Button from '@/components/generic/button';
import { client } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export default function Home() {
  const { session, loading } = useAuth();
  const [userFormState, setUserFormState] = useState({});

  const handleLinkedIn = async () => {
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
    });
    console.log('got', data, error);
    if (error) {
      throw new Error(error.message);
    }
    if (data) {
      console.log(data);
    } else {
      throw new Error('Failed to sign in with LinkedIn');
    }
  };

  //get user from database if logged in
  useEffect(() => {
    const getUser = async () => {
      if (!session) {
        console.log('no session');
        return null;
      }
      const user = await client
        .from('people')
        .select()
        .eq('user_id', session.user.id)
        .single();
      if (user.error || !user.data) {
        const newUser = await client
          .from('people')
          .insert({
            user_id: session.user.id,
            email: session.user.email,
            first_name: session.user.user_metadata.given_name,
            last_name: session.user.user_metadata.family_name,
            image_url_session: session.user.user_metadata.picture,
          })
          .select()
          .single();
        console.log('newUser', newUser);
        if (newUser.error) {
          throw new Error(newUser.error.message);
        } else if (newUser.data) {
          setUserFormState(newUser.data[0]);
        }
        return null;
      }
      setUserFormState(user.data);
      return null;
    };
    getUser();
  }, [session]);

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
      {session ? (
        <BaseLayout>
          <div>
            <h1>{userFormState.first_name}</h1>
            <p>{userFormState.email}</p>
          </div>
        </BaseLayout>
      ) : (
        <LandingPage />
      )}
    </>
  );
}
