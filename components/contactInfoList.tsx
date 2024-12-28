'use client';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import Button from './generic/button';
import LabeledInput from './generic/labeledInput';

interface ContactInfo {
  type: string;
  value: string;
}

interface ContactInfoListProps {
  contactInfo: ContactInfo[];
  onUpdate: (updatedInfo: ContactInfo[]) => void;
}

const contactTypeOptions = [
  { type: 'Email', icon: 'envelope' },
  { type: 'Phone', icon: 'phone' },
  { type: 'Website', icon: 'globe' },
  { type: 'LinkedIn', icon: 'linkedin' },
  { type: 'Twitter', icon: 'twitter' },
  { type: 'Facebook', icon: 'facebook' },
  { type: 'Instagram', icon: 'instagram' },
];

const ContactInfoList: React.FC<ContactInfoListProps> = ({
  contactInfo,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [newType, setNewType] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleSave = () => {
    if (newType.trim() && newValue.trim()) {
      onUpdate([...contactInfo, { type: newType, value: newValue }]);
      setNewType('');
      setNewValue('');
    }
  };

  const handleEditSave = (index: number) => {
    const updatedInfo = [...contactInfo];
    updatedInfo[index] = { type: newType, value: newValue };
    onUpdate(updatedInfo);
    setIsEditing(null);
    setNewType('');
    setNewValue('');
  };

  const handleDelete = (index: number) => {
    const updatedInfo = contactInfo.filter((_, i) => i !== index);
    onUpdate(updatedInfo);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium">Contact Information</h3>
      <ul className="mt-2 space-y-2">
        {contactInfo.map((info, index) => (
          <li
            key={index}
            className="flex items-center justify-between border-b pb-2"
          >
            {isEditing === index ? (
              <div className="flex w-full gap-2">
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                >
                  <option value="">Select type</option>
                  {contactTypeOptions.map((option) => (
                    <option key={option.type} value={option.type}>
                      {option.type}
                    </option>
                  ))}
                </select>
                <LabeledInput
                  name="Value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
                <Button label="Save" onClick={() => handleEditSave(index)} />
              </div>
            ) : (
              <>
                <span>
                  {info.type}:{' '}
                  {contactTypeOptions.find((opt) => opt.type === info.type)
                    ?.icon ? (
                    <i
                      className={`icon-${contactTypeOptions.find((opt) => opt.type === info.type)?.icon}`}
                    />
                  ) : null}{' '}
                  {info.value}
                </span>
                <div className="flex gap-2">
                  <PencilIcon
                    className="h-5 w-5 text-gray-500 cursor-pointer"
                    onClick={() => {
                      setIsEditing(index);
                      setNewType(info.type);
                      setNewValue(info.value);
                    }}
                  />
                  <TrashIcon
                    className="h-5 w-5 text-red-500 cursor-pointer"
                    onClick={() => handleDelete(index)}
                  />
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2">
        <select
          className="block w-full rounded-md border-gray-300 shadow-sm"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
        >
          <option value="">Select type</option>
          {contactTypeOptions.map((option) => (
            <option key={option.type} value={option.type}>
              {option.type}
            </option>
          ))}
        </select>
        <LabeledInput
          name="New Value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
        <Button label="Add" onClick={handleSave} />
      </div>
    </div>
  );
};

export default ContactInfoList;
