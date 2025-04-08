import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // ✅ Clean and deterministic redirect
      return NextResponse.redirect(next);
    }

    console.error('Supabase session exchange error:', error.message);
  }

  // ❌ If we got here, either no code or session exchange failed
  return NextResponse.redirect('/auth/auth-code-error');
}
