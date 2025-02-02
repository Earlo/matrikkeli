import { Position } from '@/schemas/user';
import EntryCard from './entryCard';
import LabeledInput from './generic/labeledInput';

export interface PositionCardProps {
  position: Position;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: number,
  ) => void;
  onDelete: (id: number) => void;
  disabled?: boolean;
}

const PositionCard: React.FC<PositionCardProps> = ({
  position,
  onChange,
  onDelete,
  disabled = false,
}) => {
  return (
    <EntryCard
      onDelete={disabled ? undefined : () => onDelete(position.id)}
      label={
        <span className="text-gray-700 font-medium">
          {position.title || 'New Position'}
        </span>
      }
      disabled={disabled}
    >
      <LabeledInput
        name="title"
        value={position.title}
        onChange={(e) => !disabled && onChange(e, position.id)}
        disabled={disabled}
      />
      <LabeledInput
        name="organization"
        value={position.organization}
        onChange={(e) => !disabled && onChange(e, position.id)}
        disabled={disabled}
      />
      <div className="flex">
        <LabeledInput
          name="start"
          type="date"
          value={position.start}
          onChange={(e) => !disabled && onChange(e, position.id)}
          wrapperClassName="grow mr-2"
          disabled={disabled}
        />
        <LabeledInput
          name="end"
          type="date"
          value={position.end}
          onChange={(e) => !disabled && onChange(e, position.id)}
          wrapperClassName="grow"
          disabled={disabled}
        />
      </div>
      <LabeledInput
        name="description"
        value={position.description}
        onChange={(e) => !disabled && onChange(e, position.id)}
        multiline
        disabled={disabled}
      />
    </EntryCard>
  );
};

export default PositionCard;
