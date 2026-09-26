"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const companies = [
  {
    name: "Baltic Property Group",
    industry: "Real estate",
    score: 96,
    status: "High fit",
  },
  {
    name: "Nordic Hotels",
    industry: "Hospitality",
    score: 94,
    status: "High fit",
  },
  {
    name: "Estonian Golf Resort",
    industry: "Hospitality",
    score: 91,
    status: "Strong fit",
  },
  {
    name: "Northline Architecture",
    industry: "Architecture",
    score: 89,
    status: "Strong fit",
  },
];

const bars = [32, 44, 39, 57, 48, 66, 61, 76, 69, 86, 78, 93];

export default function DashboardPage() {
  return (
    <motion.div
      className="pk-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="pk-page-header">
        <div>
          <div className="pk-eyebrow">Overview</div>
          <h1 className="pk-title">Good afternoon.</h1>
          <p className="pk-subtitle">
            Your AI sales workspace is ready. Here is what Pakux has
            discovered for you.
          </p>
        </div>

        <Link href="/dashboard/discover" className="pk-button">
          + Find new customers
        </Link>
      </div>

      <div className="pk-grid pk-grid-4">
        {[
          ["Companies found", "12,481", "+18.4%"],
          ["Qualified prospects", "347", "+12.7%"],
          ["Decision makers", "892", "+24.1%"],
          ["Outreach drafts", "64", "+8.2%"],
        ].map(([label, number, change], index) => (
          <motion.div
            key={label}
            className="pk-card pk-card-padding pk-metric"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <div className="pk-metric-label">{label}</div>
            <div className="pk-metric-number">{number}</div>
            <div className="pk-metric-change">{change} this month</div>
          </motion.div>
        ))}
      </div>

      <div className="pk-grid pk-grid-2 pk-section">
        <div className="pk-card pk-card-padding">
          <div className="pk-card-heading">
            <div>
              <div className="pk-card-title">Market discovery</div>
              <div className="pk-card-small">
                Companies identified over the last 12 months
              </div>
            </div>
            <div className="pk-pill active">Live</div>
          </div>

          <div className="pk-chart">
            <div className="pk-chart-lines">
              {[1, 2, 3, 4, 5].map((line) => (
                <div className="pk-chart-line" key={line} />
              ))}
            </div>

            <div className="pk-bars">
              {bars.map((height, index) => (
                <motion.div
                  key={index}
                  className="pk-bar"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.035,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="pk-card pk-card-padding">
          <div className="pk-card-heading">
            <div>
              <div className="pk-card-title">Top opportunities</div>
              <div className="pk-card-small">
                Highest-fit companies found recently
              </div>
            </div>
            <Link href="/dashboard/prospects" className="pk-card-small">
              View all →
            </Link>
          </div>

          <div className="pk-list">
            {companies.map((company, index) => (
              <motion.div
                className="pk-list-row"
                key={company.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.08 }}
              >
                <div className="pk-company">
                  <div className="pk-company-icon">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <div className="pk-company-name">{company.name}</div>
                    <div className="pk-company-meta">
                      {company.industry}
                    </div>
                  </div>
                </div>

                <div className="pk-score">{company.score}%</div>
                <div className="pk-status">{company.status}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="pk-grid pk-grid-2 pk-section">
        <div className="pk-card pk-card-padding">
          <div className="pk-card-heading">
            <div className="pk-card-title">Recent activity</div>
            <Link href="/dashboard/activity" className="pk-card-small">
              See activity →
            </Link>
          </div>

          <div className="pk-list">
            <div className="pk-list-row">
              <div>
                <div className="pk-company-name">Research completed</div>
                <div className="pk-company-meta">
                  347 potential customers discovered
                </div>
              </div>
              <div className="pk-status">2m ago</div>
            </div>

            <div className="pk-list-row">
              <div>
                <div className="pk-company-name">Email draft created</div>
                <div className="pk-company-meta">
                  Nordic Hotels
                </div>
              </div>
              <div className="pk-status">18m ago</div>
            </div>

            <div className="pk-list-row">
              <div>
                <div className="pk-company-name">Prospect saved</div>
                <div className="pk-company-meta">
                  Baltic Property Group
                </div>
              </div>
              <div className="pk-status">42m ago</div>
            </div>
          </div>
        </div>

        <div className="pk-card pk-card-padding">
          <div className="pk-card-heading">
            <div>
              <div className="pk-card-title">Your plan</div>
              <div className="pk-card-small">
                Pro workspace
              </div>
            </div>
            <div className="pk-pill active">Active</div>
          </div>

          <div style={{ marginBottom: 9, color: "#9aa2ad", fontSize: 11 }}>
            AI research usage
          </div>

          <div className="pk-usage">
            <motion.div
              className="pk-usage-bar"
              initial={{ width: 0 }}
              animate={{ width: "68%" }}
              transition={{ duration: 0.8 }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
              color: "#626b76",
              fontSize: 10,
            }}
          >
            <span>6,800 / 10,000 credits</span>
            <span>68%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}