'use client';
import React, { useState } from 'react';
import Button from './generic/button';
import LabeledInput from './generic/labeledInput';

interface ContactCardProps {
  types: { type: string; text: string }[];
  initialType?: string;
  initialValue?: string;
  onSave: (type: string, value: string) => void;
  onCancel?: () => void;
  isEditMode?: boolean;
}

const ContactCard: React.FC<ContactCardProps> = ({
  types,
  initialType = '',
  initialValue = '',
  onSave,
  onCancel,
  isEditMode = false,
}) => {
  const [type, setType] = useState(initialType);
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    if (type.trim() && value.trim()) {
      onSave(type, value);
      setType('');
      setValue('');
    }
  };

  return (
    <div className="flex flex-col w-full">
      <h4 className="text-lg font-semibold">
        {isEditMode ? 'Edit Contact' : 'Add New Contact'}
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
      <div className="flex pb-1 justify-end">
        {onCancel && (
          <Button
            label="Cancel"
            onClick={onCancel}
            className="bg-red-500 mr-4 text-white"
          />
        )}
        <Button
          label="Save"
          onClick={handleSave}
          className="bg-blue-500 text-white"
        />
      </div>
    </div>
  );
};

export default ContactCard;
