import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

function StatCard({ value, label, icon, color = "#2d6a4f", bg = "#f0faf3" }) {
  return (
    <div className="stat-card" style={{ borderColor: color + "33", background: bg }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-label">{label}</div>
      <style jsx>{`
        .stat-card {
          border-radius: 16px;
          padding: 24px;
          border: 1.5px solid;
          text-align: center;
          transition: transform 0.2s;
        }
        .stat-card:hover { transform: translateY(-3px); }
        .stat-icon { font-size: 2rem; margin-bottom: 8px; }
        .stat-value { font-size: 1.8rem; font-weight: 900; line-height: 1.1; margin-bottom: 6px; }
        .stat-label { font-size: 0.82rem; font-weight: 600; color: #6b7280; }
      `}</style>
    </div>
  );
}

function EquivalentCard({ item }) {
  return (
    <div className="eq-card">
      <span className="eq-icon">{item.icon}</span>
      <div className="eq-content">
        <div className="eq-value">{item.value}</div>
        <div className="eq-label">{item.label}</div>
      </div>
      <style jsx>{`
        .eq-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: white;
          border-radius: 12px;
          padding: 16px 18px;
          border: 1.5px solid #e5e7eb;
          transition: all 0.2s;
        }
        .eq-card:hover {
          border-color: #74c69d;
          box-shadow: 0 4px 12px rgba(45,106,79,0.08);
        }
        .eq-icon { font-size: 1.8rem; flex-shrink: 0; }
        .eq-value { font-size: 1rem; font-weight: 800; color: #111827; }
        .eq-label { font-size: 0.8rem; color: #6b7280; margin-top: 2px; }
      `}</style>
    </div>
  );
}

function ProgressBar({ value, max, color }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      <style jsx>{`
        .progress-bar {
          height: 8px;
          background: #f3f4f6;
          border-radius: 8px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 8px;
          transition: width 1s ease;
        }
      `}</style>
    </div>
  );
}

export default function Impact() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/impact")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d);
        else setError("Failed to load impact data.");
        setLoading(false);
      })
      .catch(() => { setError("Network error."); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <>
        <div className="page-header">
          <div className="container"><h1>📊 Impact Dashboard</h1></div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Calculating your impact...</p>
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <div className="page-header">
          <div className="container"><h1>📊 Impact Dashboard</h1></div>
        </div>
        <div className="container" style={{padding: "40px 24px"}}>
          <div className="alert alert-error">{error || "Failed to load data."}</div>
        </div>
      </>
    );
  }

  const { stats, restaurants, shelters, aiReport } = data;
  const maxCarbon = Math.max(...(restaurants || []).map(r => r.totalCarbonSaved || 0), 1);
  const maxWater = Math.max(...(restaurants || []).map(r => r.totalWaterSaved || 0), 1);

  return (
    <>
      <Head>
        <title>Impact Dashboard – GreenBridge</title>
      </Head>

      <div className="page-header">
        <div className="container">
          <h1>📊 Impact Dashboard</h1>
          <p>Real-time environmental and community impact metrics for the GreenBridge platform.</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {/* AI Headline */}
          {aiReport?.headline && (
            <div className="headline-banner">
              <div className="headline-icon">🌍</div>
              <div className="headline-text">
                <p className="headline-main">{aiReport.headline}</p>
                {aiReport.motivationalMessage && (
                  <p className="headline-sub">{aiReport.motivationalMessage}</p>
                )}
              </div>
            </div>
          )}

          {/* Key Stats */}
          <section className="impact-section">
            <h2 className="section-title">Platform Overview</h2>
            <p className="section-subtitle">Cumulative impact since GreenBridge launched.</p>
            <div className="grid-4">
              <StatCard value={`${stats.totalKgRescued} kg`} label="Food Rescued" icon="🥗" color="#2d6a4f" bg="#f0faf3" />
              <StatCard value={`${stats.totalCarbonSaved} kg`} label="CO₂ Prevented" icon="🌍" color="#059669" bg="#ecfdf5" />
              <StatCard value={`${(stats.totalWaterSaved / 1000).toFixed(1)}k L`} label="Water Saved" icon="💧" color="#2563eb" bg="#eff6ff" />
              <StatCard value={stats.mealsProvided} label="Meals Provided" icon="🍽️" color="#d97706" bg="#fffbeb" />
            </div>

            <div className="grid-4" style={{marginTop: "16px"}}>
              <StatCard value={stats.total} label="Total Listings" icon="📋" color="#7c3aed" bg="#f5f3ff" />
              <StatCard value={stats.available} label="Available Now" icon="✅" color="#16a34a" bg="#f0fdf4" />
              <StatCard value={stats.claimed} label="Successfully Claimed" icon="🤝" color="#0891b2" bg="#ecfeff" />
              <StatCard value={`${stats.total > 0 ? Math.round((stats.claimed / stats.total) * 100) : 0}%`} label="Claim Rate" icon="📈" color="#ea580c" bg="#fff7ed" />
            </div>
          </section>

          {/* Carbon Equivalents */}
          {aiReport?.carbonEquivalents && (
            <section className="impact-section">
              <h2 className="section-title">🌿 Carbon Savings Equivalents</h2>
              <p className="section-subtitle">What {stats.totalCarbonSaved} kg of CO₂ saved is equivalent to:</p>
              <div className="grid-3">
                {aiReport.carbonEquivalents.map((item, i) => (
                  <EquivalentCard key={i} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Water Equivalents */}
          {aiReport?.waterEquivalents && (
            <section className="impact-section">
              <h2 className="section-title">💧 Water Savings Equivalents</h2>
              <p className="section-subtitle">What {stats.totalWaterSaved.toLocaleString()} liters of water saved means:</p>
              <div className="grid-3">
                {aiReport.waterEquivalents.map((item, i) => (
                  <EquivalentCard key={i} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Narrative */}
          {(aiReport?.communityImpact || aiReport?.environmentalNarrative) && (
            <section className="impact-section">
              <div className="narrative-grid">
                {aiReport.communityImpact && (
                  <div className="narrative-card community">
                    <div className="narrative-icon">🤝</div>
                    <h3>Community Impact</h3>
                    <p>{aiReport.communityImpact}</p>
                  </div>
                )}
                {aiReport.environmentalNarrative && (
                  <div className="narrative-card environmental">
                    <div className="narrative-icon">🌱</div>
                    <h3>Environmental Impact</h3>
                    <p>{aiReport.environmentalNarrative}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Restaurant Leaderboard */}
          {restaurants && restaurants.length > 0 && (
            <section className="impact-section">
              <h2 className="section-title">🏆 Restaurant Leaderboard</h2>
              <p className="section-subtitle">Top contributors by environmental impact.</p>
              <div className="leaderboard">
                {restaurants.map((r, i) => (
                  <div key={r.id} className="leaderboard-row">
                    <div className="lb-rank">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</div>
                    <div className="lb-info">
                      <div className="lb-name">{r.name}</div>
                      <div className="lb-type">{r.type} · {r.location}</div>
                    </div>
                    <div className="lb-metrics">
                      <div className="lb-metric">
                        <span className="lb-val">{r.totalDonated}</span>
                        <span className="lb-lbl">listings</span>
                      </div>
                      <div className="lb-metric">
                        <span className="lb-val">{r.totalCarbonSaved} kg</span>
                        <span className="lb-lbl">CO₂ saved</span>
                      </div>
                      <div className="lb-metric">
                        <span className="lb-val">{(r.totalWaterSaved / 1000).toFixed(1)}k L</span>
                        <span className="lb-lbl">water saved</span>
                      </div>
                    </div>
                    <div className="lb-bar-col">
                      <ProgressBar value={r.totalCarbonSaved} max={maxCarbon} color="#52b788" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Shelter Stats */}
          {shelters && shelters.length > 0 && (
            <section className="impact-section">
              <h2 className="section-title">🏠 Shelter & Food Bank Performance</h2>
              <p className="section-subtitle">Organizations receiving rescued food through GreenBridge.</p>
              <div className="grid-2">
                {shelters.map((s) => (
                  <div key={s.id} className="shelter-card">
                    <div className="shelter-header">
                      <div>
                        <div className="shelter-name">{s.name}</div>
                        <div className="shelter-type">{s.type} · {s.location}</div>
                      </div>
                      <div className="shelter-badge">{s.type === "Food Bank" ? "🏦" : s.type === "Homeless Shelter" ? "🏠" : "🤝"}</div>
                    </div>
                    <div className="shelter-stats">
                      <div className="sh-stat">
                        <div className="sh-val">{s.totalClaimed}</div>
                        <div className="sh-lbl">Items Claimed</div>
                      </div>
                      <div className="sh-stat">
                        <div className="sh-val">{s.peopleServed}</div>
                        <div className="sh-lbl">People Served</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="impact-cta">
            <h2>Help Us Reach Zero Food Waste</h2>
            <p>Every restaurant that joins, every listing created, and every claim made brings us closer to our goal.</p>
            <div className="impact-cta-actions">
              <Link href="/restaurant" className="btn btn-primary btn-large">🍽️ List Surplus Food</Link>
              <Link href="/shelter" className="btn btn-secondary btn-large">🏠 Claim Available Food</Link>
              <Link href="/predictions" className="btn btn-secondary btn-large">🤖 AI Predictions</Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .headline-banner {
          background: linear-gradient(135deg, #1b4332, #2d6a4f);
          color: white;
          border-radius: 20px;
          padding: 28px 32px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
          margin-bottom: 40px;
        }

        .headline-icon { font-size: 2.5rem; flex-shrink: 0; }

        .headline-main {
          font-size: 1.1rem;
          font-weight: 700;
          line-height: 1.6;
          margin-bottom: 8px;
        }

        .headline-sub {
          font-size: 0.9rem;
          opacity: 0.8;
          font-style: italic;
          line-height: 1.5;
        }

        .impact-section {
          margin-bottom: 48px;
        }

        .narrative-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .narrative-card {
          border-radius: 16px;
          padding: 28px;
        }

        .narrative-card.community {
          background: #eff6ff;
          border: 1.5px solid #bfdbfe;
        }

        .narrative-card.environmental {
          background: #f0faf3;
          border: 1.5px solid #b7e4c7;
        }

        .narrative-icon { font-size: 2rem; margin-bottom: 10px; }

        .narrative-card h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 10px;
        }

        .narrative-card p {
          font-size: 0.9rem;
          color: #374151;
          line-height: 1.7;
        }

        .leaderboard {
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        .leaderboard-row {
          display: grid;
          grid-template-columns: 48px 1fr auto 180px;
          align-items: center;
          gap: 16px;
          padding: 18px 24px;
          border-bottom: 1px solid #f3f4f6;
          transition: background 0.15s;
        }

        .leaderboard-row:last-child { border-bottom: none; }
        .leaderboard-row:hover { background: #f9fafb; }

        .lb-rank {
          font-size: 1.3rem;
          text-align: center;
          font-weight: 700;
          color: #374151;
        }

        .lb-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: #111827;
        }

        .lb-type {
          font-size: 0.78rem;
          color: #9ca3af;
          margin-top: 2px;
        }

        .lb-metrics {
          display: flex;
          gap: 20px;
        }

        .lb-metric {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .lb-val {
          font-size: 0.95rem;
          font-weight: 800;
          color: #111827;
        }

        .lb-lbl {
          font-size: 0.7rem;
          color: #9ca3af;
        }

        .lb-bar-col {
          width: 180px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .shelter-card {
          background: white;
          border-radius: 14px;
          padding: 20px 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          border: 1.5px solid #f3f4f6;
        }

        .shelter-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .shelter-name {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
        }

        .shelter-type {
          font-size: 0.78rem;
          color: #9ca3af;
          margin-top: 2px;
        }

        .shelter-badge {
          font-size: 1.5rem;
        }

        .shelter-stats {
          display: flex;
          gap: 24px;
        }

        .sh-val {
          font-size: 1.4rem;
          font-weight: 800;
          color: #2d6a4f;
        }

        .sh-lbl {
          font-size: 0.72rem;
          color: #9ca3af;
          font-weight: 500;
        }

        .impact-cta {
          background: linear-gradient(135deg, #1b4332, #40916c);
          color: white;
          border-radius: 20px;
          padding: 48px 40px;
          text-align: center;
          margin-top: 16px;
        }

        .impact-cta h2 {
          font-size: 1.8rem;
          font-weight: 900;
          margin-bottom: 10px;
        }

        .impact-cta p {
          font-size: 1rem;
          opacity: 0.85;
          margin-bottom: 28px;
        }

        .impact-cta-actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .impact-cta .btn-primary {
          background: #74c69d;
          color: #1b4332;
          font-weight: 700;
        }

        .impact-cta .btn-secondary {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.35);
          color: white;
        }

        .impact-cta .btn-secondary:hover {
          background: rgba(255,255,255,0.2);
        }

        @media (max-width: 768px) {
          .narrative-grid { grid-template-columns: 1fr; }
          .grid-2 { grid-template-columns: 1fr; }
          .leaderboard-row {
            grid-template-columns: 40px 1fr;
            gap: 10px;
          }
          .lb-metrics { display: none; }
          .lb-bar-col { display: none; }
          .headline-banner { flex-direction: column; }
          .impact-cta { padding: 32px 24px; }
          .impact-cta h2 { font-size: 1.4rem; }
        }
      `}</style>
    </>
  );
}
