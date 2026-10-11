"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function signup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    const form = new FormData(e.currentTarget);

    const firstName = String(form.get("firstName") || "").trim();
    const lastName = String(form.get("lastName") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const whatYouSell = String(form.get("whatYouSell") || "").trim();

    try {
      const { data, error: signupError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo:
              `${window.location.origin}/auth/confirm?next=/dashboard`,
            data: {
              first_name: firstName,
              last_name: lastName,
              what_you_sell: whatYouSell,
            },
          },
        });

      if (signupError) {
        setError(signupError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Account creation failed.");
        setLoading(false);
        return;
      }

      if (!data.session) {
        setMessage(
          "Your account was created. Please check your email to confirm your account, then log in."
        );
        setLoading(false);
        return;
      }

      const { data: workspace, error: workspaceError } =
        await supabase
          .from("workspaces")
          .insert({
            name: `${firstName || "My"} Workspace`,
            description: whatYouSell || null,
          })
          .select("id")
          .single();

      if (workspaceError) {
        setError(workspaceError.message);
        setLoading(false);
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          email,
          workspace_id: workspace.id,
        });

      if (profileError) {
        await supabase
          .from("workspaces")
          .delete()
          .eq("id", workspace.id);

        setError(profileError.message);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
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
                name="firstName"
                placeholder="Frank"
                required
              />
            </div>

            <div className="pk-field">
              <label className="pk-label">Last name</label>
              <input
                className="pk-input"
                name="lastName"
                placeholder="Soots"
                required
              />
            </div>

            <div className="pk-field full">
              <label className="pk-label">Email</label>
              <input
                className="pk-input"
                name="email"
                type="email"
                placeholder="you@company.com"
                required
              />
            </div>

            <div className="pk-field full">
              <label className="pk-label">Password</label>
              <input
                className="pk-input"
                name="password"
                type="password"
                placeholder="Create a password"
                minLength={6}
                required
              />
            </div>

            <div className="pk-field full">
              <label className="pk-label">What do you sell?</label>
              <input
                className="pk-input"
                name="whatYouSell"
                placeholder="e.g. video production"
              />
            </div>

            {error && (
              <div className="pk-field full">
                <div
                  className="pk-auth-note"
                  style={{ color: "#f87171" }}
                >
                  {error}
                </div>
              </div>
            )}

            {message && (
              <div className="pk-field full">
                <div className="pk-auth-note">
                  {message}
                </div>
              </div>
            )}
          </div>

          <button
            className="pk-button"
            disabled={loading}
          >
            {loading
              ? "Creating workspace..."
              : "Create workspace →"}
          </button>
        </form>

        <div className="pk-auth-footer">
          Already have an account?{" "}
          <Link href="/login">Log in</Link>
        </div>
      </motion.div>
    </main>
  );
}
