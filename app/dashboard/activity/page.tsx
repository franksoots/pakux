"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../../../components/language-provider";

export default function ActivityPage() {
  const { t, language } = useLanguage();

  const events =
    language === "et"
      ? [
          {
            title: t.activity.researchCompleted,
            text: "Pakux leidis sinu viimase turu-uuringu käigus 347 potentsiaalset ettevõtet.",
            time: "Täna · 14:32",
          },
          {
            title: t.activity.decisionMakersIdentified,
            text: "892 asjakohast rolli kaardistati leitud ettevõtete seas.",
            time: "Täna · 14:30",
          },
          {
            title: t.activity.prospectSaved,
            text: "Baltic Property Group lisati sinu potentsiaalsete klientide nimekirja.",
            time: "Täna · 14:11",
          },
          {
            title: t.activity.emailCreated,
            text: "Pakux lõi Nordic Hotelsile personaalse müügikirja mustandi.",
            time: "Täna · 13:48",
          },
          {
            title: t.activity.researchStarted,
            text: "Turu-uuring algas professionaalse videotootmise kohta Eestis.",
            time: "Täna · 13:42",
          },
        ]
      : [
          {
            title: t.activity.researchCompleted,
            text: "Pakux identified 347 potential companies from your latest market search.",
            time: "Today · 14:32",
          },
          {
            title: t.activity.decisionMakersIdentified,
            text: "892 relevant roles were mapped across your discovered companies.",
            time: "Today · 14:30",
          },
          {
            title: t.activity.prospectSaved,
            text: "Baltic Property Group was added to your prospect list.",
            time: "Today · 14:11",
          },
          {
            title: t.activity.emailCreated,
            text: "Pakux created a personalized outreach draft for Nordic Hotels.",
            time: "Today · 13:48",
          },
          {
            title: t.activity.researchStarted,
            text: "Research started for professional video production in Estonia.",
            time: "Today · 13:42",
          },
        ];

  return (
    <motion.div
      className="pk-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="pk-page-header">
        <div>
          <div className="pk-eyebrow">
            {t.activity.title}
          </div>

          <h1 className="pk-title">
            {language === "et"
              ? "Kõik, mida Pakux teeb."
              : "Everything Pakux does."}
          </h1>

          <p className="pk-subtitle">
            {t.activity.subtitle}
          </p>
        </div>
      </div>

      <div className="pk-card pk-card-padding">
        <div className="pk-card-heading">
          <div className="pk-card-title">
            {language === "et"
              ? "Hiljutine tegevus"
              : "Recent activity"}
          </div>

          <div className="pk-pill active">
            {language === "et" ? "Aktiivne" : "Live"}
          </div>
        </div>

        <div className="pk-timeline">
          {events.map((event, index) => (
            <motion.div
              key={event.title + event.time}
              className="pk-card pk-event"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="pk-event-title">
                {event.title}
              </div>

              <div className="pk-event-text">
                {event.text}
              </div>

              <div className="pk-event-time">
                {event.time}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}