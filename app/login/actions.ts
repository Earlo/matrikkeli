'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login() {
  const supabase = await createClient();
  const origin = (await headers()).get('origin');
  console.log('origin is', origin);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'linkedin_oidc',
    options: {
      //redirectTo: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000/'}auth/callback`,
      redirectTo: origin,
    },
  });

  if (data.url) {
    console.log('redirecting to data.url', data.url);
    redirect(data.url); // use the redirect API for your server framework
  }
  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
