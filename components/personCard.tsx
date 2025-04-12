'use client';
import { cn } from '@/lib/helpers';
import { Person } from '@/schemas/user';
import { useRef } from 'react';
import PorfileImage from './generic/profileImage';

interface PersonCardProps {
  person: Person;
  onClick: () => void;
}

export default function PersonCard({ person, onClick }: PersonCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const shortDescription = person.description
    ? person.description.length > 50
      ? `${person.description.substring(0, 50)}...`
      : person.description
    : '';

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cardRef.current.style.transformOrigin = `${x}px ${y}px`;
    }
  };

  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onClick={onClick}
      className={cn(
        'border rounded p-2 transition transform duration-200 cursor-pointer hover:shadow-lg active:scale-98',
      )}
    >
      <div className="flex items-center">
        <PorfileImage
          src={person.image_url_session}
          alt={`${person.first_name} ${person.last_name}`}
          size={64}
          className="w-16 h-16"
        />
        <div className="ml-4">
          <h2 className="text-xl font-semibold">
            {person.first_name} {person.last_name}
          </h2>
          <p className="text-sm text-gray-600">{shortDescription}</p>
        </div>
      </div>
    </div>
  );
}
