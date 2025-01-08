'use client';

import { client } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useAuth } from '../authProvider';

// Optional: If you have a loading spinner component
import LoadingSpinner from '@/components/generic/loadingSpinner';

type Role = 'user' | 'admin' | 'super_admin';

interface Person {
  id: string;
  email: string;
  role: Role;
  [key: string]: any; // Adjust as needed for other columns
}

export default function AdminPage() {
  const { session, loading } = useAuth();
  const [currentUserRole, setCurrentUserRole] = useState<Role | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(true);

  // Fetch the current user's role
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

  // Load all people if current user is an admin or super_admin
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

  const handleChangeRole = async (personId: string, newRole: Role) => {
    if (currentUserRole !== 'super_admin') return;
    try {
      const { error } = await client
        .from('people')
        .update({ role: newRole })
        .eq('user_id', personId);

      if (error) {
        console.error('Error updating role:', error);
        return;
      }

      // Update local state so we don't have to refetch
      setPeople((prev) =>
        prev.map((person) =>
          person.id === personId ? { ...person, role: newRole } : person,
        ),
      );
    } catch (error) {
      console.error('Unhandled error while changing role:', error);
    }
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
  console.log('role', currentUserRole);
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
              {currentUserRole === 'super_admin' && (
                <th className="px-4 py-2 text-left">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id} className="border-b">
                <td className="px-4 py-2">{person.email}</td>
                <td className="px-4 py-2">{person.role}</td>
                {currentUserRole === 'super_admin' && (
                  <td className="px-4 py-2 space-x-2">
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
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
