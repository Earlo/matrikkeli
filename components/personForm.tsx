'use client';
import { client } from '@/lib/supabase/browser';
import { Person } from '@/schemas/user';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import ContactInfoList from './contactInfoList';
import Button from './generic/button';
import ImageUploader from './generic/imageUploader';
import LabeledInput from './generic/labeledInput';
import PorfileImage from './generic/profileImage';
import ToggleSwitch from './generic/toggleSwitch';
import Positions from './Positions';
import QAInputList from './qaInputList';

export interface PersonFormProps {
  person: Person;
  disabled?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function PersonForm({
  person,
  disabled = false,
  onPrev,
  onNext,
}: PersonFormProps) {
  const [formState, setFormState] = useState<Person>(person);
  const [originalState, setOriginalState] = useState(JSON.stringify(person));

  const hasPendingChanges = () => JSON.stringify(formState) !== originalState;

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

  if (disabled) {
    return (
      <div className="flex flex-col p-1 sm:w-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={onPrev}
            disabled={!onPrev}
            className="rounded-full bg-gray-200 p-2 hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>

          <h1 className="text-2xl font-bold">
            {person.first_name} {person.last_name}
          </h1>

          <button
            onClick={onNext}
            disabled={!onNext}
            className="mr-6 rounded-full bg-gray-200 p-2 hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-1 flex">
          <div className="relative h-32 w-32 flex-shrink-0">
            <PorfileImage
              src={person.image_url_session}
              alt={`${person.first_name} ${person.last_name}`}
              size={128}
              className="h-32 w-32"
            />
          </div>
          <div className="ml-1 flex-grow">
            <p className="text-sm whitespace-pre-wrap text-gray-700">
              {person.description}
            </p>
          </div>
        </div>
        <ContactInfoList
          contactInfo={person.contact_info}
          onUpdate={() => {}}
          disabled={true}
        />
        <Positions
          label="Kamarihistoria"
          positions={person.roles}
          setPositions={() => {}}
          disabled={true}
        />
        <Positions
          label="Työhistoria"
          positions={person.work_history}
          setPositions={() => {}}
          disabled={true}
        />
        <QAInputList
          questions={person.questions || []}
          onUpdate={() => {}}
          disabled={true}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-center self-center p-2 sm:w-lg">
      <div className="flex max-w-lg flex-row">
        <ImageUploader
          className="h-40 w-40"
          icon={formState?.image_url_session}
          path={`matrikkeli/user/${formState.user_id}`}
          setIcon={(value) =>
            setFormState((prev) => ({ ...prev!, image_url_session: value }))
          }
          disabled={disabled}
        />
        <div className="ml-1 flex grow flex-col justify-between">
          <div className="flex">
            <LabeledInput
              wrapperClassName="mt-0 mr-2"
              name="Etunimi"
              value={formState.first_name}
              onChange={(e) =>
                !disabled &&
                setFormState((prev) => ({
                  ...prev!,
                  first_name: e.target.value,
                }))
              }
              disabled={disabled}
            />
            <ToggleSwitch
              label="Julkinen profiili"
              checked={formState.public}
              onChange={(checked) =>
                setFormState((prev) => ({ ...prev!, public: checked }))
              }
              disabled={disabled}
            />
          </div>
          <LabeledInput
            wrapperClassName="mt-0"
            name="Sukunimi"
            value={formState.last_name}
            onChange={(e) =>
              !disabled &&
              setFormState((prev) => ({
                ...prev!,
                last_name: e.target.value,
              }))
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
          className="mt-1 max-w-lg"
        />
      )}
    </div>
  );
}
