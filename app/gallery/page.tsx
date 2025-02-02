import Gallery from '@/components/gallery';
import { client } from '@/lib/supabase';
import { Person } from '@/schemas/user';

export default async function GalleryPage() {
  const { data: people, error } = await client.from('people').select('*');

  if (error) {
    console.error('Error fetching people:', error.message);
    return <div>Error loading people.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Matrikkeli Gallery</h1>
      <Gallery people={people as Person[]} />
    </div>
  );
}
