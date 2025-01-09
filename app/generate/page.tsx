'use client';
import { useState } from 'react';

export default function GeneratePage() {
  const [loading, setLoading] = useState(false);

  const generatePdf = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generatePdf/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <button
        onClick={generatePdf}
        className="mt-5 transform cursor-pointer rounded-md border-none bg-gradient-to-r from-orange-500 to-red-500 p-3 text-lg text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate PDF'}
      </button>
    </div>
  );
}
