'use client';
import { client } from '@/lib/supabase';
import { Person } from '@/schemas/user';
import { useState } from 'react';
import ContactInfoList from './contactInfoList';
import Button from './generic/button';
import ImageUploader from './generic/imageUploader';
import LabeledInput from './generic/labeledInput';
import Positions from './Positions';
import QAInputList from './qaInputList';

interface PersonFormProps {
  person: Person;
}

export default function PersonForm({ person }: PersonFormProps) {
  const [formState, setFormState] = useState<Person>(person);
  const [originalState, setOriginalState] = useState(JSON.stringify(person));

  const hasPendingChanges = () => {
    return JSON.stringify(formState) !== originalState;
  };

  const handleUpdate = async () => {
    if (!formState) return;
    try {
      const { error: updateError } = await client
        .from('people')
        .update(formState)
        .eq('user_id', formState.user_id);
      if (updateError) {
        throw new Error(updateError.message);
      } else {
        setOriginalState(JSON.stringify(formState));
      }
    } catch (err: any) {
      console.error('Update failed:', err.message);
    }
  };

  return (
    <div className="flex h-full w-full flex-col justify-center self-center p-2 sm:w-96">
      <div className="flex flex-row">
        <ImageUploader
          icon={formState?.image_url_session}
          path={`matrikkeli/user/${formState.user_id}`}
          setIcon={(value) =>
            setFormState((prev) => ({ ...prev!, image_url_session: value }))
          }
        />
        <div className="flex flex-col ml-2">
          <LabeledInput
            name="Etunimi"
            value={formState.first_name}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev!, first_name: e.target.value }))
            }
          />
          <LabeledInput
            name="Sukunimi"
            value={formState.last_name}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev!, last_name: e.target.value }))
            }
          />
        </div>
      </div>
      <LabeledInput
        name="Syntymäpäivä"
        type="date"
        onChange={(e) =>
          setFormState((prev) => ({
            ...prev!,
            birthday: e.target.value,
          }))
        }
        value={formState.birthday || ''}
      />
      <LabeledInput
        name="Esittely"
        value={formState.description}
        onChange={(e) =>
          setFormState((prev) => ({ ...prev!, description: e.target.value }))
        }
        multiline
      />
      <ContactInfoList
        contactInfo={formState.contact_info}
        onUpdate={(updatedInfo) =>
          setFormState((prev) => ({ ...prev!, contact_info: updatedInfo }))
        }
      />
      <Positions
        label="Kamarihistoria"
        positions={formState.roles}
        setPositions={(roles) => setFormState((prev) => ({ ...prev!, roles }))}
        buttonText="Lisää merkintä"
      />
      <Positions
        label="Työhistoria"
        positions={formState.work_history}
        setPositions={(work_history) =>
          setFormState((prev) => ({ ...prev!, work_history }))
        }
        buttonText="Lisää työhistoriamerkintä"
      />
      <QAInputList
        questions={formState.questions || []}
        onUpdate={(updatedQuestions) =>
          setFormState((prev) => ({ ...prev!, questions: updatedQuestions }))
        }
      />
      <Button
        label={hasPendingChanges() ? 'Tallenna' : 'Ei muutoksia'}
        type="button"
        onClick={handleUpdate}
        disabled={!hasPendingChanges()}
      />
    </div>
  );
}
