'use client';
import { Person } from '@/schemas/user';
import { useState } from 'react';
import Modal from './generic/modal';
import PersonCard from './personCard';
import PersonForm from './personForm';

interface GalleryProps {
  people: Person[];
}

export default function Gallery({ people }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleCloseModal = () => {
    setSelectedIndex(null);
  };

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < people.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {people.map((person, index) => (
          <PersonCard
            key={person.id}
            person={person}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>
      {selectedIndex !== null && (
        <Modal onClose={handleCloseModal}>
          <PersonForm
            person={people[selectedIndex]}
            disabled
            onPrev={selectedIndex > 0 ? handlePrev : undefined}
            onNext={selectedIndex < people.length - 1 ? handleNext : undefined}
          />
        </Modal>
      )}
    </>
  );
}
