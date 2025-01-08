'use client';

import LoadingSpinner from '@/components/generic/loadingSpinner';
import PersonForm from '@/components/personForm';
import { client } from '@/lib/supabase';
import { Person } from '@/schemas/user';
import { useEffect, useState } from 'react';
import { useAuth } from '../authProvider';
// Adjust or expand as needed
type Role = 'user' | 'admin' | 'super_admin';

export default function AdminPage() {
  const { session, loading } = useAuth();
  const [currentUserRole, setCurrentUserRole] = useState<Role | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(true);

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

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
    if (currentUserRole !== 'admin' && currentUserRole !== 'super_admin') {
      setLoadingPeople(false);
      return;
    }

    const fetchPeople = async () => {
      setLoadingPeople(true);
      try {
        const { data, error } = await client.from('people').select('*');
        if (error) {
          console.error('Error fetching people:', error);
        } else if (data) {
          setPeople(data as Person[]);
        }
      } catch (error) {
        console.error('Unhandled error while fetching people:', error);
      } finally {
        setLoadingPeople(false);
      }
    };

    fetchPeople();
  }, [currentUserRole]);

  // For changing role
  const handleChangeRole = async (personId: number, newRole: Role) => {
    if (currentUserRole !== 'super_admin') return;
    try {
      const { error } = await client
        .from('people')
        .update({ role: newRole })
        .eq('id', personId);
      // or .eq('user_id', personId) if your primary key is user_id

      if (error) {
        console.error('Error updating role:', error);
        return;
      }
      // Update local state
      setPeople((prev) =>
        prev.map((person) =>
          person.id === personId ? { ...person, role: newRole } : person,
        ),
      );
    } catch (error) {
      console.error('Unhandled error while changing role:', error);
    }
  };

  const handleEditPerson = (person: Person) => {
    setSelectedPerson(person);
  };

  if (loading) {
    return (
      <div className="p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-4">
        <h2>Access Denied</h2>
        <p>You must be logged in to view this page.</p>
      </div>
    );
  }

  if (currentUserRole !== 'admin' && currentUserRole !== 'super_admin') {
    return (
      <div className="p-4">
        <h2>Access Denied</h2>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  // Admin or Super_Admin view
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {loadingPeople ? (
        <LoadingSpinner />
      ) : (
        <table className="min-w-full border">
          <thead className="border-b">
            <tr>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Current Role</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id} className="border-b">
                <td className="px-4 py-2">{person.email}</td>
                <td className="px-4 py-2">{person.role}</td>
                <td className="px-4 py-2 space-x-2">
                  {/* If super_admin => show role update buttons */}
                  {currentUserRole === 'super_admin' && (
                    <>
                      <button
                        onClick={() => handleChangeRole(person.id, 'user')}
                        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
                      >
                        Set User
                      </button>
                      <button
                        onClick={() => handleChangeRole(person.id, 'admin')}
                        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
                      >
                        Set Admin
                      </button>
                    </>
                  )}

                  {/* === New: Edit button to open PersonForm === */}
                  <button
                    onClick={() => handleEditPerson(person)}
                    className="px-2 py-1 rounded bg-blue-200 hover:bg-blue-300"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedPerson && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setSelectedPerson(null)}
            >
              X
            </button>
            <PersonForm
              person={selectedPerson}
              onClose={() => setSelectedPerson(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
