'use client';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import { FC, ReactNode, useState } from 'react';

export interface EntryCardProps {
  onDelete?: () => void;
  children: ReactNode;
  label: ReactNode;
  disabled?: boolean;
}

const EntryCard: FC<EntryCardProps> = ({
  onDelete,
  children,
  label,
  disabled = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="flex w-full flex-col rounded-lg bg-white p-1 shadow-md transition-shadow hover:shadow-lg">
      <div className="flex items-center justify-between">
        {label}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="focus:outline-none"
          >
            {isExpanded ? (
              <ChevronUpIcon className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700" />
            )}
          </button>
          {onDelete && !disabled && (
            <TrashIcon
              className="h-5 w-5 cursor-pointer text-red-500 hover:text-red-700"
              onClick={onDelete}
            />
          )}
        </div>
      </div>
      {isExpanded ? children : null}
    </div>
  );
};

export default EntryCard;
