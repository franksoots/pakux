"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: "⌂" },
  { name: "Discover", href: "/dashboard/discover", icon: "◉" },
  { name: "Prospects", href: "/dashboard/prospects", icon: "◇" },
  { name: "Outreach", href: "/dashboard/outreach", icon: "↗" },
  { name: "Activity", href: "/dashboard/activity", icon: "◌" },
  { name: "Settings", href: "/dashboard/settings", icon: "⚙" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="pk-app">
      <aside className={`pk-sidebar ${mobileOpen ? "open" : ""}`}>
        <Link href="/" className="pk-logo">
          <span className="pk-logo-mark" />
          <span className="pk-logo-text">pakux</span>
        </Link>

        <div className="pk-nav-label">Workspace</div>

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
            <div className="pk-workspace-title">Workspace</div>
            <div className="pk-workspace-name">Pakux Demo</div>
          </div>

          <div className="pk-user">
            <div className="pk-avatar">F</div>
            <div>
              <div className="pk-user-name">Frank</div>
              <div className="pk-user-plan">Pro workspace</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="pk-main">
        <header className="pk-topbar">
          <div className="pk-top-left">
            <button
              className="pk-mobile-menu"
              onClick={() => setMobileOpen((value) => !value)}
            >
              ☰
            </button>

            <div className="pk-search">
              <span>⌕</span>
              <input placeholder="Search prospects..." />
              <span className="pk-command">⌘K</span>
            </div>
          </div>

          <div className="pk-top-actions">
            <button className="pk-icon-button">◌</button>
            <div className="pk-avatar">F</div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}