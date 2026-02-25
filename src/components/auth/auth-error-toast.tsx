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
    };

    let message = messages[error];

    if (!message) {
      // Handle the common "Error getting user profile from external provider" error
      const desc = description ?? error;
      if (/external provider/i.test(desc) || /provider/i.test(desc)) {
        message =
          'Could not fetch your profile from the sign-in provider. This is usually a temporary issue — please try again in a moment.';
      } else {
        message = desc ? `Auth error: ${desc}` : `Auth error: ${error}`;
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
