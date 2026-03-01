import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";

function AnimatedCounter({ target, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setStats(d.data))
      .catch(() => {});
  }, []);

  const howItWorks = [
    { step: "01", icon: "🍽️", title: "Restaurants List Surplus", desc: "Restaurants upload details of their surplus food — type, quantity, pickup window, and location — in under 2 minutes." },
    { step: "02", icon: "🔔", title: "Shelters Get Notified", desc: "Local shelters and food banks receive real-time alerts for available food nearby, sorted by distance and urgency." },
    { step: "03", icon: "🤖", title: "AI Optimizes Matching", desc: "Gemini AI analyzes patterns to predict waste before it happens and recommends the best rescue opportunities." },
    { step: "04", icon: "♻️", title: "Track Your Impact", desc: "Every rescue is logged. See exactly how much CO₂ and water you saved, and how many meals you provided." },
  ];

  const features = [
    { icon: "📊", title: "Waste Prediction", desc: "Gemini AI analyzes historical patterns to predict which food is most at risk, enabling proactive rescue before waste occurs." },
    { icon: "⚡", title: "Real-time Matching", desc: "Smart matching connects restaurants with the nearest shelter or food bank, minimizing transport time and maximizing freshness." },
    { icon: "🌍", title: "Carbon Tracking", desc: "Every rescued kilogram of food prevents CO₂ emissions. Track your environmental contribution with precise calculations." },
    { icon: "💧", title: "Water Savings", desc: "Food production is water-intensive. Know exactly how many liters of water you've helped conserve through food rescue." },
    { icon: "📱", title: "Easy Uploads", desc: "Restaurants can list surplus food in minutes from any device. Simple forms, instant notifications to nearby partners." },
    { icon: "📈", title: "Impact Dashboard", desc: "Beautiful dashboards showing community-wide impact, top contributing restaurants, and long-term sustainability trends." },
  ];

  const testimonials = [
    { quote: "GreenBridge has cut our food waste by 60%. We list our end-of-day surplus and it's gone within the hour.", name: "Chef Maria Santos", role: "Executive Chef, The Green Table", avatar: "👩‍🍳" },
    { quote: "We now serve 40% more meals to our community thanks to GreenBridge. The AI predictions are incredibly accurate.", name: "James Williams", role: "Director, City Hope Shelter", avatar: "👨‍💼" },
    { quote: "The impact numbers are real and inspiring. Our bakery has saved over 500 kg of food from landfill this year.", name: "Priya Patel", role: "Owner, Urban Bakehouse", avatar: "👩‍💻" },
  ];

  return (
    <>
      <Head>
        <title>GreenBridge – AI-Powered Food Rescue Platform</title>
        <meta name="description" content="Connect surplus food from restaurants to shelters and food banks. AI-powered waste prediction and impact tracking." />
      </Head>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Powered by Gemini AI
          </div>
          <h1 className="hero-title">
            Rescue Food.
            <br />
            <span className="gradient-text">Feed Communities.</span>
            <br />
            Save the Planet.
          </h1>
          <p className="hero-desc">
            GreenBridge connects restaurants with surplus food directly to shelters and food banks using AI-powered matching and waste prediction. Every meal rescued is a step toward zero food waste.
          </p>
          <div className="hero-actions">
            <Link href="/restaurant" className="btn btn-primary btn-large">
              🍽️ I Have Surplus Food
            </Link>
            <Link href="/shelter" className="btn btn-secondary btn-large">
              🏠 We Need Food
            </Link>
          </div>
          <div className="hero-trust">
            <span>🌿 Zero food waste goal</span>
            <span>🤖 Gemini AI powered</span>
            <span>📍 Location-aware</span>
          </div>
        </div>
      </section>

      {/* Live Stats Banner */}
      {stats && (
        <section className="stats-banner">
          <div className="container stats-grid">
            <div className="stat-item">
              <div className="stat-value">
                <AnimatedCounter target={stats.totalKgRescued} suffix=" kg" />
              </div>
              <div className="stat-lbl">Food Rescued</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">
                <AnimatedCounter target={stats.totalCarbonSaved} suffix=" kg" />
              </div>
              <div className="stat-lbl">CO₂ Prevented</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">
                <AnimatedCounter target={stats.totalWaterSaved} suffix="L" />
              </div>
              <div className="stat-lbl">Water Saved</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">
                <AnimatedCounter target={stats.mealsProvided} suffix=" meals" />
              </div>
              <div className="stat-lbl">Meals Provided</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">
                <AnimatedCounter target={stats.available} />
              </div>
              <div className="stat-lbl">Available Now</div>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Simple Process</div>
            <h2 className="section-h2">How GreenBridge Works</h2>
            <p className="section-p">From surplus to served — in four simple steps.</p>
          </div>
          <div className="steps-grid">
            {howItWorks.map((item, i) => (
              <div key={i} className="step-card">
                <div className="step-number">{item.step}</div>
                <div className="step-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Platform Features</div>
            <h2 className="section-h2">Everything You Need</h2>
            <p className="section-p">A complete ecosystem for food rescue, powered by artificial intelligence.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Split */}
      <section className="section">
        <div className="container">
          <div className="cta-split">
            <div className="cta-card cta-restaurant">
              <div className="cta-icon">🍽️</div>
              <h3>For Restaurants</h3>
              <p>List your surplus food in minutes. Reduce waste, lower disposal costs, and earn sustainability credits.</p>
              <ul className="cta-list">
                <li>✓ Quick 2-minute food listing</li>
                <li>✓ Automatic shelter matching</li>
                <li>✓ Track your impact over time</li>
                <li>✓ AI waste prevention alerts</li>
              </ul>
              <Link href="/restaurant" className="btn btn-primary">Start Donating →</Link>
            </div>
            <div className="cta-card cta-shelter">
              <div className="cta-icon">🏠</div>
              <h3>For Shelters & Food Banks</h3>
              <p>Discover and claim available food near you. Get notifications the moment new listings appear.</p>
              <ul className="cta-list">
                <li>✓ Browse available food in real-time</li>
                <li>✓ One-click claiming</li>
                <li>✓ Location-based filtering</li>
                <li>✓ Track meals served</li>
              </ul>
              <Link href="/shelter" className="btn btn-secondary">Find Available Food →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Community Stories</div>
            <h2 className="section-h2">Real Impact, Real People</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="quote-mark">"</div>
                <p className="quote-text">{t.quote}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.avatar}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="container">
          <div className="final-cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join GreenBridge today. Every meal rescued is a win for people and the planet.</p>
            <div className="final-cta-actions">
              <Link href="/predictions" className="btn btn-primary btn-large">
                🤖 See AI Predictions
              </Link>
              <Link href="/impact" className="btn btn-secondary btn-large" style={{background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.4)', color: 'white'}}>
                📊 View Impact Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero {
          position: relative;
          background: linear-gradient(160deg, #1b4332 0%, #2d6a4f 40%, #40916c 100%);
          color: white;
          padding: 100px 0 80px;
          overflow: hidden;
        }

        .hero-bg-shapes {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.08;
          background: white;
        }

        .shape-1 { width: 500px; height: 500px; top: -200px; right: -100px; }
        .shape-2 { width: 300px; height: 300px; bottom: -100px; left: 10%; }
        .shape-3 { width: 200px; height: 200px; top: 30%; right: 20%; }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 680px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.25);
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 28px;
          backdrop-filter: blur(4px);
        }

        .badge-dot {
          width: 7px;
          height: 7px;
          background: #74c69d;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }

        .gradient-text {
          background: linear-gradient(90deg, #74c69d, #b7e4c7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-desc {
          font-size: 1.15rem;
          line-height: 1.7;
          opacity: 0.88;
          margin-bottom: 36px;
          max-width: 560px;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }

        .hero-actions .btn-secondary {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.4);
          color: white;
        }

        .hero-actions .btn-secondary:hover {
          background: rgba(255,255,255,0.2);
        }

        .hero-trust {
          display: flex;
          gap: 24px;
          font-size: 0.85rem;
          opacity: 0.75;
          flex-wrap: wrap;
        }

        .stats-banner {
          background: white;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          position: relative;
          z-index: 2;
        }

        .stats-grid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 0;
          gap: 8px;
        }

        .stat-item {
          text-align: center;
          flex: 1;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: #2d6a4f;
          line-height: 1.2;
        }

        .stat-lbl {
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 500;
          margin-top: 4px;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: #e5e7eb;
          flex-shrink: 0;
        }

        .section {
          padding: 80px 0;
        }

        .section-alt {
          background: #f0faf3;
        }

        .section-header {
          text-align: center;
          margin-bottom: 56px;
        }

        .section-tag {
          display: inline-block;
          background: #d8f3dc;
          color: #2d6a4f;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 14px;
          border-radius: 20px;
          margin-bottom: 12px;
        }

        .section-h2 {
          font-size: 2.2rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 12px;
        }

        .section-p {
          font-size: 1.05rem;
          color: #6b7280;
          max-width: 500px;
          margin: 0 auto;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          position: relative;
        }

        .step-card {
          background: white;
          border-radius: 16px;
          padding: 32px 24px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          position: relative;
          text-align: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .step-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .step-number {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: #2d6a4f;
          color: white;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.05em;
        }

        .step-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
        }

        .step-card h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }

        .step-card p {
          font-size: 0.88rem;
          color: #6b7280;
          line-height: 1.6;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .feature-card {
          background: white;
          border-radius: 16px;
          padding: 32px 28px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          border: 1.5px solid #e5e7eb;
          transition: all 0.2s;
        }

        .feature-card:hover {
          border-color: #74c69d;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(45, 106, 79, 0.1);
        }

        .feature-icon {
          font-size: 2rem;
          margin-bottom: 14px;
        }

        .feature-card h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }

        .feature-card p {
          font-size: 0.88rem;
          color: #6b7280;
          line-height: 1.6;
        }

        .cta-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .cta-card {
          padding: 40px 36px;
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }

        .cta-restaurant {
          background: linear-gradient(135deg, #1b4332, #2d6a4f);
          color: white;
        }

        .cta-shelter {
          background: white;
          border: 2px solid #d8f3dc;
          color: #111827;
        }

        .cta-icon {
          font-size: 2.5rem;
          margin-bottom: 16px;
        }

        .cta-card h3 {
          font-size: 1.4rem;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .cta-restaurant h3 { color: white; }

        .cta-card p {
          font-size: 0.95rem;
          margin-bottom: 20px;
          line-height: 1.6;
          opacity: 0.85;
        }

        .cta-list {
          list-style: none;
          margin-bottom: 28px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cta-list li {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .cta-restaurant .btn-primary {
          background: #74c69d;
          color: #1b4332;
        }

        .cta-restaurant .btn-primary:hover {
          background: #95d5b2;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .testimonial-card {
          background: white;
          border-radius: 16px;
          padding: 32px 28px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          position: relative;
        }

        .quote-mark {
          font-size: 4rem;
          line-height: 0.6;
          color: #d8f3dc;
          font-family: Georgia, serif;
          margin-bottom: 12px;
        }

        .quote-text {
          font-size: 0.95rem;
          color: #374151;
          line-height: 1.7;
          margin-bottom: 20px;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .author-avatar {
          font-size: 2rem;
          background: #f0faf3;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .author-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #111827;
        }

        .author-role {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .final-cta {
          background: linear-gradient(135deg, #1b4332 0%, #40916c 100%);
          padding: 80px 0;
          text-align: center;
          color: white;
        }

        .final-cta-content h2 {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 12px;
        }

        .final-cta-content p {
          font-size: 1.1rem;
          opacity: 0.85;
          margin-bottom: 36px;
        }

        .final-cta-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .final-cta .btn-primary {
          background: #74c69d;
          color: #1b4332;
          font-weight: 700;
        }

        @media (max-width: 1024px) {
          .steps-grid { grid-template-columns: repeat(2, 1fr); }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .hero { padding: 70px 0 60px; }
          .hero-actions { flex-direction: column; }
          .hero-actions .btn { width: 100%; max-width: 320px; }
          .stats-grid { flex-wrap: wrap; }
          .stat-divider { display: none; }
          .stat-item { min-width: 40%; }
          .steps-grid { grid-template-columns: 1fr; }
          .features-grid { grid-template-columns: 1fr; }
          .cta-split { grid-template-columns: 1fr; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .section-h2 { font-size: 1.75rem; }
          .final-cta-content h2 { font-size: 1.8rem; }
        }
      `}</style>
    </>
  );
}
