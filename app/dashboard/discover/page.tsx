"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const results = [
  ["Baltic Property Group", "Real estate", "Tallinn", 96],
  ["Nordic Hotels", "Hospitality", "Estonia", 94],
  ["Estonian Golf Resort", "Hospitality", "Pärnu", 91],
  ["Northline Architecture", "Architecture", "Tallinn", 89],
];

const stages = [
  "Understanding your offer",
  "Mapping the market",
  "Finding companies",
  "Identifying decision makers",
  "Scoring opportunities",
];

export default function DiscoverPage() {
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState(-1);
  const [finished, setFinished] = useState(false);

  function startResearch() {
    setRunning(true);
    setFinished(false);
    setStage(0);

    let current = 0;

    const timer = setInterval(() => {
      current++;

      if (current < stages.length) {
        setStage(current);
      } else {
        clearInterval(timer);
        setRunning(false);
        setFinished(true);
      }
    }, 550);
  }

  return (
    <motion.div
      className="pk-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="pk-page-header">
        <div>
          <div className="pk-eyebrow">AI discovery</div>
          <h1 className="pk-title">Find your next customers.</h1>
          <p className="pk-subtitle">
            Describe your offer and Pakux will map the market,
            identify companies and estimate who fits.
          </p>
        </div>
      </div>

      <div className="pk-card pk-card-padding pk-discover-box">
        <div className="pk-form-grid">
          <div className="pk-field">
            <label className="pk-label">What do you sell?</label>
            <input
              className="pk-input"
              defaultValue="Professional video production"
            />
          </div>

          <div className="pk-field">
            <label className="pk-label">Where do you sell?</label>
            <input
              className="pk-input"
              defaultValue="Estonia"
            />
          </div>

          <div className="pk-field full">
            <label className="pk-label">Who do you sell to?</label>
            <textarea
              className="pk-textarea"
              defaultValue="Hotels, real estate companies, restaurants and businesses that need professional video content."
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
            {running ? "Researching..." : "Start AI research →"}
          </button>
        </div>
      </div>

      {(running || finished) && (
        <motion.div
          className="pk-card pk-card-padding pk-section"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="pk-card-heading">
            <div>
              <div className="pk-card-title">
                {finished
                  ? "Research complete"
                  : "Pakux is researching the market"}
              </div>

              <div className="pk-card-small">
                {finished
                  ? "Potential customers have been identified."
                  : "This prototype is simulating the discovery process."}
              </div>
            </div>
          </div>

          <div className="pk-progress">
            {stages.map((item, index) => (
              <motion.div
                className={`pk-progress-item ${
                  index < stage
                    ? "done"
                    : index === stage
                      ? "active"
                      : ""
                }`}
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className="pk-progress-dot" />
                {item}
                {index < stage && <span>✓</span>}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {finished && (
        <motion.div
          className="pk-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="pk-card pk-card-padding">
            <div className="pk-card-heading">
              <div>
                <div className="pk-card-title">
                  Potential customers
                </div>
                <div className="pk-card-small">
                  Ranked by estimated fit
                </div>
              </div>

              <div className="pk-pill active">
                {results.length} matches
              </div>
            </div>

            <div className="pk-list">
              {results.map((result, index) => (
                <motion.div
                  className="pk-list-row"
                  key={result[0]}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className="pk-company">
                    <div className="pk-company-icon">
                      {String(result[0]).charAt(0)}
                    </div>

                    <div>
                      <div className="pk-company-name">
                        {result[0]}
                      </div>
                      <div className="pk-company-meta">
                        {result[1]} · {result[2]}
                      </div>
                    </div>
                  </div>

                  <div className="pk-score">{result[3]}%</div>

                  <Link
                    href="/dashboard/prospects"
                    className="pk-button secondary"
                  >
                    View
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}