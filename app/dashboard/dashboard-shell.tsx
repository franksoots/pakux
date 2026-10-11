"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { User } from "@supabase/supabase-js";

import { useLanguage } from "../../components/language-provider";
import LanguageSwitcher from "../../components/language-switcher";
import { createClient } from "../../lib/supabase/client";

export default function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { t } = useLanguage();

  const navigation = [
    { name: t.nav.overview, href: "/dashboard", icon: "⌂" },
    { name: t.nav.discover, href: "/dashboard/discover", icon: "◉" },
    { name: t.nav.prospects, href: "/dashboard/prospects", icon: "◇" },
    { name: t.nav.outreach, href: "/dashboard/outreach", icon: "↗" },
    { name: t.nav.activity, href: "/dashboard/activity", icon: "◌" },
    { name: t.nav.settings, href: "/dashboard/settings", icon: "⚙" },
  ];

  async function logout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  const firstName =
    user.user_metadata?.first_name ||
    user.email?.split("@")[0] ||
    "User";

  const email = user.email || "";

  return (
    <div className="pk-app">
      <aside className={`pk-sidebar ${mobileOpen ? "open" : ""}`}>
        <Link href="/" className="pk-logo">
          <span className="pk-logo-mark" />
          <span className="pk-logo-text">pakux</span>
        </Link>

        <div className="pk-nav-label">{t.nav.overview}</div>

        <nav className="pk-nav">
          {navigation.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`pk-nav-link ${active ? "active" : ""}`}
              >
                <span className="pk-nav-icon">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="pk-sidebar-bottom">
          <div className="pk-workspace">
            <div className="pk-workspace-title">
              {t.settings.workspace}
            </div>

            <div className="pk-workspace-name">
              Pakux
            </div>
          </div>

          <div className="pk-user">
            <div className="pk-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="pk-user-name">
                {firstName}
              </div>

              <div className="pk-user-plan">
                {email}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="pk-nav-link"
            style={{
              width: "100%",
              border: 0,
              background: "transparent",
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            <span className="pk-nav-icon">↪</span>
            {t.common.logout}
          </button>
        </div>
      </aside>

      <main className="pk-main">
        <header className="pk-topbar">
          <div className="pk-top-left">
            <button
              className="pk-mobile-menu"
              onClick={() =>
                setMobileOpen((value) => !value)
              }
            >
              ☰
            </button>

            <div className="pk-search">
              <span>⌕</span>

              <input
                placeholder={t.prospects.search}
              />

              <span className="pk-command">
                ⌘K
              </span>
            </div>
          </div>

          <div className="pk-top-actions">
            <LanguageSwitcher />

            <button
              className="pk-icon-button"
              aria-label="Notifications"
            >
              ◌
            </button>

            <div className="pk-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}