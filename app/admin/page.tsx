'use client';

import LoadingSpinner from '@/components/generic/loadingSpinner';
import PersonForm from '@/components/personForm';
import { client } from '@/lib/supabase/client';
import { Person, Question, Role } from '@/schemas/user';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { useAuth } from '../authProvider';

export default function AdminPage() {
  const { session, loading } = useAuth();
  const [currentUserRole, setCurrentUserRole] = useState<Role | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionPriority, setNewQuestionPriority] = useState(0);

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

  useEffect(() => {
    if (currentUserRole !== 'admin' && currentUserRole !== 'super_admin') {
      setLoadingQuestions(false);
      return;
    }
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const { data, error } = await client
          .from('questions')
          .select('*')
          .order('priority', { ascending: true })
          .order('question', { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          setQuestions(data);
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [currentUserRole]);

  const handleChangeRole = async (personId: number, newRole: Role) => {
    if (currentUserRole !== 'super_admin') return;
    try {
      const { error } = await client
        .from('people')
        .update({ role: newRole })
        .eq('id', personId);

      if (error) {
        console.error('Error updating role:', error);
        return;
      }
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

  const handleAddQuestion = async () => {
    try {
      const { data, error } = await client
        .from('questions')
        .insert({
          question: newQuestionText,
          priority: newQuestionPriority,
          type: '',
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding question:', error);
        return;
      }

      if (data) {
        setQuestions((prev) => [...prev, data]);
        setNewQuestionText('');
        setNewQuestionPriority(0);
      }
    } catch (error) {
      console.error('Unhandled error while adding question:', error);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const { error } = await client.from('questions').delete().eq('id', id);
      if (error) {
        console.error('Error deleting question:', error);
        return;
      }
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (error) {
      console.error('Unhandled error while deleting question:', error);
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

  if (currentUserRole !== 'admin' && currentUserRole !== 'super_admin') {
    return (
      <div className="p-4">
        <h2>Access Denied</h2>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <h2 className="text-xl font-semibold mt-8 mb-2">Manage People</h2>
      {loadingPeople ? (
        <LoadingSpinner />
      ) : (
        <table className="min-w-full border">
          <thead className="border-b bg-gray-100">
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

      <h2 className="text-xl font-semibold mt-8 mb-2">Manage Questions</h2>
      {loadingQuestions ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="New question..."
              className="border p-1 rounded flex-1"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
            />
            <input
              type="number"
              placeholder="Priority"
              className="border p-1 rounded w-20"
              value={newQuestionPriority}
              onChange={(e) => setNewQuestionPriority(Number(e.target.value))}
            />
            <button
              onClick={handleAddQuestion}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add
            </button>
          </div>

          <table className="min-w-full border">
            <thead className="border-b bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Question</th>
                <th className="px-4 py-2 text-left">Priority</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id} className="border-b">
                  <td className="px-4 py-2">{q.question}</td>
                  <td className="px-4 py-2">{q.priority}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="px-2 py-1 rounded bg-red-200 hover:bg-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-fit bg-white rounded shadow-md max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2"
              onClick={() => setSelectedPerson(null)}
            >
              <XMarkIcon className="h-5 w-5 text-black cursor-pointer hover:text-gray-700" />
            </button>
            <PersonForm person={selectedPerson} />
          </div>
        </div>
      )}
    </div>
  );
}
