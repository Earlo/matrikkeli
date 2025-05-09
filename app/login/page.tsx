'use client';

import Button from '@/components/generic/button';
import { login } from './actions';

export default function LoginPage() {
  return (
    <div className="container mx-auto pt-20 text-center">
      <h1 className="font-white mb-5 text-6xl font-extrabold">ENKK</h1>
      <p className="font-white mb-8 text-2xl">Jäsenmatrikkeli</p>
      <div className="flex justify-center">
        <Button
          label={'Login with LinkedIn'}
          type="button"
          onClick={() => login()}
        />
      </div>
    </div>
  );
}
