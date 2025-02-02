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
  disabled?: boolean;
}

export default function PersonForm({
  person,
  disabled = false,
}: PersonFormProps) {
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
    } catch (err) {
      console.error('Update failed:', err.message);
    }
  };

  return (
    <div className="flex h-full w-full flex-col justify-center self-center p-2 sm:w-lg">
      <div className="flex flex-row max-w-lg">
        <ImageUploader
          className="w-40 h-40"
          icon={formState?.image_url_session}
          path={`matrikkeli/user/${formState.user_id}`}
          setIcon={(value) =>
            setFormState((prev) => ({ ...prev!, image_url_session: value }))
          }
          disabled={disabled}
        />
        <div className="flex flex-col ml-1 grow justify-between">
          <LabeledInput
            wrapperClassName="mt-0"
            name="Etunimi"
            value={formState.first_name}
            onChange={(e) =>
              !disabled &&
              setFormState((prev) => ({ ...prev!, first_name: e.target.value }))
            }
            disabled={disabled}
          />
          <LabeledInput
            wrapperClassName="mt-0"
            name="Sukunimi"
            value={formState.last_name}
            onChange={(e) =>
              !disabled &&
              setFormState((prev) => ({ ...prev!, last_name: e.target.value }))
            }
            disabled={disabled}
          />
          <LabeledInput
            wrapperClassName="mt-0"
            name="Syntymäpäivä"
            type="date"
            onChange={(e) =>
              !disabled &&
              setFormState((prev) => ({ ...prev!, birthday: e.target.value }))
            }
            value={formState.birthday || ''}
            disabled={disabled}
          />
        </div>
      </div>
      <LabeledInput
        name="Esittely"
        value={formState.description}
        onChange={(e) =>
          !disabled &&
          setFormState((prev) => ({ ...prev!, description: e.target.value }))
        }
        multiline
        className="max-w-lg"
        wrapperClassName="mt-0"
        disabled={disabled}
      />
      <ContactInfoList
        contactInfo={formState.contact_info}
        onUpdate={(updatedInfo) =>
          !disabled &&
          setFormState((prev) => ({ ...prev!, contact_info: updatedInfo }))
        }
        disabled={disabled}
      />
      <Positions
        label="Kamarihistoria"
        positions={formState.roles}
        setPositions={(roles) =>
          !disabled && setFormState((prev) => ({ ...prev!, roles }))
        }
        disabled={disabled}
      />
      <Positions
        label="Työhistoria"
        positions={formState.work_history}
        setPositions={(work_history) =>
          !disabled && setFormState((prev) => ({ ...prev!, work_history }))
        }
        disabled={disabled}
      />
      <QAInputList
        questions={formState.questions || []}
        onUpdate={(updatedQuestions) =>
          !disabled &&
          setFormState((prev) => ({ ...prev!, questions: updatedQuestions }))
        }
        disabled={disabled}
      />
      {!disabled && (
        <Button
          label={hasPendingChanges() ? 'Tallenna' : 'Ei muutoksia'}
          type="button"
          onClick={handleUpdate}
          disabled={!hasPendingChanges()}
          className="max-w-lg mt-1"
        />
      )}
    </div>
  );
}
