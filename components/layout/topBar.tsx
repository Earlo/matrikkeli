'use client';
import { useAuth } from '@/app/authProvider';
import Button from '@/components/generic/button';
import { Role } from '@/schemas/user';
import Link from 'next/link';
import { FC, useState } from 'react';
import AuthForm from '../authForm';

const TopBar: FC = () => {
  const { session, logout } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState(false);

  const userRole = session?.user?.user_metadata?.role as Role | undefined;
  return (
    <div className="flex items-center justify-between bg-gray-800 p-4 text-white">
      <div className="flex items-center">
        <Link
          className="text-lg md:text-xl font-bold hover:opacity-80"
          href="/"
        >
          Home
        </Link>
        <Link
          className="text-lg md:text-xl pl-4 font-bold hover:opacity-80"
          href="/gallery"
        >
          Gallery
        </Link>
        {(userRole === 'admin' || userRole === 'super_admin') && (
          <>
            <Link
              className="text-lg md:text-xl pl-4 font-bold hover:opacity-80"
              href="/admin"
            >
              Admin
            </Link>
            <Link
              className="text-lg md:text-xl pl-4 font-bold hover:opacity-80"
              href="/generate"
            >
              PDF
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {session && <Button label="Log Out" onClick={() => logout()} />}
      </div>

      {showAuthForm && <AuthForm onClose={() => setShowAuthForm(false)} />}
    </div>
  );
};

export default TopBar;
