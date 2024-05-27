import '@/styles/globals.css';
import Provider from './providers';
import TopBar from '@/components/layout/topBar';
import Footer from '@/components/layout/footer';
import { Archivo } from 'next/font/google';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'My App',
  description: 'A tool ',
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
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
