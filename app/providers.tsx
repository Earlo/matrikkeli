'use client';
import { ReactNode } from 'react';
import { UserProvider } from './userProvider';

export default function Provider({ children }: { children: ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
