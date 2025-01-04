'use client';
import { ArrowsPointingInIcon, TrashIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import LabeledInput from './generic/labeledInput';
interface ContactCardProps {
  types: { type: string; text: string }[];
  initialType?: string;
  initialValue?: string;
  onMinimize: (type: string, value: string) => void;
  onCancel?: () => void;
  isEditMode?: boolean;
}

const ContactCard: React.FC<ContactCardProps> = ({
  types,
  initialType = '',
  initialValue = '',
  onMinimize,
  onCancel,
  isEditMode = false,
}) => {
  const [type, setType] = useState(initialType);
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    if (type.trim() && value.trim()) {
      onMinimize(type, value);
      setType('');
      setValue('');
    }
  };

  return (
    <div className="flex flex-col w-full">
      <h4 className="text-lg font-semibold flex items-center justify-between">
        {isEditMode ? 'Edit Contact' : 'Add New Contact'}
        <div className="flex gap-2">
          <ArrowsPointingInIcon
            className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={handleSave}
          />
          <TrashIcon
            className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-700"
            onClick={() => onCancel()}
          />
        </div>
      </h4>
      <div className="flex pb-1 items-end">
        <select
          className="h-[2.7em] mr-1 rounded-md border rounded-br-none border-gray-200 pl-2 shadow-sm sm:text-sm"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Select Type</option>
          {types.map((type) => (
            <option key={type.type} value={type.type}>
              {type.type}
            </option>
          ))}
        </select>
        <LabeledInput
          className="w-full"
          name={types.find((t) => t.type === type)?.text || 'Value'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ContactCard;
