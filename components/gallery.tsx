'use client';

import { Person } from '@/schemas/user';
import PersonCard from './personCard';

interface GalleryProps {
  people: Person[];
}

export default function Gallery({ people }: GalleryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {people.map((person) => (
        <PersonCard key={person.id} person={person} />
      ))}
    </div>
  );
}
