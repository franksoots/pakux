"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [researchNotifications, setResearchNotifications] =
    useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  return (
    <motion.div
      className="pk-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="pk-page-header">
        <div>
          <div className="pk-eyebrow">Settings</div>
          <h1 className="pk-title">Your workspace.</h1>
          <p className="pk-subtitle">
            Manage your profile, workspace and Pakux preferences.
          </p>
        </div>
      </div>

      <div className="pk-grid pk-grid-2">
        <div className="pk-card pk-card-padding">
          <div className="pk-card-heading">
            <div>
              <div className="pk-card-title">Profile</div>
              <div className="pk-card-small">
                Your personal information
              </div>
            </div>
          </div>

          <div className="pk-form-grid">
            <div className="pk-field">
              <label className="pk-label">First name</label>
              <input className="pk-input" defaultValue="Frank" />
            </div>

            <div className="pk-field">
              <label className="pk-label">Last name</label>
              <input className="pk-input" defaultValue="Soots" />
            </div>

            <div className="pk-field full">
              <label className="pk-label">Email</label>
              <input
                className="pk-input"
                defaultValue="frank@example.com"
              />
            </div>

            <div className="pk-field full">
              <button className="pk-button">
                Save changes
              </button>
            </div>
          </div>
        </div>

        <div className="pk-card pk-card-padding">
          <div className="pk-card-heading">
            <div>
              <div className="pk-card-title">Workspace</div>
              <div className="pk-card-small">
                How Pakux represents your business
              </div>
            </div>
          </div>

          <div className="pk-form-grid">
            <div className="pk-field full">
              <label className="pk-label">Workspace name</label>
              <input
                className="pk-input"
                defaultValue="Pakux Demo"
              />
            </div>

            <div className="pk-field full">
              <label className="pk-label">What you sell</label>
              <textarea
                className="pk-textarea"
                defaultValue="Professional video production for businesses in Estonia."
              />
            </div>
          </div>
        </div>

        <div className="pk-card pk-card-padding pk-settings-section">
          <div className="pk-card-heading">
            <div>
              <div className="pk-card-title">Notifications</div>
              <div className="pk-card-small">
                Choose what Pakux sends you
              </div>
            </div>
          </div>

          <SettingToggle
            title="Email notifications"
            description="Receive important workspace updates."
            enabled={emailNotifications}
            onClick={() =>
              setEmailNotifications((value) => !value)
            }
          />

          <SettingToggle
            title="Research completed"
            description="Notify me when AI research finishes."
            enabled={researchNotifications}
            onClick={() =>
              setResearchNotifications((value) => !value)
            }
          />

          <SettingToggle
            title="Weekly summary"
            description="Receive a weekly overview of your activity."
            enabled={weeklySummary}
            onClick={() =>
              setWeeklySummary((value) => !value)
            }
          />
        </div>

        <div className="pk-card pk-card-padding">
          <div className="pk-card-heading">
            <div>
              <div className="pk-card-title">Plan & usage</div>
              <div className="pk-card-small">
                Your current Pakux subscription
              </div>
            </div>

            <div className="pk-pill active">Pro</div>
          </div>

          <div style={{ marginTop: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                color: "#9aa2ad",
                marginBottom: 8,
              }}
            >
              <span>AI research</span>
              <span>6,800 / 10,000</span>
            </div>

            <div className="pk-usage">
              <div className="pk-usage-bar" />
            </div>
          </div>

          <button
            className="pk-button secondary"
            style={{ marginTop: 20 }}
          >
            Manage plan
          </button>
        </div>

        <div className="pk-card pk-card-padding">
          <div className="pk-card-heading">
            <div>
              <div className="pk-card-title">Integrations</div>
              <div className="pk-card-small">
                Connect your sales tools
              </div>
            </div>
          </div>

          <SettingRow
            name="Gmail"
            description="Send outreach from your Gmail account."
          />

          <SettingRow
            name="Outlook"
            description="Connect Microsoft email later."
          />

          <SettingRow
            name="CRM"
            description="CRM integrations will appear here."
          />
        </div>

        <div className="pk-card pk-card-padding">
          <div className="pk-card-heading">
            <div>
              <div className="pk-card-title">Prototype mode</div>
              <div className="pk-card-small">
                Some features are visual prototypes.
              </div>
            </div>

            <div className="pk-pill">V1</div>
          </div>

          <p
            style={{
              color: "#737c87",
              fontSize: 11,
              lineHeight: 1.7,
            }}
          >
            Authentication, AI research, email sending and billing
            will be connected as the product backend is built.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function SettingToggle({
  title,
  description,
  enabled,
  onClick,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <div className="pk-setting-row">
      <div>
        <div className="pk-setting-title">{title}</div>
        <div className="pk-setting-description">
          {description}
        </div>
      </div>

      <button
        className={`pk-toggle ${enabled ? "on" : ""}`}
        onClick={onClick}
        aria-label={title}
      >
        <span />
      </button>
    </div>
  );
}

function SettingRow({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="pk-setting-row">
      <div>
        <div className="pk-setting-title">{name}</div>
        <div className="pk-setting-description">
          {description}
        </div>
      </div>

      <button className="pk-button secondary">
        Connect
      </button>
    </div>
  );
}