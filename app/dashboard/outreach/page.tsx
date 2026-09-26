"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const emails = [
  {
    company: "Nordic Hotels",
    subject: "A video idea for Nordic Hotels",
    status: "Draft",
    time: "18 min ago",
  },
  {
    company: "Baltic Property Group",
    subject: "Visual content for your properties",
    status: "Ready",
    time: "42 min ago",
  },
  {
    company: "Estonian Golf Resort",
    subject: "Professional video for your next season",
    status: "Draft",
    time: "1h ago",
  },
];

export default function OutreachPage() {
  const [selected, setSelected] = useState(0);

  const email = emails[selected];

  return (
    <motion.div
      className="pk-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="pk-page-header">
        <div>
          <div className="pk-eyebrow">Outreach</div>
          <h1 className="pk-title">Turn prospects into conversations.</h1>
          <p className="pk-subtitle">
            Personalized messages generated from the research Pakux
            has done.
          </p>
        </div>
      </div>

      <div className="pk-email-layout">
        <div className="pk-card">
          <div style={{ padding: 17 }}>
            <div className="pk-card-title">Email drafts</div>
          </div>

          <div className="pk-email-list">
            {emails.map((item, index) => (
              <div
                key={item.company}
                className={`pk-email-item ${
                  selected === index ? "active" : ""
                }`}
                onClick={() => setSelected(index)}
              >
                <div className="pk-email-company">
                  {item.company}
                </div>

                <div className="pk-email-subject">
                  {item.subject}
                </div>

                <div className="pk-email-time">
                  {item.status} · {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          className="pk-card pk-card-padding pk-email-preview"
          key={selected}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="pk-card-heading">
            <div>
              <div className="pk-card-title">
                {email.subject}
              </div>
              <div className="pk-card-small">
                AI-generated outreach
              </div>
            </div>

            <div className="pk-pill active">{email.status}</div>
          </div>

          <div className="pk-email-meta">
            <div>
              <strong>To:</strong> Marketing Director · {email.company}
            </div>
            <div>
              <strong>Subject:</strong> {email.subject}
            </div>
          </div>

          <div className="pk-email-body">
            Hi there,
            <br />
            <br />
            I came across{" "}
            <span className="pk-highlight">{email.company}</span>{" "}
            while researching companies in Estonia that could benefit
            from stronger visual content.
            <br />
            <br />
            We produce professional video content designed to help
            businesses present their properties, locations and brand
            more effectively online.
            <br />
            <br />
            I had a couple of ideas specifically around how your
            current content could be turned into short-form video.
            <br />
            <br />
            Would you be open to a quick conversation?
            <br />
            <br />
            Best,
            <br />
            Frank
          </div>

          <div
            style={{
              display: "flex",
              gap: 9,
              marginTop: 28,
            }}
          >
            <button className="pk-button">
              Approve & prepare
            </button>

            <button className="pk-button secondary">
              Edit draft
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}