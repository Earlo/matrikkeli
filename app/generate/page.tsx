'use client';
import { client } from '@/lib/supabase';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Person {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  image_url: string;
}

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
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [148, 105], // A6
    });

    for (const person of people) {
      const input = document.getElementById(`person-${person.user_id}`);
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/png');

      if (people.indexOf(person) !== 0) {
        pdf.addPage();
      }

      pdf.addImage(canvas, 'PNG', 0, 0, 105, 148);
    }

    pdf.save('people.pdf');
  };
  console.log(people);
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mx-auto max-w-xs">
        {people.map((person) => (
          <div
            key={person.user_id}
            id={`person-${person.user_id}`}
            className="mb-5 h-[148mm] w-[105mm] overflow-hidden bg-orange-300 p-2 shadow-lg"
          >
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-white">
              <span>*jäsen status*</span>
              <div className="h-[100px] w-[100px] overflow-hidden rounded-full rounded-br-none border-4 border-white">
                <Image
                  src={person.image_url_session}
                  width={100}
                  height={100}
                  alt="Profile"
                  className="h-full w-full  object-fill "
                />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">
                {person.first_name} {person.last_name}
              </h1>
              <p className="text-white">{person.email}</p>
            </div>
            <div className="mt-3 text-sm text-orange-800">*työ*</div>
            <div className="mt-1 text-sm text-white">
              Teksti 1<br />
              Teksti 1<br />
              Teksti 1<br />
              Teksti 1
            </div>
          </div>
        ))}
      </div>{' '}
      <button
        onClick={generatePdf}
        className="mt-5 cursor-pointer rounded-md border-none bg-orange-400 p-2.5 text-lg text-white"
      >
        Generate PDF
      </button>
    </div>
  );
}
