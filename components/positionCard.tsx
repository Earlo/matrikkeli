import EntryCard from './entryCard';
import LabeledInput from './generic/labeledInput';
const PositionCard = ({ position, onChange, onDelete }) => {
  return (
    <EntryCard
      onDelete={() => onDelete(position.id)}
      label={
        <span className=" text-gray-700 font-medium">
          {position.title || 'New Position'}
        </span>
      }
    >
      <LabeledInput
        name="title"
        value={position.title}
        onChange={(e) => onChange(e, position.id)}
      />
      <LabeledInput
        name="organization"
        value={position.organization}
        onChange={(e) => onChange(e, position.id)}
      />
      <div className="flex">
        <LabeledInput
          name="start"
          type="date"
          value={position.start}
          onChange={(e) => onChange(e, position.id)}
          wrapperClassName="grow mr-2"
        />
        <LabeledInput
          name="end"
          type="date"
          value={position.end}
          onChange={(e) => onChange(e, position.id)}
          wrapperClassName="grow"
        />
      </div>
      <LabeledInput
        name="description"
        value={position.description}
        onChange={(e) => onChange(e, position.id)}
        multiline
      />
    </EntryCard>
  );
};

export default PositionCard;
