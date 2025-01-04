import { cn } from '@/lib/helpers';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import { contactInfoTypes } from '../schemas/contactInfoTypes';
import ContactCard from './contactCard';
import Label from './generic/label';
interface ContactInfo {
  type: string;
  value: string;
}

interface ContactInfoListProps {
  contactInfo: ContactInfo[];
  onUpdate: (updatedInfo: ContactInfo[]) => void;
}

const ContactInfoList: React.FC<ContactInfoListProps> = ({
  contactInfo,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleEditSave = (index: number, type: string, value: string) => {
    const updatedInfo = [...contactInfo];
    updatedInfo[index] = { type, value };
    onUpdate(updatedInfo);
    setIsEditing(null);
  };

  const handleAddSave = (type: string, value: string) => {
    onUpdate([...contactInfo, { type, value }]);
    setIsAdding(false);
  };

  const handleDelete = (index: number) => {
    const updatedInfo = contactInfo.filter((_, i) => i !== index);
    onUpdate(updatedInfo);
  };

  return (
    <div className="max-w-lg my-2">
      <div className="flex items-center justify-between mb-1">
        <Label
          name="Yhteystiedot"
          className={cn(
            'h-[16px] w-fit text-gray-900 transition ease-in-out font-bold',
          )}
        />
        <button
          className={cn(
            'p-1 bg-blue-500 text-white rounded-full transition',
            isAdding ? 'bg-gray-500' : 'hover:bg-blue-600',
          )}
          disabled={isAdding}
          onClick={() => setIsAdding(!isAdding)}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      <ul className="mb-2 space-y-1">
        {contactInfo.map((info, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-1 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            {isEditing === index ? (
              <ContactCard
                types={contactInfoTypes}
                initialType={info.type}
                initialValue={info.value}
                onMinimize={(type, value) => handleEditSave(index, type, value)}
                onCancel={() => {
                  handleDelete(index);
                  setIsEditing(null);
                }}
                isEditMode
              />
            ) : (
              <>
                <div className="flex items-center">
                  {contactInfoTypes.find((t) => t.type === info.type)?.icon}
                  <span className="ml-2 text-gray-700 font-medium">
                    {info.value}
                  </span>
                </div>
                <div className="flex gap-2">
                  <PencilIcon
                    className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700"
                    onClick={() => setIsEditing(index)}
                  />
                  <TrashIcon
                    className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-700"
                    onClick={() => handleDelete(index)}
                  />
                </div>
              </>
            )}
          </li>
        ))}
        {isAdding && (
          <li className="flex items-center justify-between p-1 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <ContactCard
              types={contactInfoTypes}
              onMinimize={handleAddSave}
              onCancel={() => setIsAdding(false)}
            />
          </li>
        )}
      </ul>
    </div>
  );
};

export default ContactInfoList;
