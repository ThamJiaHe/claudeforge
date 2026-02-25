import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const errorParam = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const nextRaw = searchParams.get('next') ?? '/';
  // Prevent open redirect: only allow relative paths starting with single /
  const safeNext = /^\/[^\/\\@]/.test(nextRaw) ? nextRaw : '/';

  // Supabase may redirect here with an error param (e.g. provider config issues)
  if (errorParam) {
    console.error('[auth/callback] Supabase redirect error:', {
      error: errorParam,
      description: errorDescription,
    });
    return NextResponse.redirect(
      `${origin}/?error=${encodeURIComponent(errorParam)}&error_description=${encodeURIComponent(errorDescription ?? '')}`
    );
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        console.log('[auth/callback] Session established, redirecting to:', safeNext);
        return NextResponse.redirect(`${origin}${safeNext}`);
      }

      // Log the exchange error so it appears in Vercel logs
      console.error('[auth/callback] Code exchange failed:', {
        message: error.message,
        status: error.status,
        name: error.name,
      });

      // "Error getting user profile from external provider" — transient provider issue
      const isProviderError = /external provider/i.test(error.message);
      const errorKey = isProviderError ? 'provider_error' : 'auth_exchange_failed';

      return NextResponse.redirect(
        `${origin}/?error=${errorKey}&error_description=${encodeURIComponent(error.message)}`
      );
    } catch (err) {
      // Network / unexpected errors during code exchange
      const msg = err instanceof Error ? err.message : 'Unexpected error during sign-in';
      console.error('[auth/callback] Unexpected error:', msg);
      return NextResponse.redirect(
        `${origin}/?error=auth_exchange_failed&error_description=${encodeURIComponent(msg)}`
      );
    }
  }

  // No code and no error — unexpected state
  console.warn('[auth/callback] No code or error param received');
  return NextResponse.redirect(`${origin}/?error=auth_no_code`);
}
