'use client';

import LoadingSpinner from '@/components/generic/loadingSpinner';
import PersonForm from '@/components/personForm';
import { useUserProfile } from '@/hooks/userProfile';
import { client } from '@/lib/supabase/browser';
import { Person, Question, Role } from '@/schemas/user';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const { person, loading } = useUserProfile();
  const [people, setPeople] = useState<Person[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionPriority, setNewQuestionPriority] = useState(0);

  const currentUserRole = person?.role ?? null;
  const isAdmin =
    currentUserRole === 'admin' || currentUserRole === 'super_admin';

  useEffect(() => {
    if (!isAdmin) {
      setLoadingPeople(false);
      return;
    }

    const fetchPeople = async () => {
      setLoadingPeople(true);
      try {
        const { data, error } = await client.from('people').select('*');
        if (error) {
          console.error('Error fetching people:', error);
        } else {
          setPeople(data as Person[]);
        }
      } catch (error) {
        console.error('Unhandled error while fetching people:', error);
      } finally {
        setLoadingPeople(false);
      }
    };

    fetchPeople();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) {
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
  }, [isAdmin]);

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

  if (!person) {
    return (
      <div className="p-4">
        <h2>Access Denied</h2>
        <p>You must be logged in to view this page.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-4">
        <h2>Access Denied</h2>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Admin Panel</h1>
      <h2 className="mt-8 mb-2 text-xl font-semibold">Manage People</h2>
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
                <td className="space-x-2 px-4 py-2">
                  {currentUserRole === 'super_admin' && (
                    <>
                      <button
                        onClick={() => handleChangeRole(person.id, 'user')}
                        className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
                      >
                        Set User
                      </button>
                      <button
                        onClick={() => handleChangeRole(person.id, 'admin')}
                        className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
                      >
                        Set Admin
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleEditPerson(person)}
                    className="rounded bg-blue-200 px-2 py-1 hover:bg-blue-300"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="mt-8 mb-2 text-xl font-semibold">Manage Questions</h2>
      {loadingQuestions ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="New question..."
              className="flex-1 rounded border p-1"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
            />
            <input
              type="number"
              placeholder="Priority"
              className="w-20 rounded border p-1"
              value={newQuestionPriority}
              onChange={(e) => setNewQuestionPriority(Number(e.target.value))}
            />
            <button
              onClick={handleAddQuestion}
              className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
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
                      className="rounded bg-red-200 px-2 py-1 hover:bg-red-300"
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
          <div className="relative max-h-[90vh] w-fit overflow-y-auto rounded bg-white shadow-md">
            <button
              className="absolute top-2 right-2"
              onClick={() => setSelectedPerson(null)}
            >
              <XMarkIcon className="h-5 w-5 cursor-pointer text-black hover:text-gray-700" />
            </button>
            <PersonForm person={selectedPerson} />
          </div>
        </div>
      )}
    </div>
  );
}
