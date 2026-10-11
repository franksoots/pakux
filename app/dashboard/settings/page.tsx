"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../../../components/language-provider";

export default function SettingsPage() {
  const { t, language } = useLanguage();

  return (
    <motion.div
      className="pk-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="pk-page-header">
        <div>
          <div className="pk-eyebrow">
            {t.settings.title}
          </div>

          <h1 className="pk-title">
            {language === "et"
              ? "Sinu Pakux."
              : "Your Pakux."}
          </h1>

          <p className="pk-subtitle">
            {t.settings.subtitle}
          </p>
        </div>
      </div>

      <div className="pk-settings-grid">
        <div className="pk-card pk-card-padding">
          <div className="pk-card-heading">
            <div>
              <div className="pk-card-title">
                {t.settings.profile}
              </div>

              <div className="pk-card-small">
                {language === "et"
                  ? "Sinu konto andmed."
                  : "Your account information."}
              </div>
            </div>
          </div>

          <div className="pk-form-grid">
            <div className="pk-field">
              <label className="pk-label">
                {t.auth.firstName}
              </label>

              <input
                className="pk-input"
                defaultValue="Frank"
              />
            </div>

            <div className="pk-field">
              <label className="pk-label">
                {t.auth.lastName}
              </label>

              <input
                className="pk-input"
                defaultValue="Soots"
              />
            </div>

            <div className="pk-field full">
              <label className="pk-label">
                {t.auth.email}
              </label>

              <input
                className="pk-input"
                type="email"
                defaultValue="frank@example.com"
              />
            </div>
          </div>

          <button className="pk-button" style={{ marginTop: 18 }}>
            {t.common.save}
          </button>
        </div>

        <div className="pk-card pk-card-padding">
          <div className="pk-card-heading">
            <div>
              <div className="pk-card-title">
                {t.settings.workspace}
              </div>

              <div className="pk-card-small">
                {language === "et"
                  ? "Sinu müügiprotsessi tööruum."
                  : "Your sales workspace."}
              </div>
            </div>
          </div>

          <div className="pk-field">
            <label className="pk-label">
              {language === "et"
                ? "Tööruumi nimi"
                : "Workspace name"}
            </label>

            <input
              className="pk-input"
              defaultValue="Pakux Demo"
            />
          </div>

          <div className="pk-field" style={{ marginTop: 16 }}>
            <label className="pk-label">
              {language === "et"
                ? "Kirjeldus"
                : "Description"}
            </label>

            <textarea
              className="pk-textarea"
              defaultValue={
                language === "et"
                  ? "Minu Pakuxi müügitööruum."
                  : "My Pakux sales workspace."
              }
            />
          </div>

          <button className="pk-button" style={{ marginTop: 18 }}>
            {t.common.save}
          </button>
        </div>

        <div className="pk-card pk-card-padding">
          <div className="pk-card-heading">
            <div>
              <div className="pk-card-title">
                {t.settings.notifications}
              </div>

              <div className="pk-card-small">
                {language === "et"
                  ? "Kontrolli, millal Pakux sinuga ühendust võtab."
                  : "Control when Pakux contacts you."}
              </div>
            </div>
          </div>

          <div className="pk-settings-option">
            <div>
              <div className="pk-card-title">
                {t.settings.emailNotifications}
              </div>

              <div className="pk-card-small">
                {language === "et"
                  ? "Saada mulle olulised tööruumi teavitused."
                  : "Send me important workspace notifications."}
              </div>
            </div>

            <div className="pk-toggle active">
              <div />
            </div>
          </div>

          <div className="pk-settings-option">
            <div>
              <div className="pk-card-title">
                {t.settings.researchCompleted}
              </div>

              <div className="pk-card-small">
                {language === "et"
                  ? "Teavita mind, kui AI-uuring on valmis."
                  : "Notify me when AI research is complete."}
              </div>
            </div>

            <div className="pk-toggle active">
              <div />
            </div>
          </div>

          <div className="pk-settings-option">
            <div>
              <div className="pk-card-title">
                {t.settings.weeklySummary}
              </div>

              <div className="pk-card-small">
                {language === "et"
                  ? "Nädalane kokkuvõte sinu müügitegevusest."
                  : "Weekly summary of your sales activity."}
              </div>
            </div>

            <div className="pk-toggle">
              <div />
            </div>
          </div>
        </div>

        <div className="pk-card pk-card-padding">
          <div className="pk-card-heading">
            <div>
              <div className="pk-card-title">
                {t.settings.language}
              </div>

              <div className="pk-card-small">
                {t.settings.languageDescription}
              </div>
            </div>
          </div>

          <div className="pk-language-setting">
            <button
              className={`pk-language-option ${
                language === "et" ? "active" : ""
              }`}
              onClick={() => {
                window.localStorage.setItem(
                  "pakux-language",
                  "et",
                );
                window.location.reload();
              }}
            >
              🇪🇪
              <span>Eesti</span>
            </button>

            <button
              className={`pk-language-option ${
                language === "en" ? "active" : ""
              }`}
              onClick={() => {
                window.localStorage.setItem(
                  "pakux-language",
                  "en",
                );
                window.location.reload();
              }}
            >
              🇬🇧
              <span>English</span>
            </button>
          </div>
        </div>

        <div className="pk-card pk-card-padding">
          <div className="pk-card-heading">
            <div>
              <div className="pk-card-title">
                {t.settings.integrations}
              </div>

              <div className="pk-card-small">
                {language === "et"
                  ? "Ühenda tööriistad, mida kasutad müügiks."
                  : "Connect the tools you use for sales."}
              </div>
            </div>
          </div>

          <div className="pk-settings-option">
            <div>
              <div className="pk-card-title">
                Gmail
              </div>

              <div className="pk-card-small">
                {language === "et"
                  ? "Saada kirju oma Gmaili kontolt."
                  : "Send emails from your Gmail account."}
              </div>
            </div>

            <button className="pk-button secondary">
              {t.settings.connect}
            </button>
          </div>

          <div className="pk-settings-option">
            <div>
              <div className="pk-card-title">
                Outlook
              </div>

              <div className="pk-card-small">
                {language === "et"
                  ? "Ühenda oma Microsofti postkast."
                  : "Connect your Microsoft mailbox."}
              </div>
            </div>

            <button className="pk-button secondary">
              {t.settings.connect}
            </button>
          </div>
        </div>

        <div className="pk-card pk-card-padding">
          <div className="pk-card-heading">
            <div>
              <div className="pk-card-title">
                {t.settings.planUsage}
              </div>

              <div className="pk-card-small">
                {language === "et"
                  ? "Sinu praegune Pakuxi kasutus."
                  : "Your current Pakux usage."}
              </div>
            </div>

            <div className="pk-pill active">
              Pro
            </div>
          </div>

          <div className="pk-settings-usage">
            <div className="pk-usage-row">
              <span>
                {language === "et"
                  ? "Leitud kliendid"
                  : "Prospects found"}
              </span>

              <strong>347 / 1,000</strong>
            </div>

            <div className="pk-progress-bar">
              <div style={{ width: "35%" }} />
            </div>

            <div className="pk-usage-row">
              <span>
                {language === "et"
                  ? "Saadetud kirjad"
                  : "Emails sent"}
              </span>

              <strong>48 / 500</strong>
            </div>

            <div className="pk-progress-bar">
              <div style={{ width: "10%" }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}