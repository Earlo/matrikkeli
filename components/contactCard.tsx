'use client';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import { contactInfoTypes } from '../schemas/contactInfoTypes';
import LabeledInput from './generic/labeledInput';

interface ContactCardProps {
  initialType?: string;
  initialValue?: string;
  isExpanded: boolean;
  onTypeChange: (type: string) => void;
  onValueChange: (value: string) => void;
  onToggleExpand: () => void;
  onDelete: () => void;
  usedTypes: string[];
}

const ContactCard: React.FC<ContactCardProps> = ({
  initialType = '',
  initialValue = '',
  isExpanded,
  onTypeChange,
  onValueChange,
  onToggleExpand,
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
  console.log('type is', type);
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {contactInfoTypes.find((t) => t.type === type)?.icon}
          <span
            className="ml-2 text-gray-700 font-medium cursor-pointer"
            onClick={onToggleExpand}
          >
            {value || 'New Contact'}
          </span>
        </div>
        <div className="flex gap-2">
          {isExpanded ? (
            <ChevronUpIcon
              className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={onToggleExpand}
            />
          ) : (
            <ChevronDownIcon
              className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={onToggleExpand}
            />
          )}
          <TrashIcon
            className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-700"
            onClick={onDelete}
          />
        </div>
      </div>
      {isExpanded && (
        <div className="flex items-end">
          <select
            className="h-[2.7em] mr-1 rounded-md border border-gray-200 pl-2 shadow-sm sm:text-sm"
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="">Select Type</option>
            {contactInfoTypes.map(
              (t) =>
                !usedTypes.includes(t.type) && (
                  <option key={t.type} value={t.type}>
                    {t.type}
                  </option>
                ),
            )}
          </select>
          <LabeledInput
            wrapperClassName="w-full"
            name={
              contactInfoTypes.find((t) => t.type === type)?.text || 'Value'
            }
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default ContactCard;
