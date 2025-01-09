import { cn } from '@/lib/helpers';
import { ContactInfo } from '@/schemas/user';
import { PlusIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { contactInfoTypes } from '../schemas/contactInfoTypes';
import ContactCard from './contactCard';
import Label from './generic/label';

interface ContactInfoListProps {
  contactInfo: {
    [key: string]: ContactInfo;
  };
  onUpdate: (updatedInfo: { [key: string]: ContactInfo }) => void;
}

const ContactInfoList: React.FC<ContactInfoListProps> = ({
  contactInfo,
  onUpdate,
}) => {
  const handleEdit = (key: string, updatedValue: ContactInfo) => {
    const newContactInfo = {
      ...contactInfo,
      [key]: updatedValue,
    };
    onUpdate(newContactInfo);
  };

  const handleKeyChange = (newKey: string, oldKey: string) => {
    if (newKey === oldKey) return;

    if (Object.prototype.hasOwnProperty.call(contactInfo, newKey)) {
      return;
    }
    const newContactInfo = { ...contactInfo };
    newContactInfo[newKey] = newContactInfo[oldKey];
    delete newContactInfo[oldKey];
    onUpdate(newContactInfo);
  };
  const handleAdd = () => {
    const usedTypes = Object.keys(contactInfo);
    const available = contactInfoTypes.find((t) => !usedTypes.includes(t.type));
    if (!available) return;
    const newContactInfo = { ...contactInfo };
    newContactInfo[available.type] = {
      id: crypto.randomUUID(),
      data: '',
      order: Object.keys(contactInfo).length,
    };
    onUpdate(newContactInfo);
  };
  const handleDelete = (key: string) => {
    const newContactInfo = { ...contactInfo };
    delete newContactInfo[key];
    onUpdate(newContactInfo);
  };
  const usedTypes = Object.keys(contactInfo);
  const sortedContactInfo = Object.entries(contactInfo).sort(
    ([, a], [, b]) => a.order - b.order,
  );
  return (
    <div className="max-w-lg mt-1">
      <div className="flex items-center justify-between mb-1">
        <Label
          name="Yhteystiedot"
          className={cn(
            'h-[16px] w-fit text-gray-900 transition ease-in-out font-bold',
          )}
        />
        <button
          className={cn(
            'p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition',
            {
              'bg-gray-500 hover:bg-gray-500 hover:cursor-default':
                usedTypes.length === contactInfoTypes.length,
            },
          )}
          onClick={handleAdd}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="mb-2 space-y-1">
        {sortedContactInfo.map(([key, info]) => (
          <ContactCard
            key={info.id}
            usedTypes={usedTypes}
            initialType={key}
            initialValue={info.data}
            onTypeChange={(newKey) => handleKeyChange(newKey, key)}
            onValueChange={(value) => handleEdit(key, { ...info, data: value })}
            onDelete={() => handleDelete(key)}
          />
        ))}
      </div>
    </div>
  );
};

export default ContactInfoList;
