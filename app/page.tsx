'use client';
import LoadingSpinner from '@/components/generic/loadingSpinner';
import PersonForm from '@/components/personForm';
import { useUserProfile } from '@/hooks/userProfile';

export default function Home() {
  const { person, loading } = useUserProfile();

  if (loading) return <LoadingSpinner />;
  if (!person) return <div>No profile found.</div>;

  return <PersonForm person={person} />;
}
