import { ContactInfo } from '@/schemas/user';
import { contactInfoTypes } from '../schemas/contactInfoTypes';
import ContactCard from './contactCard';
import AddLabel from './generic/addLabel';

export interface ContactInfoListProps {
  contactInfo: { [key: string]: ContactInfo };
  onUpdate: (updatedInfo: { [key: string]: ContactInfo }) => void;
  disabled?: boolean;
}

const ContactInfoList: React.FC<ContactInfoListProps> = ({
  contactInfo,
  onUpdate,
  disabled = false,
}) => {
  const handleEdit = (key: string, updatedValue: ContactInfo) => {
    if (disabled) return;
    const newContactInfo = {
      ...contactInfo,
      [key]: updatedValue,
    };
    onUpdate(newContactInfo);
  };

  const handleKeyChange = (newKey: string, oldKey: string) => {
    if (disabled) return;
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
    if (disabled) return;
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
    if (disabled) return;
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
      <AddLabel
        label="Yhteystiedot"
        handleAdd={handleAdd}
        disabled={disabled || usedTypes.length === contactInfoTypes.length}
      />
      <div className="space-y-1">
        {sortedContactInfo.map(([key, info]) => (
          <ContactCard
            key={info.id}
            usedTypes={usedTypes}
            initialType={key}
            initialValue={info.data}
            onTypeChange={(newKey) => handleKeyChange(newKey, key)}
            onValueChange={(value) => handleEdit(key, { ...info, data: value })}
            onDelete={() => handleDelete(key)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default ContactInfoList;
