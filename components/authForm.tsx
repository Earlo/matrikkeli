'use client';
import FormContainer from './formContainer';
import Button from './generic/button';
import { client } from '@/lib/supabase';
interface AuthFormProps {
  onClose?: () => void;
}

export default function AuthForm({ onClose }: AuthFormProps) {
  const handleLinkedIn = async () => {
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
    });
    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      throw new Error('Failed to sign in with LinkedIn');
    }
  };

  return (
    <FormContainer onClose={onClose}>
      <div className="flex items-center justify-between">
        <Button
          label={'Login with LinkedIn'}
          type="button"
          onClick={handleLinkedIn}
        />
      </div>
    </FormContainer>
  );
}
