'use client';
import AuthForm from '../authForm';
import Button from '@/components/generic/button';
import { useAuth } from '@/app/authProvider';
import Link from 'next/link';
import { useState } from 'react';

const TopBar: React.FC = () => {
  const { session, logout } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState(false);
  return (
    <div className="flex items-center justify-between bg-gray-800 p-4 text-white">
      <Link className={'text-xl font-bold hover:opacity-20'} href="/">
        Home
      </Link>
      <div className="hidden text-xl font-bold sm:block">
        {session ? 'Welcome, ' + session.user.user_metadata.name + '!' : ''}
      </div>
      <div>
        {session ? <Button label="Log Out" onClick={() => logout()} /> : null}
      </div>
      {showAuthForm && <AuthForm onClose={() => setShowAuthForm(false)} />}
    </div>
  );
};

export default TopBar;
