"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const demoOffers = [
  "Professional video production for companies in Estonia",
  "Professional photography for hotels in Estonia",
  "Social media management for restaurants in Tallinn",
  "Web design for small businesses in Estonia",
  "Real estate photography for property developers",
];

const prospects = [
  {
    company: "Baltic Property Group",
    industry: "Real Estate",
    location: "Tallinn",
    score: 96,
    initials: "BP",
    reason: "Expanding property portfolio with a strong need for premium visual content.",
  },
  {
    company: "Nordic Hotels",
    industry: "Hospitality",
    location: "Estonia",
    score: 94,
    initials: "NH",
    reason: "Multiple properties and active marketing activity create a strong fit.",
  },
  {
    company: "Estonian Golf Resort",
    industry: "Hospitality",
    location: "Pärnu",
    score: 91,
    initials: "EG",
    reason: "High-value customer experience where professional media can support bookings.",
  },
];

const useCases = [
  "Video production",
  "Photography",
  "Web design",
  "Marketing",
  "Consulting",
  "Software",
  "Real estate",
  "Construction",
  "Advertising",
];

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 35 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Counter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true });

  useEffect(() => {
    if (!visible) return;

    let frame = 0;
    const duration = 1300;
    const start = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.round(value * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [visible, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function ScoreRing({ score }: { score: number }) {
  return (
    <div className="score-ring" style={{ "--score": `${score}%` } as React.CSSProperties}>
      <div className="score-ring-inner">
        <strong>{score}</strong>
        <span>%</span>
      </div>
    </div>
  );
}

function Network() {
  const nodes = [
    [8, 30],
    [20, 16],
    [30, 43],
    [43, 20],
    [54, 48],
    [65, 18],
    [76, 39],
    [88, 20],
    [92, 58],
    [72, 67],
    [51, 73],
    [31, 72],
    [15, 62],
  ];

  const lines = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [2, 5],
    [3, 4],
    [3, 5],
    [4, 6],
    [4, 9],
    [5, 7],
    [5, 6],
    [6, 8],
    [6, 9],
    [8, 9],
    [9, 10],
    [10, 11],
    [11, 12],
    [2, 11],
    [0, 12],
  ];

  return (
    <div className="network">
      <div className="network-glow" />

      <svg
        className="network-svg"
        viewBox="0 0 100 80"
        preserveAspectRatio="none"
      >
        {lines.map(([a, b], index) => (
          <motion.line
            key={index}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            className="network-line"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.45 }}
            transition={{
              duration: 1.5,
              delay: index * 0.08,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 2,
            }}
          />
        ))}
      </svg>

      {nodes.map(([x, y], index) => (
        <motion.div
          key={index}
          className={`network-node ${index === 4 ? "network-node-main" : ""}`}
          style={{ left: `${x}%`, top: `${y}%` }}
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.55, 1, 0.55],
          }}
          transition={{
            duration: 2.5 + (index % 3),
            repeat: Infinity,
            delay: index * 0.18,
          }}
        />
      ))}

      <div className="network-label network-label-one">
        Companies
      </div>
      <div className="network-label network-label-two">
        Decision makers
      </div>
      <div className="network-label network-label-three">
        High-fit opportunities
      </div>
    </div>
  );
}

function FloatingCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`floating-card ${className}`}
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [demoIndex, setDemoIndex] = useState(0);
  const [selectedProspect, setSelectedProspect] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoIndex((current) => (current + 1) % demoOffers.length);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      {/* NAVIGATION */}
      <nav className="navbar">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <span />
            <span />
            <span />
          </span>
          <span>pakux</span>
        </Link>

        <div className="nav-links">
          <a href="#product">Product</a>
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pricing</a>
        </div>

        <div className="nav-actions">
          <Link href="/login" className="nav-login">
            Log in
          </Link>
          <Link href="/signup" className="button button-small">
            Get started
            <span>→</span>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" />

        <div className="hero-content">
          <Reveal>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              AI-powered customer discovery
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h1>
              Tell us what you sell.
              <br />
              <span>We&apos;ll find who needs it.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="hero-description">
              Pakux researches companies, finds the right people, and prepares
              personalized outreach — so you can spend less time prospecting
              and more time selling.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="hero-actions">
              <Link href="/signup" className="button button-large">
                Start finding customers
                <span>→</span>
              </Link>

              <a href="#product" className="text-button">
                See how it works
                <span>↓</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="hero-proof">
              <div className="proof-avatars">
                <span>F</span>
                <span>M</span>
                <span>J</span>
                <span>A</span>
              </div>
              <div>
                <strong>Built for modern B2B sales</strong>
                <small>Find opportunities without the spreadsheet.</small>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="hero-visual">
          <Network />

          <FloatingCard className="hero-card hero-card-one" delay={0}>
            <div className="mini-icon">✦</div>
            <div>
              <small>AI discovered</small>
              <strong>347 opportunities</strong>
            </div>
          </FloatingCard>

          <FloatingCard className="hero-card hero-card-two" delay={1}>
            <div className="mini-score">96</div>
            <div>
              <small>Fit score</small>
              <strong>Excellent match</strong>
            </div>
          </FloatingCard>

          <FloatingCard className="hero-card hero-card-three" delay={2}>
            <div className="mini-person">M</div>
            <div>
              <small>Decision maker</small>
              <strong>Marketing Director</strong>
            </div>
          </FloatingCard>
        </div>

        <div className="hero-scroll">
          <span />
          Scroll to explore
        </div>
      </section>

      {/* STATS */}
      <section className="stats-strip">
        <div className="stats-inner">
          <div className="stat">
            <strong>
              <Counter value={12481} />
            </strong>
            <span>companies researched</span>
          </div>

          <div className="stat">
            <strong>
              <Counter value={347} />
            </strong>
            <span>potential matches</span>
          </div>

          <div className="stat">
            <strong>
              <Counter value={892} />
            </strong>
            <span>decision makers identified</span>
          </div>

          <div className="stat">
            <strong>24/7</strong>
            <span>market discovery</span>
          </div>
        </div>
      </section>

      {/* PRODUCT DEMO */}
      <section className="section demo-section" id="product">
        <Reveal>
          <div className="section-heading centered">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              See Pakux in action
            </div>

            <h2>
              From a simple idea
              <br />
              <span>to a qualified market.</span>
            </h2>

            <p>
              You describe what you sell. Pakux does the research behind the
              scenes.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="demo-window">
            <div className="window-topbar">
              <div className="window-dots">
                <i />
                <i />
                <i />
              </div>
              <span>pakux / customer discovery</span>
              <div className="window-status">
                <span />
                Live research
              </div>
            </div>

            <div className="demo-layout">
              <div className="demo-input-panel">
                <div className="panel-label">WHAT DO YOU SELL?</div>

                <div className="demo-offer">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={demoIndex}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35 }}
                    >
                      {demoOffers[demoIndex]}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="demo-location">
                  <span>⌖</span>
                  Estonia
                </div>

                <div className="research-button">
                  <span className="research-pulse" />
                  AI researching market
                  <span className="research-arrow">→</span>
                </div>

                <div className="demo-progress">
                  <div className="progress-header">
                    <span>Market research</span>
                    <span>100%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              <div className="demo-results">
                <div className="results-header">
                  <div>
                    <span className="panel-label">RESEARCH RESULTS</span>
                    <h3>Potential customers</h3>
                  </div>

                  <span className="live-badge">
                    <i />
                    Live
                  </span>
                </div>

                <div className="result-list">
                  {prospects.map((prospect, index) => (
                    <motion.button
                      key={prospect.company}
                      className={`result-card ${
                        selectedProspect === index ? "selected" : ""
                      }`}
                      onClick={() => setSelectedProspect(index)}
                      whileHover={{ x: 4 }}
                    >
                      <div className="company-avatar">{prospect.initials}</div>

                      <div className="result-info">
                        <strong>{prospect.company}</strong>
                        <span>
                          {prospect.industry} · {prospect.location}
                        </span>
                      </div>

                      <div className="result-score">
                        <span>{prospect.score}</span>
                        <small>% fit</small>
                      </div>

                      <span className="result-arrow">→</span>
                    </motion.button>
                  ))}
                </div>

                <div className="result-detail">
                  <div className="detail-score">
                    <ScoreRing score={prospects[selectedProspect].score} />
                  </div>

                  <div className="detail-content">
                    <span className="detail-label">WHY THIS MATCH?</span>
                    <p>{prospects[selectedProspect].reason}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* USE CASES */}
      <section className="section use-case-section">
        <Reveal>
          <div className="section-heading">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Built for B2B
            </div>

            <h2>
              Whatever you sell,
              <br />
              <span>find who needs it.</span>
            </h2>

            <p>
              Pakux isn&apos;t tied to one industry. Describe your offer and
              let the AI figure out where the demand is.
            </p>
          </div>
        </Reveal>

        <div className="use-case-grid">
          {useCases.map((useCase, index) => (
            <Reveal key={useCase} delay={index * 0.035}>
              <motion.div
                className="use-case-card"
                whileHover={{ y: -5, scale: 1.01 }}
              >
                <span className="use-case-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong>{useCase}</strong>
                <span className="use-case-arrow">↗</span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section how-section" id="how-it-works">
        <Reveal>
          <div className="section-heading centered">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              How it works
            </div>

            <h2>
              Prospecting,
              <br />
              <span>without the busywork.</span>
            </h2>
          </div>
        </Reveal>

        <div className="steps">
          <Reveal delay={0}>
            <div className="step">
              <div className="step-number">01</div>
              <div className="step-line" />
              <div className="step-content">
                <span>Describe your offer</span>
                <h3>Tell Pakux what you sell.</h3>
                <p>
                  Give us a simple description of your product or service,
                  target location and ideal customer.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="step">
              <div className="step-number">02</div>
              <div className="step-line" />
              <div className="step-content">
                <span>Research the market</span>
                <h3>We map the opportunity.</h3>
                <p>
                  Pakux searches across companies and identifies businesses
                  that could benefit from what you offer.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="step">
              <div className="step-number">03</div>
              <div className="step-line" />
              <div className="step-content">
                <span>Find the right person</span>
                <h3>Go beyond company names.</h3>
                <p>
                  Discover relevant roles and contacts so you know who to
                  approach inside each company.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="step">
              <div className="step-number">04</div>
              <div className="step-content">
                <span>Start the conversation</span>
                <h3>Send something personal.</h3>
                <p>
                  Pakux creates personalized outreach based on each company,
                  giving you a head start on the conversation.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* NETWORK */}
      <section className="section universe-section">
        <div className="universe-copy">
          <Reveal>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              The Pakux engine
            </div>

            <h2>
              Turn the
              <br />
              <span>unknown market</span>
              <br />
              into a map.
            </h2>

            <p>
              Instead of manually searching hundreds of websites, directories
              and company pages, Pakux gives you a structured view of the
              companies around your offer.
            </p>

            <div className="universe-points">
              <div>
                <span>01</span>
                <p>Market discovery</p>
              </div>
              <div>
                <span>02</span>
                <p>Opportunity scoring</p>
              </div>
              <div>
                <span>03</span>
                <p>Contact discovery</p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="universe-visual-wrap">
          <div className="universe-visual">
            <Network />

            <div className="universe-center">
              <div className="center-pulse" />
              <strong>YOUR<br />OFFER</strong>
            </div>

            <FloatingCard
              className="universe-card universe-card-one"
              delay={0.5}
            >
              <span className="card-icon">◎</span>
              <div>
                <small>Companies found</small>
                <strong>12,481</strong>
              </div>
            </FloatingCard>

            <FloatingCard
              className="universe-card universe-card-two"
              delay={1.3}
            >
              <span className="card-icon">✦</span>
              <div>
                <small>High-fit prospects</small>
                <strong>347</strong>
              </div>
            </FloatingCard>
          </div>
        </Reveal>
      </section>

      {/* OUTREACH */}
      <section className="section outreach-section">
        <Reveal>
          <div className="outreach-layout">
            <div className="outreach-copy">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                From research to outreach
              </div>

              <h2>
                Don&apos;t just find
                <br />
                <span>the company.</span>
                <br />
                Find the angle.
              </h2>

              <p>
                Every prospect is different. Pakux uses the research it
                gathered to create an outreach starting point that feels
                relevant to the company you&apos;re contacting.
              </p>

              <Link href="/signup" className="text-button bright">
                Create your first prospect list
                <span>→</span>
              </Link>
            </div>

            <div className="email-card">
              <div className="email-top">
                <div className="email-avatar">M</div>
                <div>
                  <strong>Markus · Marketing Director</strong>
                  <span>Baltic Property Group</span>
                </div>
                <span className="email-status">AI DRAFT</span>
              </div>

              <div className="email-subject">
                <span>Subject</span>
                <strong>
                  A quick idea for Baltic Property Group&apos;s listings
                </strong>
              </div>

              <div className="email-body">
                <p>Hi Markus,</p>

                <p>
                  I came across Baltic Property Group while looking at
                  companies expanding their property portfolio in Estonia.
                </p>

                <p>
                  We help property teams create professional video content
                  that makes new listings stand out online. I thought there
                  might be a fit with some of your upcoming properties.
                </p>

                <p>
                  Would you be open to a quick conversation next week?
                </p>

                <p>Best,<br />Alex</p>
              </div>

              <div className="email-bottom">
                <span>
                  <i /> 4 personalized insights used
                </span>
                <button>Review draft →</button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* PRICING */}
      <section className="section pricing-section" id="pricing">
        <Reveal>
          <div className="section-heading centered">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Simple pricing
            </div>

            <h2>
              Start small.
              <br />
              <span>Scale when you need to.</span>
            </h2>

            <p>
              Your prospecting workflow should grow with your business.
            </p>
          </div>
        </Reveal>

        <div className="pricing-grid">
          <Reveal>
            <div className="pricing-card">
              <span className="pricing-label">STARTER</span>
              <h3>For getting started</h3>

              <div className="price">
                <strong>€29</strong>
                <span>/ month</span>
              </div>

              <p>Everything you need to discover your first opportunities.</p>

              <div className="pricing-divider" />

              <ul>
                <li>✓ AI customer discovery</li>
                <li>✓ Prospect research</li>
                <li>✓ Fit scoring</li>
                <li>✓ Personalized drafts</li>
              </ul>

              <Link href="/signup" className="button pricing-button">
                Start with Starter
                <span>→</span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="pricing-card featured">
              <div className="popular-badge">MOST POPULAR</div>
              <span className="pricing-label">GROWTH</span>
              <h3>For serious prospecting</h3>

              <div className="price">
                <strong>€79</strong>
                <span>/ month</span>
              </div>

              <p>
                More research capacity and more tools for a growing sales
                pipeline.
              </p>

              <div className="pricing-divider" />

              <ul>
                <li>✓ Everything in Starter</li>
                <li>✓ Larger prospect lists</li>
                <li>✓ Contact discovery</li>
                <li>✓ Advanced personalization</li>
                <li>✓ Outreach workflows</li>
              </ul>

              <Link href="/signup" className="button pricing-button">
                Start with Growth
                <span>→</span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="pricing-card">
              <span className="pricing-label">SCALE</span>
              <h3>For teams</h3>

              <div className="price">
                <strong>€199</strong>
                <span>/ month</span>
              </div>

              <p>
                Built for teams that want prospecting to become a repeatable
                system.
              </p>

              <div className="pricing-divider" />

              <ul>
                <li>✓ Everything in Growth</li>
                <li>✓ Higher usage limits</li>
                <li>✓ Team workspace</li>
                <li>✓ Advanced workflows</li>
              </ul>

              <Link href="/signup" className="button pricing-button">
                Start with Scale
                <span>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="final-cta">
        <div className="cta-glow" />

        <Reveal>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Your next customer is out there
          </div>

          <h2>
            Stop guessing
            <br />
            <span>who to contact.</span>
          </h2>

          <p>
            Tell Pakux what you sell. Let the AI find the companies,
            opportunities and people worth talking to.
          </p>

          <Link href="/signup" className="button button-large">
            Start finding customers
            <span>→</span>
          </Link>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-main">
          <Link href="/" className="brand">
            <span className="brand-mark">
              <span />
              <span />
              <span />
            </span>
            <span>pakux</span>
          </Link>

          <p>
            AI-powered customer discovery
            <br />
            for businesses that sell to businesses.
          </p>

          <div className="footer-links">
            <a href="#product">Product</a>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Pricing</a>
            <Link href="/login">Log in</Link>
            <Link href="/signup">Get started</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Pakux. All rights reserved.</span>
          <span>Built for the next generation of B2B sales.</span>
        </div>
      </footer>
    </main>
  );
}