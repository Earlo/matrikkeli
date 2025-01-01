'use client';
import { useAuth } from '@/app/authProvider';
import { client } from '@/lib/supabase';
import { Person } from '@/schemas/user';
import { useEffect, useState } from 'react';
import ContactInfoList from './contactInfoList';
import Button from './generic/button';
import ImageUploader from './generic/imageUploader';
import Label from './generic/label';
import LabeledInput from './generic/labeledInput';
import Positions from './Positions';
import QAInputList from './qaInputList';

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
      contact_info: { Email: email },
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
      questions: [],
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
    contact_info: data.contact_info || {},
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
        value={formState?.last_name}
        onChange={(e) =>
          setFormState((prev) => ({ ...prev!, last_name: e.target.value }))
        }
      />
      <LabeledInput
        name="birthday"
        type="date"
        onChange={(e) =>
          setFormState((prev) => ({
            ...prev!,
            birthday: new Date(e.target.value),
          }))
        }
        wrapperClassName="grow"
      />
      <ContactInfoList
        contactInfo={Object.entries(formState?.contact_info || {}).map(
          ([type, value]) => ({ type, value }),
        )}
        onUpdate={(updatedInfo) =>
          setFormState((prev) => ({
            ...prev!,
            contact_info: updatedInfo.reduce(
              (acc, { type, value }) => {
                acc[type] = value;
                return acc;
              },
              {} as Record<string, string>,
            ),
          }))
        }
      />
      <LabeledInput
        name="Esittely"
        value={formState?.description}
        onChange={(e) =>
          setFormState((prev) => ({ ...prev!, description: e.target.value }))
        }
        multiline
      />
      <Label name="Kamarihistoria:" className="mt-2" />
      <Positions
        positions={formState?.roles}
        setPositions={(roles) => setFormState((prev) => ({ ...prev!, roles }))}
        buttonText="Lisää merkintä"
      />
      <Label name="Työhistoria:" className="mt-2" />
      <Positions
        positions={formState?.work_history}
        setPositions={(work_history) =>
          setFormState((prev) => ({ ...prev!, work_history }))
        }
        buttonText="Lisää työhistoriamerkintä"
      />
      <QAInputList
        questions={formState?.questions || []}
        onUpdate={(updatedQuestions) =>
          setFormState((prev) => ({ ...prev!, questions: updatedQuestions }))
        }
      />
      <Button label="Tallenna" type="button" onClick={handleUpdate} />
    </div>
  );
}
