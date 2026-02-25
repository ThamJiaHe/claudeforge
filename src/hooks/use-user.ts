'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    // Get initial user — getSession() is faster (reads from cookie/storage).
    // Wrapped in try/catch to prevent the app from breaking when Supabase is
    // misconfigured or the session cookie is corrupt.
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (!mounted) return;
        if (error) {
          // Common error: "Error getting user profile from external provider"
          // This happens when Supabase can't reach the OAuth provider.
          // Gracefully degrade — treat as signed-out.
          console.warn('[useUser] getSession error (treated as signed-out):', error.message);
          setUser(null);
        } else {
          setUser(session?.user ?? null);
        }
        setLoading(false);
      })
      .catch((err) => {
        // Network errors, JSON parse errors, etc.
        if (!mounted) return;
        console.warn('[useUser] Failed to get session:', err);
        setUser(null);
        setLoading(false);
      });

    // Listen for auth state changes (covers sign-in, sign-out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setLoading(false);

      // Debug auth events in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[useUser] Auth event:', event, session?.user?.email ?? 'no user');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
