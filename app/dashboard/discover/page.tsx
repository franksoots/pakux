"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../../components/language-provider";

type Result = {
  company: string;
  address: string;
  website: string | null;
  domain: string | null;
  phone: string | null;
  types: string[];

  contact: {
    name: string;
    email: string | null;
    position: string | null;
    confidence: number | null;
  } | null;

  fit_score?: number;
  fit_reason?: string;
  sales_angle?: string;
  recommended_contact_role?: string;
  priority?: "high" | "medium" | "low";
};

export default function DiscoverPage() {
  const { language } = useLanguage();

  const isEstonian = language === "et";

  const text = isEstonian
    ? {
        eyebrow: "AI otsing",
        title: "Leia oma järgmised kliendid.",
        subtitle:
          "Kirjelda oma pakkumist ja Pakux leiab päris ettevõtted, sobivad kontaktid ning kasutab AI-d, et tuvastada kõige väärtuslikumad müügivõimalused.",
        offer: "Mida sa müüd?",
        offerPlaceholder:
          "nt Professionaalne videotootmine",
        location: "Kus sa müüd?",
        locationPlaceholder: "nt Eesti,linn",
        customers: "Kellele sa müüd?",
        customerPlaceholder:
          "Kirjelda oma ideaalseid kliente...",
        start: "Alusta AI otsingut →",
        searching: "Otsin...",
        researching: "Pakux uurib turgu",
        searchingDescription:
          "Leiame ettevõtteid, kontakte ja hindame müügivõimalusi.",
        live: "Live",
        stages: [
          "Sinu pakkumise mõistmine",
          "Turu kaardistamine",
          "Ettevõtete leidmine",
          "Otsustajate leidmine",
          "Prospektide AI-hindamine",
        ],
        qualified: "AI-hinnatud prospektid",
        qualifiedDescription:
          "Ettevõtted on järjestatud selle järgi, kui hästi nad sinu pakkumisega sobivad.",
        matches: "sobivust",
        noResults:
          "Ettevõtteid ei leitud. Proovi laiemat kliendikirjeldust või asukohta.",
        why: "Miks:",
        salesAngle: "Müüginurk:",
        recommended: "Soovitatud kontakt:",
        fit: "Sobivus",
        website: "Veebileht",
        view: "Vaata",
        errorTitle: "Otsingu viga",
        missingOffer: "Kirjelda, mida sa müüd.",
        missingLocation: "Sisesta asukoht.",
        missingCustomer:
          "Kirjelda oma ideaalseid kliente.",
      }
    : {
        eyebrow: "AI discovery",
        title: "Find your next customers.",
        subtitle:
          "Describe your offer and Pakux will find real businesses, discover contacts and use AI to identify your strongest opportunities.",
        offer: "What do you sell?",
        offerPlaceholder:
          "e.g. Professional video production",
        location: "Where do you sell?",
        locationPlaceholder: "e.g. Estonia,City",
        customers: "Who do you sell to?",
        customerPlaceholder:
          "Describe your ideal customers...",
        start: "Start AI research →",
        searching: "Researching...",
        researching:
          "Pakux is researching the market",
        searchingDescription:
          "Finding businesses, contacts and AI opportunities.",
        live: "Live",
        stages: [
          "Understanding your offer",
          "Mapping the market",
          "Finding companies",
          "Finding decision makers",
          "AI qualifying prospects",
        ],
        qualified: "AI-qualified prospects",
        qualifiedDescription:
          "Ranked by how likely each business is to need your offer.",
        matches: "matches",
        noResults:
          "No companies were found. Try a broader customer description or location.",
        why: "Why:",
        salesAngle: "Sales angle:",
        recommended: "Recommended contact:",
        fit: "Fit score",
        website: "Website",
        view: "View",
        errorTitle: "Discovery error",
        missingOffer: "Please describe what you sell.",
        missingLocation: "Please enter a location.",
        missingCustomer:
          "Please describe your ideal customers.",
      };

  const [offer, setOffer] = useState(
    isEstonian
      ? ""
      : "",
  );

  const [location, setLocation] =
    useState("");

  const [customer, setCustomer] =
    useState(
      isEstonian
        ? ""
        : "",
    );

  const [running, setRunning] =
    useState(false);

  const [stage, setStage] = useState(-1);

  const [finished, setFinished] =
    useState(false);

  const [results, setResults] =
    useState<Result[]>([]);

  const [error, setError] =
    useState("");

  async function startResearch() {
    if (running) return;

    if (!offer.trim()) {
      setError(text.missingOffer);
      return;
    }

    if (!location.trim()) {
      setError(text.missingLocation);
      return;
    }

    if (!customer.trim()) {
      setError(text.missingCustomer);
      return;
    }

    setRunning(true);
    setFinished(false);
    setError("");
    setResults([]);
    setStage(0);

    let stageTimer:
      | ReturnType<typeof setInterval>
      | undefined;

    try {
      stageTimer = setInterval(() => {
        setStage((current) => {
          if (
            current >=
            text.stages.length - 1
          ) {
            if (stageTimer) {
              clearInterval(stageTimer);
            }

            return current;
          }

          return current + 1;
        });
      }, 1000);

      const response = await fetch(
        "/api/discover",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            offer,
            customer,
            location,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Discovery failed.",
        );
      }

      const discoveredResults =
        data.results || [];

      setStage(4);

      const qualifyResponse =
        await fetch(
          "/api/qualify",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              offer,
              customer,
              prospects:
                discoveredResults,
            }),
          },
        );

      const qualifyData =
        await qualifyResponse.json();

      if (!qualifyResponse.ok) {
        throw new Error(
          qualifyData.error ||
            "AI qualification failed.",
        );
      }

      const qualifications =
        qualifyData.results || [];

      const qualifiedResults =
        discoveredResults.map(
          (result: Result) => {
            const qualification =
              qualifications.find(
                (item: {
                  company?: string;
                }) =>
                  item.company
                    ?.toLowerCase()
                    .trim() ===
                  result.company
                    .toLowerCase()
                    .trim(),
              );

            return {
              ...result,
              ...(qualification || {}),
            };
          },
        );

      qualifiedResults.sort(
        (
          a: Result,
          b: Result,
        ) =>
          (b.fit_score || 0) -
          (a.fit_score || 0),
      );

      setResults(
        qualifiedResults,
      );

      // Save discovered prospects to Supabase
      // without changing the Discover UI.
      try {
        const saveResponse = await fetch(
          "/api/prospects/save",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              prospects:
                qualifiedResults,
            }),
          },
        );

        const saveData =
          await saveResponse.json();

        if (!saveResponse.ok) {
          console.error(
            "Prospect save failed:",
            saveData.error,
          );
        } else {
          console.log(
            "Pakux saved prospects:",
            saveData,
          );
        }
      } catch (saveError) {
        console.error(
          "Prospect save failed:",
          saveError,
        );
      }

      setStage(
        text.stages.length,
      );

      setFinished(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    } finally {
      if (stageTimer) {
        clearInterval(stageTimer);
      }

      setRunning(false);
    }
  }

  return (
    <motion.div
      className="pk-page"
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
    >
      <div className="pk-page-header">
        <div>
          <div className="pk-eyebrow">
            {text.eyebrow}
          </div>

          <h1 className="pk-title">
            {text.title}
          </h1>

          <p className="pk-subtitle">
            {text.subtitle}
          </p>
        </div>
      </div>

      <div className="pk-card pk-card-padding pk-discover-box">
        <div className="pk-form-grid">
          <div className="pk-field">
            <label className="pk-label">
              {text.offer}
            </label>

            <input
              className="pk-input"
              value={offer}
              onChange={(e) =>
                setOffer(e.target.value)
              }
              placeholder={
                text.offerPlaceholder
              }
            />
          </div>

          <div className="pk-field">
            <label className="pk-label">
              {text.location}
            </label>

            <input
              className="pk-input"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              placeholder={
                text.locationPlaceholder
              }
            />
          </div>

          <div className="pk-field full">
            <label className="pk-label">
              {text.customers}
            </label>

            <textarea
              className="pk-textarea"
              value={customer}
              onChange={(e) =>
                setCustomer(e.target.value)
              }
              placeholder={
                text.customerPlaceholder
              }
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 18,
          }}
        >
          <button
            className="pk-button"
            onClick={startResearch}
            disabled={running}
          >
            {running
              ? text.searching
              : text.start}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="pk-card pk-card-padding pk-section"
          style={{
            borderColor:
              "rgba(255,80,80,0.35)",
          }}
        >
          <div className="pk-card-title">
            {text.errorTitle}
          </div>

          <div
            className="pk-card-small"
            style={{
              marginTop: 6,
            }}
          >
            {error}
          </div>
        </div>
      )}

      {running && (
        <motion.div
          className="pk-card pk-card-padding pk-section pk-ai-search-card"
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <div className="pk-ai-loader-wrap">
            <div className="pk-ai-loader">
              <motion.div
                className="pk-ai-orbit pk-ai-orbit-one"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <span />
              </motion.div>

              <motion.div
                className="pk-ai-orbit pk-ai-orbit-two"
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <span />
              </motion.div>

           <div
  className="pk-ai-core"
  style={{
    animation: "none",
    transform: "none",
  }}
>
  <motion.span
    animate={{
      rotate: 360,
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    }}
    style={{
      display: "inline-block",
    }}
  >
    ✦
  </motion.span>
</div>
            </div>
          </div>

          <div className="pk-ai-search-content">
            <div className="pk-ai-search-title">
              {text.researching}
            </div>

            <div className="pk-ai-search-description">
              {text.searchingDescription}
            </div>

            <motion.div
              key={stage}
              className="pk-ai-current-stage"
              initial={{
                opacity: 0,
                y: 6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <span className="pk-ai-stage-dot" />

              {text.stages[
                Math.min(
                  stage,
                  text.stages.length -
                    1,
                )
              ]}
            </motion.div>
          </div>

          <div className="pk-ai-live">
            <span className="pk-ai-live-dot" />
            {text.live}
          </div>

          <div className="pk-progress">
            {text.stages.map(
              (item, index) => (
                <motion.div
                  className={`pk-progress-item ${
                    index < stage
                      ? "done"
                      : index === stage
                        ? "active"
                        : ""
                  }`}
                  key={item}
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                >
                  <span className="pk-progress-dot" />

                  {item}

                  {index < stage && (
                    <span>✓</span>
                  )}
                </motion.div>
              ),
            )}
          </div>
        </motion.div>
      )}

      {finished && (
        <motion.div
          className="pk-section"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
        >
          <div className="pk-card pk-card-padding">
            <div className="pk-card-heading">
              <div>
                <div className="pk-card-title">
                  {text.qualified}
                </div>

                <div className="pk-card-small">
                  {text.qualifiedDescription}
                </div>
              </div>

              <div className="pk-pill active">
                {results.length}{" "}
                {text.matches}
              </div>
            </div>

            {results.length ===
            0 ? (
              <div
                className="pk-card-small"
                style={{
                  paddingTop: 20,
                }}
              >
                {text.noResults}
              </div>
            ) : (
              <div className="pk-list">
                {results.map(
                  (
                    result,
                    index,
                  ) => (
                    <motion.div
                      className="pk-list-row"
                      key={
                        result.company +
                        index
                      }
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          index *
                          0.04,
                      }}
                      style={{
                        alignItems:
                          "flex-start",
                      }}
                    >
                      <div
                        className="pk-company"
                        style={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <div className="pk-company-icon">
                          {result.company.charAt(
                            0,
                          )}
                        </div>

                        <div
                          style={{
                            minWidth: 0,
                            width: "100%",
                          }}
                        >
                          <div className="pk-company-name">
                            {
                              result.company
                            }
                          </div>

                          <div className="pk-company-meta">
                            {result.address ||
                              "Location unavailable"}
                          </div>

                          {result.contact
                            ?.email && (
                            <div
                              className="pk-company-meta"
                              style={{
                                marginTop: 4,
                              }}
                            >
                              {
                                result
                                  .contact
                                  .email
                              }

                              {result
                                .contact
                                .position &&
                                ` · ${result.contact.position}`}
                            </div>
                          )}

                          {result.fit_reason && (
                            <div
                              style={{
                                marginTop: 10,
                                fontSize:
                                  13,
                                lineHeight:
                                  1.5,
                                opacity:
                                  0.75,
                                maxWidth:
                                  720,
                              }}
                            >
                              <strong>
                                {
                                  text.why
                                }
                              </strong>{" "}
                              {
                                result.fit_reason
                              }
                            </div>
                          )}

                          {result.sales_angle && (
                            <div
                              style={{
                                marginTop: 6,
                                fontSize:
                                  13,
                                lineHeight:
                                  1.5,
                                opacity:
                                  0.55,
                                maxWidth:
                                  720,
                              }}
                            >
                              <strong>
                                {
                                  text.salesAngle
                                }
                              </strong>{" "}
                              {
                                result.sales_angle
                              }
                            </div>
                          )}

                          {result.recommended_contact_role && (
                            <div
                              style={{
                                marginTop: 7,
                                fontSize:
                                  12,
                                opacity:
                                  0.5,
                              }}
                            >
                              {
                                text.recommended
                              }{" "}
                              {
                                result.recommended_contact_role
                              }
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "flex-end",
                          flexDirection:
                            "column",
                          gap: 10,
                          minWidth:
                            115,
                        }}
                      >
                        {result.fit_score !==
                          undefined && (
                          <div
                            style={{
                              textAlign:
                                "center",
                            }}
                          >
                            <div
                              style={{
                                fontSize:
                                  28,
                                fontWeight:
                                  700,
                                lineHeight:
                                  1,
                              }}
                            >
                              {
                                result.fit_score
                              }
                            </div>

                            <div
                              style={{
                                fontSize:
                                  10,
                                opacity:
                                  0.45,
                                textTransform:
                                  "uppercase",
                                letterSpacing:
                                  ".08em",
                                marginTop:
                                  4,
                              }}
                            >
                              {text.fit}
                            </div>
                          </div>
                        )}

                        {result.priority && (
                          <span className="pk-status">
                            {
                              result.priority
                            }
                          </span>
                        )}

                        {result.website && (
                          <a
                            href={
                              result.website
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="pk-button secondary"
                          >
                            {text.website}
                          </a>
                        )}

                        <Link
                          href="/dashboard/prospects"
                          className="pk-button secondary"
                        >
                          {text.view}
                        </Link>
                      </div>
                    </motion.div>
                  ),
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}