'use client';

import Gallery from '@/components/gallery';
import { client } from '@/lib/supabase/client';
import { Person, Role } from '@/schemas/user';
import { useEffect, useState } from 'react';
import { useAuth } from '../authProvider';

export default function GalleryPage() {
  const { session } = useAuth();
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<Role | null>(null);

  useEffect(() => {
    if (!session) return;
    const fetchUserRole = async () => {
      try {
        const { data, error } = await client
          .from('people')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
        } else if (data && data.role) {
          setCurrentUserRole(data.role);
        }
      } catch (error) {
        console.error('Unhandled error while fetching user role:', error);
      }
    };
    fetchUserRole();
  }, [session]);

  useEffect(() => {
    setLoading(true);

    const fetchPeople = async () => {
      try {
        let query = client.from('people').select('*');

        if (
          !showAll ||
          (currentUserRole !== 'admin' && currentUserRole !== 'super_admin')
        ) {
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
  }, [showAll, currentUserRole]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Matrikkeli Gallery</h1>

      {currentUserRole === 'admin' || currentUserRole === 'super_admin' ? (
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="checkbox"
            id="toggleShowAll"
            checked={showAll}
            onChange={() => setShowAll((prev) => !prev)}
            className="w-5 h-5 accent-blue-600"
          />
          <label htmlFor="toggleShowAll" className="text-sm text-gray-700">
            Näytä kaikki (Tämän pitäisi näkyä vain admin-käyttäjille)
          </label>
        </div>
      ) : null}

      {loading ? <p>Ladataan...</p> : <Gallery people={people} />}
    </div>
  );
}
