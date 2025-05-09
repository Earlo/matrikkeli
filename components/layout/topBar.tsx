'use client';
import Button from '@/components/generic/button';
import { useUserProfile } from '@/hooks/userProfile';
import { logout } from '@/lib/supabase/browser';
import { Role } from '@/schemas/user';
import Link from 'next/link';
import { FC } from 'react';

const TopBar: FC = () => {
  const { person } = useUserProfile();
  const userRole = person?.role as Role | undefined;

  return (
    <div className="flex items-center justify-between bg-gray-800 p-4 text-white">
      <div className="flex items-center">
        <Link
          className="text-lg font-bold hover:opacity-80 md:text-xl"
          href="/"
        >
          Home
        </Link>
        {person && (
          <Link
            className="pl-4 text-lg font-bold hover:opacity-80 md:text-xl"
            href="/gallery"
          >
            Gallery
          </Link>
        )}
        {(userRole === 'admin' || userRole === 'super_admin') && (
          <>
            <Link
              className="pl-4 text-lg font-bold hover:opacity-80 md:text-xl"
              href="/admin"
            >
              Admin
            </Link>
            <Link
              className="pl-4 text-lg font-bold hover:opacity-80 md:text-xl"
              href="/generate"
            >
              PDF
            </Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-1">
        {person && <Button label="Log Out" onClick={logout} />}
      </div>
    </div>
  );
};

export default TopBar;
