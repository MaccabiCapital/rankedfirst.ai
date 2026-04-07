"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthButton() {
  const router = useRouter();
  const [email, setEmail] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) return null;

  if (!email) {
    return (
      <a
        href="/login"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-display font-semibold text-navy-300 hover:text-white hover:bg-navy-800/50 transition-colors"
      >
        Sign In
      </a>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline text-xs text-navy-400 font-mono truncate max-w-[140px]">
        {email}
      </span>
      <button
        onClick={handleSignOut}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-display font-semibold text-navy-300 hover:text-white hover:bg-navy-800/50 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}
