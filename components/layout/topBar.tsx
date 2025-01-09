'use client';
import { useAuth } from '@/app/authProvider';
import Button from '@/components/generic/button';
import Link from 'next/link';
import { useState } from 'react';
import AuthForm from '../authForm';

type Role = 'user' | 'admin' | 'super_admin';

const TopBar: React.FC = () => {
  const { session, logout } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState(false);

  const userRole = session?.user?.user_metadata?.role as Role | undefined;
  return (
    <div className="flex items-center justify-between bg-gray-800 p-4 text-white">
      <div>
        <Link className="text-xl font-bold hover:opacity-20" href="/">
          Home
        </Link>
        {(userRole === 'admin' || userRole === 'super_admin') && (
          <>
            <Link
              className="text-xl pl-4 font-bold hover:opacity-20"
              href="/admin"
            >
              Admin
            </Link>
            <Link
              className="text-xl pl-4 font-bold hover:opacity-20"
              href="/generate"
            >
              Generate PDF
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
