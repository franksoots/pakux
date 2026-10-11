"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "../../../components/language-provider";

type Prospect = {
  id: string;
  company_name: string;
  website?: string | null;
  industry?: string | null;
  location?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_role?: string | null;
  fit_score?: number | null;
  status?: string | null;
};

export default function ProspectsPage() {
  const { t, language } = useLanguage();

  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProspects() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/prospects");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load prospects.",
          );
        }

        setProspects(
          Array.isArray(data.prospects)
            ? data.prospects
            : [],
        );
      } catch (err) {
        console.error("Failed to load prospects:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load prospects.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProspects();
  }, []);

  const filtered = prospects.filter((item) => {
    const query = search.toLowerCase();

    return (
      item.company_name
        ?.toLowerCase()
        .includes(query) ||
      item.industry
        ?.toLowerCase()
        .includes(query) ||
      item.location
        ?.toLowerCase()
        .includes(query) ||
      item.contact_name
        ?.toLowerCase()
        .includes(query) ||
      item.contact_email
        ?.toLowerCase()
        .includes(query)
    );
  });

  function translateStatus(status: string | null | undefined) {
    if (!status) return "";

    if (language === "en") {
      return status.charAt(0).toUpperCase() + status.slice(1);
    }

    if (status === "new") return "Uus";
    if (status === "saved") return "Salvestatud";
    if (status === "contacted") return "Kontakteeritud";

    return status;
  }

  return (
    <motion.div
      className="pk-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="pk-page-header">
        <div>
          <div className="pk-eyebrow">
            {t.prospects.title}
          </div>

          <h1 className="pk-title">
            {language === "et"
              ? "Sinu turg."
              : "Your market."}
          </h1>

          <p className="pk-subtitle">
            {t.prospects.subtitle}
          </p>
        </div>

        <div className="pk-pill active">
          {prospects.length}{" "}
          {language === "et" ? "kokku" : "total"}
        </div>
      </div>

      <div className="pk-card pk-card-padding">
        <div className="pk-toolbar">
          <div className="pk-search pk-toolbar-search">
            <span>⌕</span>

            <input
              placeholder={t.prospects.search}
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <button className="pk-pill active">
            {t.prospects.all}
          </button>

          <button className="pk-pill">
            {t.prospects.saved}
          </button>

          <button className="pk-pill">
            {t.prospects.contacted}
          </button>
        </div>

        {loading ? (
          <div
            style={{
              padding: "70px 20px",
              textAlign: "center",
              opacity: 0.6,
            }}
          >
            {language === "et"
              ? "Laadin prospekte..."
              : "Loading prospects..."}
          </div>
        ) : error ? (
          <div
            style={{
              padding: "70px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 15,
                marginBottom: 8,
              }}
            >
              {language === "et"
                ? "Prospektide laadimine ebaõnnestus"
                : "Could not load prospects"}
            </div>

            <div
              style={{
                fontSize: 13,
                opacity: 0.5,
              }}
            >
              {error}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: "80px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                margin: "0 auto 18px",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border:
                  "1px solid rgba(255,255,255,.08)",
                background:
                  "rgba(255,255,255,.035)",
                fontSize: 22,
              }}
            >
              ✦
            </div>

            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                marginBottom: 7,
              }}
            >
              {search
                ? language === "et"
                  ? "Prospekte ei leitud"
                  : "No prospects found"
                : language === "et"
                  ? "Prospekte pole veel"
                  : "No prospects yet"}
            </div>

            <div
              style={{
                fontSize: 13,
                opacity: 0.5,
                maxWidth: 420,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              {search
                ? language === "et"
                  ? "Proovi teistsugust otsingut."
                  : "Try a different search."
                : language === "et"
                  ? "Mine Discoverisse ja leia oma esimesed potentsiaalsed kliendid."
                  : "Go to Discover to find your first potential customers."}
            </div>
          </div>
        ) : (
          <div className="pk-table-wrap">
            <table className="pk-table">
              <thead>
                <tr>
                  <th>{t.prospects.company}</th>
                  <th>{t.prospects.industry}</th>
                  <th>{t.prospects.location}</th>
                  <th>{t.prospects.fit}</th>
                  <th>{t.prospects.contact}</th>
                  <th>{t.prospects.status}</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: index * 0.03,
                    }}
                  >
                    <td>
                      <div className="pk-company">
                        <div className="pk-company-icon">
                          {item.company_name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="pk-company-name">
                          {item.company_name}
                        </div>
                      </div>
                    </td>

                    <td>
                      {item.industry || "—"}
                    </td>

                    <td>
                      {item.location || "—"}
                    </td>

                    <td>
                      <span className="pk-score">
                        {typeof item.fit_score ===
                        "number"
                          ? `${item.fit_score}%`
                          : "—"}
                      </span>
                    </td>

                    <td>
                      {item.contact_name ||
                        item.contact_role ||
                        item.contact_email ||
                        "—"}
                    </td>

                    <td>
                      <span className="pk-status">
                        {translateStatus(
                          item.status,
                        )}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
