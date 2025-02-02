'use client';
import { cn } from '@/lib/helpers';
import { Person } from '@/schemas/user';
import Image from 'next/image';
import { useState } from 'react';
import Modal from './generic/modal';
import PersonForm from './personForm';

interface PersonCardProps {
  person: Person;
}

export default function PersonCard({ person }: PersonCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shortDescription = person.description
    ? person.description.length > 50
      ? `${person.description.substring(0, 50)}...`
      : person.description
    : '';

  return (
    <>
      <div
        className="border rounded p-2 hover:shadow-lg transition duration-200 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center">
          {person.image_url_session ? (
            <Image
              src={person.image_url_session || '/blank_user.png'}
              alt={`${person.first_name} ${person.last_name}`}
              className={cn(
                'rounded-tl-full rounded-tr-full rounded-bl-full rounded-br-none bg-orange-700 w-16 h-16',
              )}
              width={192}
              height={192}
            />
          ) : (
            <div className="rounded-full bg-gray-300 mr-4 w-16 h-16" />
          )}
          <div className="ml-4">
            <h2 className="text-xl font-semibold">
              {person.first_name} {person.last_name}
            </h2>
            <p className="text-sm text-gray-600">{shortDescription}</p>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <PersonForm person={person} disabled />
        </Modal>
      )}
    </>
  );
}
