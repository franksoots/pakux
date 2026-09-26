"use client";

import { motion } from "framer-motion";

const events = [
  {
    title: "Research completed",
    text: "Pakux identified 347 potential companies from your latest market search.",
    time: "Today · 14:32",
  },
  {
    title: "Decision makers identified",
    text: "892 relevant roles were mapped across your discovered companies.",
    time: "Today · 14:30",
  },
  {
    title: "Prospect saved",
    text: "Baltic Property Group was added to your prospect list.",
    time: "Today · 14:11",
  },
  {
    title: "Email draft created",
    text: "Pakux created a personalized outreach draft for Nordic Hotels.",
    time: "Today · 13:48",
  },
  {
    title: "Market research started",
    text: "Research started for professional video production in Estonia.",
    time: "Today · 13:42",
  },
];

export default function ActivityPage() {
  return (
    <motion.div
      className="pk-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="pk-page-header">
        <div>
          <div className="pk-eyebrow">Activity</div>
          <h1 className="pk-title">Everything Pakux does.</h1>
          <p className="pk-subtitle">
            A timeline of your research, prospects and outreach.
          </p>
        </div>
      </div>

      <div className="pk-card pk-card-padding">
        <div className="pk-card-heading">
          <div className="pk-card-title">Recent activity</div>
          <div className="pk-pill active">Live</div>
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
              <div className="pk-event-title">{event.title}</div>
              <div className="pk-event-text">{event.text}</div>
              <div className="pk-event-time">{event.time}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}