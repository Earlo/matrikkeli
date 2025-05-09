'use client';
import React, { useState } from 'react';
import { contactInfoTypes } from '../schemas/contactInfoTypes';
import EntryCard from './entryCard';
import LabeledInput from './generic/labeledInput';

export interface ContactCardProps {
  initialType?: string;
  initialValue?: string;
  onTypeChange: (type: string) => void;
  onValueChange: (value: string) => void;
  onDelete: () => void;
  usedTypes: string[];
  disabled?: boolean;
}

const ContactCard: React.FC<ContactCardProps> = ({
  initialType = '',
  initialValue = '',
  onTypeChange,
  onValueChange,
  onDelete,
  usedTypes,
  disabled = false,
}) => {
  const [type, setType] = useState(initialType);
  const [value, setValue] = useState(initialValue);

  const handleTypeChange = (newType: string) => {
    if (disabled) return;
    setType(newType);
    onTypeChange(newType);
  };

  const handleValueChange = (newValue: string) => {
    if (disabled) return;
    setValue(newValue);
    onValueChange(newValue);
  };

  return (
    <EntryCard
      onDelete={disabled ? undefined : onDelete}
      label={
        <div className="flex items-center">
          {contactInfoTypes.find((t) => t.type === type)?.icon}
          <span className="ml-2 font-medium text-gray-700">
            {value || 'New Contact'}
          </span>
        </div>
      }
      disabled={disabled}
    >
      <div className="flex items-end">
        <select
          className="mr-1 h-[2.1em] rounded-md border border-gray-200 pl-2 shadow-xs sm:text-sm"
          value={type}
          onChange={(e) => handleTypeChange(e.target.value)}
          disabled={disabled}
        >
          {type === '' && <option value="">Select Type</option>}
          {contactInfoTypes.map((t) => (
            <option
              key={t.type}
              value={t.type}
              disabled={usedTypes.includes(t.type) && t.type !== type}
            >
              {t.type}
            </option>
          ))}
        </select>
        <LabeledInput
          wrapperClassName="w-full"
          name={contactInfoTypes.find((t) => t.type === type)?.text || 'Value'}
          value={value}
          onChange={(e) => handleValueChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </EntryCard>
  );
};

export default ContactCard;
