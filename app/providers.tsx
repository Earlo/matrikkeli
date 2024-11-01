'use client';
import { ReactNode } from 'react';
import { AuthProvider } from './authProvider';

export default function Provider({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
