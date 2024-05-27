'use client';
import { AuthProvider } from './authProvider';
import { ReactNode } from 'react';

export default function Provider({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
