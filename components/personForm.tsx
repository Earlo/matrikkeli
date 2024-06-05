'use client';
import Button from './generic/button';
import ImageUploader from './generic/imageUploader';
import LabeledInput from './generic/labeledInput';
import { useAuth } from '@/app/authProvider';
import { client } from '@/lib/supabase';
import { useState, useEffect } from 'react';

interface PersonFormProps {
  onClose?: () => void;
}

export default function PersonForm({ onClose }: PersonFormProps) {
  //get user from database if logged in
  const { session, loading } = useAuth();
  const [formState, seFormState] = useState({});

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
          seFormState(newUser.data[0]);
        }
        return null;
      }
      seFormState(user.data);
      return null;
    };
    getUser();
  }, [session]);

  if (loading || !formState) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex h-full w-full flex-col justify-center p-4 sm:w-96">
      <ImageUploader
        name="Kuva"
        icon={formState.image_url_session}
        onChange={(e) =>
          seFormState({ ...formState, image_url_session: e.target.value })
        }
      />
      <LabeledInput
        name="Etunimi"
        value={formState.first_name}
        onChange={(e) =>
          seFormState({ ...formState, first_name: e.target.value })
        }
      />
      <LabeledInput
        name="Sukunimi"
        value={formState.last_name}
        onChange={(e) =>
          seFormState({ ...formState, last_name: e.target.value })
        }
      />
      <LabeledInput
        name="Sähköposti"
        value={formState.email}
        onChange={(e) => seFormState({ ...formState, email: e.target.value })}
      />
      <Button
        label={'Tallenna'}
        type="button"
        onClick={async () => {
          const { data, error } = await client
            .from('people')
            .update({
              email: formState.email,
              first_name: formState.first_name,
              last_name: formState.last_name,
              image_url_session: session.user.user_metadata.picture,
            })
            .eq('user_id', session.user.id);
          if (error) {
            throw new Error(error.message);
          }
          if (data) {
            console.log(data);
          } else {
            throw new Error('Failed to save person');
          }
        }}
      />
    </div>
  );
}
