'use client';
import { client } from '@/lib/supabase';
import { Person } from '@/schemas/user';
import { useEffect, useState } from 'react';

export default function GeneratePage() {
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    const fetchPeople = async () => {
      const { data, error } = await client.from('people').select('*');
      if (error) {
        console.error('Error fetching people', error);
        return;
      }
      setPeople(data);
    };

    fetchPeople();
  }, []);

  const generatePdf = async () => {
    try {
      const response = await fetch('/api/generatePdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ people }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'people_booklet.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      } else {
        console.error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating PDF', error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <button
        onClick={generatePdf}
        className="mt-5 cursor-pointer rounded-md border-none bg-gradient-to-r from-orange-500 to-red-500 p-3 text-lg text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
      >
        Generate PDF
      </button>
    </div>
  );
}