"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function googleLogin() {
    setLoading(true);
    setError("");

    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            `${window.location.origin}/auth/confirm?next=/dashboard`,
        },
      });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <main className="pk-auth">
      <div className="pk-auth-glow" />

      <Link href="/" className="pk-back">
        ← Back to Pakux
      </Link>

      <motion.div
        className="pk-auth-card"
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
      >
        <div className="pk-auth-logo">
          <Link href="/" className="pk-logo">
            <span className="pk-logo-mark" />
            <span className="pk-logo-text">pakux</span>
          </Link>
        </div>

        <h1 className="pk-auth-heading">
          Welcome back.
        </h1>

        <p className="pk-auth-text">
          Continue discovering the companies that need what you
          sell.
        </p>

        <form
          className="pk-auth-form"
          onSubmit={login}
        >
          <div className="pk-field">
            <label className="pk-label">Email</label>
            <input
              className="pk-input"
              name="email"
              type="email"
              placeholder="you@company.com"
              required
            />
          </div>

          <div className="pk-field">
            <label className="pk-label">Password</label>
            <input
              className="pk-input"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div
              className="pk-auth-note"
              style={{ color: "#f87171" }}
            >
              {error}
            </div>
          )}

          <button
            className="pk-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Continue →"}
          </button>

          <button
            type="button"
            className="pk-button secondary"
            onClick={googleLogin}
            disabled={loading}
          >
            Continue with Google
          </button>
        </form>

        <div className="pk-auth-footer">
          Don't have an account?{" "}
          <Link href="/signup">Create one</Link>
        </div>
      </motion.div>
    </main>
  );
}
