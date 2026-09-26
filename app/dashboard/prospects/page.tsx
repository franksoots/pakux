"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const prospects = [
  {
    company: "Baltic Property Group",
    industry: "Real estate",
    location: "Tallinn",
    score: 96,
    contact: "Marketing Director",
    status: "New",
  },
  {
    company: "Nordic Hotels",
    industry: "Hospitality",
    location: "Estonia",
    score: 94,
    contact: "Brand Manager",
    status: "Saved",
  },
  {
    company: "Estonian Golf Resort",
    industry: "Hospitality",
    location: "Pärnu",
    score: 91,
    contact: "General Manager",
    status: "New",
  },
  {
    company: "Northline Architecture",
    industry: "Architecture",
    location: "Tallinn",
    score: 89,
    contact: "Partner",
    status: "New",
  },
  {
    company: "Pärnu Marine Systems",
    industry: "Engineering",
    location: "Pärnu",
    score: 86,
    contact: "Commercial Director",
    status: "Contacted",
  },
];

export default function ProspectsPage() {
  const [search, setSearch] = useState("");

  const filtered = prospects.filter((item) =>
    item.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="pk-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="pk-page-header">
        <div>
          <div className="pk-eyebrow">Prospects</div>
          <h1 className="pk-title">Your market.</h1>
          <p className="pk-subtitle">
            Companies Pakux has identified as potential customers.
          </p>
        </div>

        <div className="pk-pill active">347 total</div>
      </div>

      <div className="pk-card pk-card-padding">
        <div className="pk-toolbar">
          <div className="pk-search pk-toolbar-search">
            <span>⌕</span>
            <input
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="pk-pill active">All</button>
          <button className="pk-pill">Saved</button>
          <button className="pk-pill">Contacted</button>
        </div>

        <div className="pk-table-wrap">
          <table className="pk-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Industry</th>
                <th>Location</th>
                <th>Fit</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item, index) => (
                <motion.tr
                  key={item.company}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td>
                    <div className="pk-company">
                      <div className="pk-company-icon">
                        {item.company.charAt(0)}
                      </div>
                      <div className="pk-company-name">
                        {item.company}
                      </div>
                    </div>
                  </td>

                  <td>{item.industry}</td>
                  <td>{item.location}</td>
                  <td>
                    <span className="pk-score">{item.score}%</span>
                  </td>
                  <td>{item.contact}</td>
                  <td>
                    <span className="pk-status">{item.status}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}