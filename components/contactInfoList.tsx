import { cn } from '@/lib/helpers';
import { PlusIcon } from '@heroicons/react/24/solid';
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
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleEdit = (index: number, type: string, value: string) => {
    const updatedInfo = [...contactInfo];
    updatedInfo[index] = { type, value };
    onUpdate(updatedInfo);
  };

  const handleAdd = () => {
    onUpdate([...contactInfo, { type: '', value: '' }]);
    setExpandedIndices((prev) => [...prev, contactInfo.length]);
  };

  const handleDelete = (index: number) => {
    const updatedInfo = contactInfo.filter((_, i) => i !== index);
    onUpdate(updatedInfo);
    setExpandedIndices((prev) => prev.filter((i) => i !== index));
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
            'p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition',
            {
              'bg-gray-500 hover:bg-gray-500 hover:cursor-default':
                contactInfo.length === contactInfoTypes.length,
            },
          )}
          onClick={handleAdd}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      <ul className="mb-2 space-y-1">
        {contactInfo.map((info, index) => (
          <li
            key={index}
            className="p-1 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <ContactCard
              usedTypes={contactInfo.map((info) => info.type)}
              initialType={info.type}
              initialValue={info.value}
              isExpanded={expandedIndices.includes(index)}
              onTypeChange={(type) => handleEdit(index, type, info.value)}
              onValueChange={(value) => handleEdit(index, info.type, value)}
              onToggleExpand={() => toggleExpand(index)}
              onDelete={() => handleDelete(index)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactInfoList;
