'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial user — getSession() is faster (reads from cookie/storage)
    // and triggers onAuthStateChange which then validates with getUser()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes (covers sign-in, sign-out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Debug auth events in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[useUser] Auth event:', event, session?.user?.email ?? 'no user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
