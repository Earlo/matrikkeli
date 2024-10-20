import '@/styles/globals.css';
import Provider from './providers';
import TopBar from '@/components/layout/topBar';
import Footer from '@/components/layout/footer';
import BaseLayout from '@/components/layout/baseLayout';
import { Archivo } from 'next/font/google';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
export const metadata: Metadata = {
  title: 'ENKK Matrikkeli Tool',
  description: 'A tool for generating a booklet of people in an organization',
};

const archivo = Archivo({
  weight: ['400', '700'],
  display: 'optional',
  subsets: ['latin-ext'],
  variable: '--font-archivo',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable}`}>
      <body className="flex min-h-[100dvh] flex-col">
        <Provider>
          <TopBar />
          <BaseLayout>{children}</BaseLayout>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
