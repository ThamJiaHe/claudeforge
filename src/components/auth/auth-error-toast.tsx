'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Reads auth error params from the URL (set by /auth/callback) and shows a toast.
 * Cleans the URL afterwards so the error doesn't persist on refresh.
 */
export function AuthErrorToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get('error');
    if (!error) return;

    const description = searchParams.get('error_description');

    const messages: Record<string, string> = {
      auth_failed: 'Sign-in failed. Please try again.',
      auth_exchange_failed: `Sign-in failed: ${description ?? 'Could not exchange auth code.'}`,
      auth_no_code: 'Sign-in callback received no authorization code.',
      // Supabase "Error getting user profile from external provider" — transient
      provider_error:
        'Your sign-in provider was temporarily unavailable. Please try signing in again.',
      // Supabase may send `server_error` directly as the error param
      server_error:
        'The sign-in service encountered a temporary error. Please try again in a moment.',
    };

    let message = messages[error];

    if (!message) {
      // Fallback: detect provider-related errors from the description
      const desc = description ?? error;
      if (/external provider/i.test(desc) || /provider/i.test(desc)) {
        message =
          'Your sign-in provider was temporarily unavailable. Please try signing in again.';
      } else {
        message = desc ? `Sign-in error: ${desc}` : `Sign-in error: ${error}`;
      }
    }

    toast.error(message);

    // Clean the error params from the URL (without triggering navigation)
    const url = new URL(window.location.href);
    url.searchParams.delete('error');
    url.searchParams.delete('error_description');
    window.history.replaceState({}, '', url.pathname + url.search);
  }, [searchParams, router]);

  return null;
}
