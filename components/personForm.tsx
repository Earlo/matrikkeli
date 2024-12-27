'use client';
import { useAuth } from '@/app/authProvider';
import { client } from '@/lib/supabase';
import { Person } from '@/schemas/user';
import { useEffect, useState } from 'react';
import Button from './generic/button';
import ImageUploader from './generic/imageUploader';
import Label from './generic/label';
import LabeledInput from './generic/labeledInput';
import Positions from './Positions';

interface PersonFormProps {
  onClose?: () => void;
}

const fetchUserData = async (userId: string, email: string) => {
  const { data, error } = await client
    .from('people')
    .select()
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) {
    const newUser: Person = {
      user_id: userId,
      email,
      contact_info: { email },
      first_name: '',
      last_name: '',
      roles: [],
      image_url_session: '',
      description: '',
      birthday: new Date(),
      work_history: [],
      joined: new Date(),
      left: new Date(),
      qr_code: '',
    };
    const { error: insertError } = await client
      .from('people')
      .insert(newUser)
      .single();
    if (insertError) throw new Error(insertError.message);
    return newUser;
  }
  return {
    ...data,
    contact_info: {
      ...data.contact_info,
      email: data.contact_info.email || data.email,
    },
  };
};

export default function PersonForm({ onClose }: PersonFormProps) {
  const { session, loading } = useAuth();
  const [formState, setFormState] = useState<Person | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;

    (async () => {
      try {
        const userData = await fetchUserData(
          session.user.id,
          session.user.email,
        );
        setFormState(userData);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [session]);

  const handleUpdate = async () => {
    if (!formState) return;
    try {
      const { error: updateError } = await client
        .from('people')
        .update(formState)
        .eq('user_id', session?.user.id);

      if (updateError) throw new Error(updateError.message);
      console.log('Person updated successfully');
    } catch (err) {
      console.error('Update failed:', err.message);
    }
  };

  if (loading || !formState) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex h-full w-full flex-col justify-center self-center p-4 sm:w-96">
      <ImageUploader
        icon={formState?.image_url_session}
        path={`matrikkeli/user/${session?.user.id}`}
        setIcon={(value) =>
          setFormState((prev) => ({ ...prev!, image_url_session: value }))
        }
      />
      <LabeledInput
        name="Etunimi"
        value={formState?.first_name}
        onChange={(e) =>
          setFormState((prev) => ({ ...prev!, first_name: e.target.value }))
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
        name="birthday"
        type="date"
        onChange={(e) =>
          setFormState({ ...formState, birthday: new Date(e.target.value) })
        }
        wrapperClassName="grow"
      />
      <LabeledInput
        name="Sähköposti"
        value={formState.contact_info.email}
        onChange={(e) =>
          setFormState({
            ...formState,
            contact_info: { ...formState.contact_info, email: e.target.value },
          })
        }
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
      <Button label="Tallenna" type="button" onClick={handleUpdate} />
    </div>
  );
}
