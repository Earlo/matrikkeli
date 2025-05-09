'use client';

import Gallery from '@/components/gallery';
import { useUserProfile } from '@/hooks/userProfile';
import { client } from '@/lib/supabase/browser';
import { Person } from '@/schemas/user';
import { useEffect, useState } from 'react';

export default function GalleryPage() {
  const { person } = useUserProfile();
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const isAdmin = person?.role === 'admin' || person?.role === 'super_admin';

  useEffect(() => {
    if (!person) return;

    setLoading(true);

    const fetchPeople = async () => {
      try {
        let query = client.from('people').select('*');

        if (!showAll || !isAdmin) {
          query = query.eq('public', true);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching people:', error.message);
        } else if (data) {
          setPeople(data as Person[]);
        }
      } catch (error) {
        console.error('Unhandled error while fetching people:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, [showAll, person, isAdmin]);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold text-white">Matrikkeli Gallery</h1>

      {isAdmin && (
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="checkbox"
            id="toggleShowAll"
            checked={showAll}
            onChange={() => setShowAll((prev) => !prev)}
            className="h-5 w-5 accent-blue-600"
          />
          <label htmlFor="toggleShowAll" className="text-sm text-gray-700">
            Näytä kaikki (Tämän pitäisi näkyä vain admin-käyttäjille)
          </label>
        </div>
      )}

      {loading ? <p>Ladataan...</p> : <Gallery people={people} />}
    </div>
  );
}
