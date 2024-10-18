// components/Positions.js
import LabeledInput from './generic/labeledInput';
import React, { useState } from 'react';
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

const Positions = ({
  positions = [],
  setPositions,
  buttonText,
}: {
  positions: {
    id: number;
    title: string;
    organization: string;
    start: string;
    end: string;
    description: string;
  }[];
  setPositions: (
    positions: {
      id: number;
      title: string;
      organization: string;
      start: string;
      end: string;
      description: string;
    }[],
  ) => void;
  buttonText?: string;
}) => {
  const handleAddPosition = () => {
    setPositions([
      ...positions,
      {
        id: positions.length + 1,
        title: '',
        organization: '',
        start: new Date().toISOString().split('T')[0], // sets today's date
        end: '',
        description: '',
      },
    ]);
  };

  const handleChange = (e, id) => {
    const { name, value } = e.target;
    const updatedPositions = positions.map((pos) =>
      pos.id === id ? { ...pos, [name]: value } : pos,
    );
    setPositions(updatedPositions);
  };

  const handleDelete = (id) => {
    setPositions(positions.filter((pos) => pos.id !== id));
  };
  if (!Array.isArray(positions)) {
    // Should never happen, but just in case, since production gets weird "t.sort is not a function" error
    console.error('Positions is not an array', positions, typeof positions);
    return null;
  }
  // Sort positions by start date
  positions.sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );

  return (
    <div>
      {positions.map((position) => (
        <PositionCard
          key={position.id}
          position={position}
          onChange={handleChange}
          onDelete={handleDelete}
        />
      ))}
      <button
        className="mb-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        onClick={handleAddPosition}
      >
        {buttonText || 'Add position'}
      </button>
    </div>
  );
};

export default Positions;
