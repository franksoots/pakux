"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  }

  return (
    <main className="pk-auth">
      <div className="pk-auth-glow" />

      <Link href="/" className="pk-back">
        ← Back to Pakux
      </Link>

      <motion.div
        className="pk-auth-card"
        initial={{ opacity: 0, y: 25, scale: .98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: .45 }}
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

        <form className="pk-auth-form" onSubmit={login}>
          <div className="pk-field">
            <label className="pk-label">Email</label>
            <input
              className="pk-input"
              type="email"
              placeholder="you@company.com"
              required
            />
          </div>

          <div className="pk-field">
            <label className="pk-label">Password</label>
            <input
              className="pk-input"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button className="pk-button" disabled={loading}>
            {loading ? "Signing in..." : "Continue →"}
          </button>

          <button
            type="button"
            className="pk-button secondary"
            onClick={() => router.push("/dashboard")}
          >
            Continue with Google
          </button>
        </form>

        <div className="pk-auth-footer">
          Don't have an account?{" "}
          <Link href="/signup">Create one</Link>
          <br />
          <span style={{ display: "block", marginTop: 10 }}>
            Prototype mode — authentication will be connected later.
          </span>
        </div>
      </motion.div>
    </main>
  );
}