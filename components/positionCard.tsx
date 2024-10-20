import LabeledInput from './generic/labeledInput';
import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

const PositionCard = ({ position, onChange, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mb-2 rounded-lg bg-white p-2 shadow-md">
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-lg font-semibold">{position.title}</h3>
        {expanded ? (
          <ChevronUpIcon className="h-6 w-6 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-6 w-6 text-gray-500" />
        )}
      </div>
      {expanded && (
        <>
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
          <button
            className="mt-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700"
            onClick={() => onDelete(position.id)}
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default PositionCard;
