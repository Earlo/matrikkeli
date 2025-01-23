'use client';
import React, { useState } from 'react';
import { contactInfoTypes } from '../schemas/contactInfoTypes';
import EntryCard from './entryCard';
import LabeledInput from './generic/labeledInput';

interface ContactCardProps {
  initialType?: string;
  initialValue?: string;
  onTypeChange: (type: string) => void;
  onValueChange: (value: string) => void;
  onDelete: () => void;
  usedTypes: string[];
}

const ContactCard: React.FC<ContactCardProps> = ({
  initialType = '',
  initialValue = '',
  onTypeChange,
  onValueChange,
  onDelete,
  usedTypes,
}) => {
  const [type, setType] = useState(initialType);
  const [value, setValue] = useState(initialValue);

  const handleTypeChange = (newType: string) => {
    setType(newType);
    onTypeChange(newType);
  };

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  return (
    <EntryCard
      onDelete={onDelete}
      label={
        <div className="flex items-center">
          {contactInfoTypes.find((t) => t.type === type)?.icon}
          <span className="ml-2 text-gray-700 font-medium">
            {value || 'New Contact'}
          </span>
        </div>
      }
    >
      <div className="flex items-end">
        <select
          className="h-[2.1em] mr-1 rounded-md border border-gray-200 pl-2 shadow-xs sm:text-sm"
          value={type}
          onChange={(e) => handleTypeChange(e.target.value)}
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
        />
      </div>
    </EntryCard>
  );
};

export default ContactCard;
