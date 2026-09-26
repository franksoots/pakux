"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function signup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      router.push("/dashboard");
    }, 700);
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
          Build your sales engine.
        </h1>

        <p className="pk-auth-text">
          Tell Pakux what you sell. We'll find who needs it.
        </p>

        <form className="pk-auth-form" onSubmit={signup}>
          <div className="pk-form-grid">
            <div className="pk-field">
              <label className="pk-label">First name</label>
              <input
                className="pk-input"
                placeholder="Frank"
                required
              />
            </div>

            <div className="pk-field">
              <label className="pk-label">Last name</label>
              <input
                className="pk-input"
                placeholder="Soots"
                required
              />
            </div>

            <div className="pk-field full">
              <label className="pk-label">Email</label>
              <input
                className="pk-input"
                type="email"
                placeholder="you@company.com"
                required
              />
            </div>

            <div className="pk-field full">
              <label className="pk-label">Password</label>
              <input
                className="pk-input"
                type="password"
                placeholder="Create a password"
                required
              />
            </div>

            <div className="pk-field full">
              <label className="pk-label">What do you sell?</label>
              <input
                className="pk-input"
                placeholder="e.g. video production"
              />
            </div>
          </div>

          <button className="pk-button" disabled={loading}>
            {loading
              ? "Creating workspace..."
              : "Create workspace →"}
          </button>
        </form>

        <div className="pk-auth-footer">
          Already have an account?{" "}
          <Link href="/login">Log in</Link>
          <br />
          <span style={{ display: "block", marginTop: 10 }}>
            Prototype mode — your account is not actually saved yet.
          </span>
        </div>
      </motion.div>
    </main>
  );
}