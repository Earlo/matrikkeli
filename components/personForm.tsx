'use client';
import Button from './generic/button';
import ImageUploader from './generic/imageUploader';
import Label from './generic/label';
import LabeledInput from './generic/labeledInput';
import Positions from './Positions';
import { useAuth } from '@/app/authProvider';
import { client } from '@/lib/supabase';
import { Person } from '@/schemas/user';
import { useState, useEffect } from 'react';

interface PersonFormProps {
  onClose?: () => void;
}

export default function PersonForm({ onClose }: PersonFormProps) {
  const { session, loading } = useAuth();
  const [formState, setFormState] = useState<Person | null>(null);

  useEffect(() => {
    const getUser = async () => {
      if (!session) {
        console.log('no session');
        return;
      }
      const { data, error } = await client
        .from('people')
        .select()
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user:', error.message);
        return;
      }

      if (!data) {
        // Insert new user if not found
        const newUser = {
          user_id: session.user.id,
          email: session.user.email,
          first_name: session.user.user_metadata.given_name,
          last_name: session.user.user_metadata.family_name,
          image_url: session.user.user_metadata.picture,
          roles: [],
          image_url_session: '',
          description: '',
          birthday: new Date(),
          work_history: [],
          joined: new Date(),
          left: new Date(),
          qr_code: '',
        } as Person;
        const { error: newUserError } = await client
          .from('people')
          .insert(newUser)
          .single();

        if (newUserError) {
          console.error('Error creating new user:', newUserError.message);
          return;
        }

        setFormState(newUser);
        return;
      }
      console.log('User found:', data);
      setFormState({ ...data, roles: JSON.parse(data.roles) });
    };

    getUser();
  }, [session]);

  const handleUpdate = async () => {
    if (!formState) return;

    const updatedData = {
      ...formState,
      roles: JSON.stringify(formState.roles),
    };

    const { data, error } = await client
      .from('people')
      .update(updatedData)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Failed to save person:', error.message);
      return;
    }

    console.log('Person updated successfully:', data);
  };

  if (loading || !formState) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full w-full flex-col justify-center p-4 sm:w-96">
      <ImageUploader
        icon={formState.image_url_session}
        path={'matrikkeli/user/' + session.user.id}
        setIcon={(value) =>
          setFormState({ ...formState, image_url_session: value })
        }
      />
      <LabeledInput
        name="Etunimi"
        value={formState.first_name}
        onChange={(e) =>
          setFormState({ ...formState, first_name: e.target.value })
        }
      />
      <LabeledInput
        name="Sukunimi"
        value={formState.last_name}
        onChange={(e) =>
          setFormState({ ...formState, last_name: e.target.value })
        }
      />
      <LabeledInput
        name="Sähköposti"
        value={formState.email}
        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
      />
      <LabeledInput
        name="Esittely"
        value={formState.description}
        onChange={(e) =>
          setFormState({ ...formState, description: e.target.value })
        }
        multiline
      />
      <Label name="Kamarihistoria:" className="mt-2" />
      <Positions
        positions={formState.roles}
        setPositions={(roles) => setFormState({ ...formState, roles })}
        buttonText="Lisää merkintä"
      />
      <Label name="Työhistoria:" className="mt-2" />
      <Positions
        positions={formState.work_history}
        setPositions={(work_history) =>
          setFormState({ ...formState, work_history })
        }
        buttonText="Lisää työhistoriamerkintä"
      />
      <Button label={'Tallenna'} type="button" onClick={handleUpdate} />
    </div>
  );
}
