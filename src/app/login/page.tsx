"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/clients";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleLogin}
      className="rounded-xl border border-navy-800/60 bg-navy-900/30 p-6 space-y-4"
    >
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-mono text-navy-400 mb-1.5"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-navy-700/60 bg-navy-900/60 px-3 py-2 text-sm text-white placeholder-navy-600 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500/40"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-mono text-navy-400 mb-1.5"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-navy-700/60 bg-navy-900/60 px-3 py-2 text-sm text-white placeholder-navy-600 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500/40"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-display font-semibold text-white hover:bg-accent-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-white">
            Ranked<span className="text-accent-400">First</span>.ai
          </h1>
          <p className="text-navy-400 text-sm mt-2">
            Sign in to access the back office
          </p>
        </div>

        <React.Suspense
          fallback={
            <div className="rounded-xl border border-navy-800/60 bg-navy-900/30 p-6 text-center text-navy-500 text-sm">
              Loading…
            </div>
          }
        >
          <LoginForm />
        </React.Suspense>

        <p className="text-center text-xs text-navy-600 mt-6">
          Contact your administrator if you need access.
        </p>
      </div>
    </div>
  );
}
