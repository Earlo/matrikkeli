'use client';
import LoadingSpinner from '@/components/generic/loadingSpinner';
import PersonForm from '@/components/personForm';
import { useUser } from './userProvider';

export default function Home() {
  const { person, loading } = useUser();
  console.log('person', person);
  if (loading) {
    return <LoadingSpinner />;
  }

  return <PersonForm person={person} />;
}
