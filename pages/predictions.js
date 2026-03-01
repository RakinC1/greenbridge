import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

function RiskBadge({ level }) {
  const colors = { High: "badge-high", Medium: "badge-medium", Low: "badge-low" };
  const icons = { High: "🔴", Medium: "🟡", Low: "🟢" };
  return (
    <span className={`badge ${colors[level] || "badge-low"}`}>
      {icons[level] || "🟢"} {level}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const colors = { High: "#fee2e2", Medium: "#fef3c7", Low: "#f0faf3" };
  const textColors = { High: "#dc2626", Medium: "#d97706", Low: "#2d6a4f" };
  return (
    <span style={{
      background: colors[priority] || "#f0faf3",
      color: textColors[priority] || "#2d6a4f",
      fontSize: "0.72rem",
      fontWeight: 700,
      padding: "2px 8px",
      borderRadius: "12px",
    }}>
      {priority}
    </span>
  );
}

function BarChart({ data }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.predictedWasteKg));
  return (
    <div className="bar-chart">
      {data.map((item, i) => (
        <div key={i} className="bar-row">
          <div className="bar-label">{item.category}</div>
          <div className="bar-track">
            <div
              className={`bar-fill risk-${item.riskLevel?.toLowerCase()}`}
              style={{ width: `${(item.predictedWasteKg / max) * 100}%` }}
            />
          </div>
          <div className="bar-value">{item.predictedWasteKg} kg</div>
          <RiskBadge level={item.riskLevel} />
        </div>
      ))}
      <style jsx>{`
        .bar-chart { display: flex; flex-direction: column; gap: 12px; }
        .bar-row { display: flex; align-items: center; gap: 12px; }
        .bar-label { width: 140px; font-size: 0.85rem; font-weight: 600; color: #374151; flex-shrink: 0; }
        .bar-track { flex: 1; background: #f3f4f6; border-radius: 6px; height: 12px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 6px; transition: width 1s ease; }
        .bar-fill.risk-high { background: linear-gradient(90deg, #ef4444, #f97316); }
        .bar-fill.risk-medium { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
        .bar-fill.risk-low { background: linear-gradient(90deg, #10b981, #34d399); }
        .bar-value { width: 55px; font-size: 0.8rem; font-weight: 700; color: #374151; text-align: right; flex-shrink: 0; }
      `}</style>
    </div>
  );
}

export default function Predictions() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [platformData, setPlatformData] = useState(null);
  const [error, setError] = useState(null);
  const [fallback, setFallback] = useState(false);

  async function runPrediction() {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/predict");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setPlatformData(json.platformData);
        setFallback(json.fallback || false);
      } else {
        setError(json.error || "Failed to generate prediction.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>AI Waste Predictions – GreenBridge</title>
      </Head>

      <div className="page-header">
        <div className="container">
          <div className="header-badge">
            <span className="ai-dot" />
            Powered by Gemini AI
          </div>
          <h1>🤖 AI Waste Predictions</h1>
          <p>Gemini AI analyzes your platform data to predict food waste before it happens, identify at-risk categories, and recommend proactive rescue actions.</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {!data && !loading && (
            <div className="launch-section">
              <div className="launch-card">
                <div className="launch-icon">🤖</div>
                <h2>Ready to Run AI Analysis</h2>
                <p>
                  Click the button below to let Gemini AI analyze current platform data —
                  food types, claim rates, restaurant patterns, and more — to predict where
                  waste is most likely to occur and what you can do about it.
                </p>

                <div className="what-ai-does">
                  <div className="ai-feature">
                    <span className="ai-feat-icon">📊</span>
                    <div>
                      <strong>Waste Risk Assessment</strong>
                      <span>Identifies food categories most likely to go to waste</span>
                    </div>
                  </div>
                  <div className="ai-feature">
                    <span className="ai-feat-icon">🏪</span>
                    <div>
                      <strong>Restaurant Risk Profiling</strong>
                      <span>Pinpoints which restaurants need immediate attention</span>
                    </div>
                  </div>
                  <div className="ai-feature">
                    <span className="ai-feat-icon">📅</span>
                    <div>
                      <strong>Weekly Forecast</strong>
                      <span>Predicts upcoming surplus volumes and rescue rates</span>
                    </div>
                  </div>
                  <div className="ai-feature">
                    <span className="ai-feat-icon">⚡</span>
                    <div>
                      <strong>Urgent Action Items</strong>
                      <span>Prioritized recommendations to rescue food right now</span>
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary btn-large run-btn" onClick={runPrediction} disabled={loading}>
                  🤖 Run Gemini AI Analysis
                </button>

                <p className="api-note">
                  💡 Requires <code>GEMINI_API_KEY</code> environment variable. Without it, a sample prediction is shown.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="loading-container">
              <div className="ai-loading">
                <div className="ai-loading-icon">🤖</div>
                <div className="loading-spinner" />
                <h3>Gemini AI is analyzing platform data...</h3>
                <p>Evaluating food categories, restaurant patterns, claim rates, and historical trends.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="error-section">
              <div className="alert alert-error" style={{maxWidth: "500px", margin: "0 auto 20px"}}>
                ⚠️ {error}
              </div>
              <button className="btn btn-primary" onClick={runPrediction}>Try Again</button>
            </div>
          )}

          {data && (
            <div className="results-section">
              {fallback && (
                <div className="alert alert-warning" style={{marginBottom: "24px"}}>
                  ℹ️ Showing sample AI predictions. Add your <code>GEMINI_API_KEY</code> to get live analysis.
                </div>
              )}

              <div className="results-header">
                <div>
                  <h2>Analysis Complete</h2>
                  <p className="text-muted">Generated {new Date().toLocaleString()}</p>
                </div>
                <button className="btn btn-secondary" onClick={runPrediction} disabled={loading}>
                  🔄 Refresh Analysis
                </button>
              </div>

              {/* Weekly Forecast */}
              {data.weeklyForecast && (
                <div className="forecast-banner">
                  <h3>📅 Weekly Forecast</h3>
                  <div className="forecast-grid">
                    <div className="forecast-stat">
                      <div className="forecast-val">{data.weeklyForecast.expectedSurplusKg} kg</div>
                      <div className="forecast-lbl">Expected Surplus</div>
                    </div>
                    <div className="forecast-stat">
                      <div className="forecast-val">{data.weeklyForecast.expectedRescueRate}%</div>
                      <div className="forecast-lbl">Expected Rescue Rate</div>
                    </div>
                    <div className="forecast-stat red">
                      <div className="forecast-val">{data.weeklyForecast.carbonAtRisk} kg</div>
                      <div className="forecast-lbl">CO₂ at Risk</div>
                    </div>
                    <div className="forecast-stat red">
                      <div className="forecast-val">{data.weeklyForecast.waterAtRisk?.toLocaleString()}L</div>
                      <div className="forecast-lbl">Water at Risk</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="results-grid">
                {/* Waste Predictions */}
                {data.wastePredictions && data.wastePredictions.length > 0 && (
                  <div className="result-card full-width">
                    <div className="result-card-header">
                      <h3>📊 Predicted Waste by Category</h3>
                      <span className="result-count">{data.wastePredictions.length} categories analyzed</span>
                    </div>
                    <BarChart data={data.wastePredictions} />
                    <div className="waste-cards">
                      {data.wastePredictions.map((pred, i) => (
                        <div key={i} className={`waste-card risk-${pred.riskLevel?.toLowerCase()}`}>
                          <div className="waste-card-header">
                            <strong>{pred.category}</strong>
                            <RiskBadge level={pred.riskLevel} />
                          </div>
                          <p className="waste-reason">{pred.reason}</p>
                          <div className="waste-recommendation">
                            <span className="rec-label">Recommendation:</span>
                            <span>{pred.recommendation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Restaurant Risk */}
                {data.topRiskRestaurants && data.topRiskRestaurants.length > 0 && (
                  <div className="result-card">
                    <div className="result-card-header">
                      <h3>🏪 Restaurant Risk Assessment</h3>
                    </div>
                    <div className="restaurant-risks">
                      {data.topRiskRestaurants.map((r, i) => (
                        <div key={i} className="rest-risk-item">
                          <div className="rest-risk-header">
                            <strong>{r.name}</strong>
                            <RiskBadge level={r.riskLevel} />
                          </div>
                          <div className="rest-risk-detail">
                            <div className="risk-issue">⚠️ {r.issue}</div>
                            <div className="risk-suggestion">💡 {r.suggestion}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Urgent Actions */}
                {data.urgentActions && data.urgentActions.length > 0 && (
                  <div className="result-card">
                    <div className="result-card-header">
                      <h3>⚡ Urgent Actions Required</h3>
                    </div>
                    <div className="actions-list">
                      {data.urgentActions.map((action, i) => (
                        <div key={i} className="action-item">
                          <div className="action-header">
                            <PriorityBadge priority={action.priority} />
                          </div>
                          <div className="action-text">{action.action}</div>
                          <div className="action-impact">
                            <span className="impact-label">Impact:</span>
                            <span>{action.impact}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Insights */}
                {data.insights && data.insights.length > 0 && (
                  <div className="result-card">
                    <div className="result-card-header">
                      <h3>💡 Key Insights</h3>
                    </div>
                    <ul className="insights-list">
                      {data.insights.map((insight, i) => (
                        <li key={i} className="insight-item">
                          <span className="insight-dot" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Positive Highlights */}
                {data.positiveHighlights && data.positiveHighlights.length > 0 && (
                  <div className="result-card highlights-card">
                    <div className="result-card-header">
                      <h3>🌟 Positive Highlights</h3>
                    </div>
                    <ul className="highlights-list">
                      {data.positiveHighlights.map((h, i) => (
                        <li key={i} className="highlight-item">
                          <span>✓</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="cta-row">
                <Link href="/shelter" className="btn btn-primary btn-large">
                  🏠 Claim Available Food Now
                </Link>
                <Link href="/restaurant" className="btn btn-secondary btn-large">
                  🍽️ List More Food
                </Link>
                <Link href="/impact" className="btn btn-secondary btn-large">
                  📊 View Full Impact
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .ai-dot {
          width: 7px; height: 7px;
          background: #74c69d;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }

        .launch-section {
          display: flex;
          justify-content: center;
          padding: 20px 0;
        }

        .launch-card {
          background: white;
          border-radius: 24px;
          padding: 48px 40px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          max-width: 680px;
          width: 100%;
          text-align: center;
        }

        .launch-icon {
          font-size: 3.5rem;
          margin-bottom: 16px;
        }

        .launch-card h2 {
          font-size: 1.6rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 12px;
        }

        .launch-card > p {
          font-size: 1rem;
          color: #6b7280;
          line-height: 1.7;
          margin-bottom: 32px;
        }

        .what-ai-does {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 32px;
          text-align: left;
        }

        .ai-feature {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 14px;
          background: #f9fafb;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
        }

        .ai-feat-icon { font-size: 1.5rem; flex-shrink: 0; }

        .ai-feature div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .ai-feature strong {
          font-size: 0.88rem;
          color: #111827;
        }

        .ai-feature span {
          font-size: 0.78rem;
          color: #6b7280;
          line-height: 1.4;
        }

        .run-btn {
          width: 100%;
          justify-content: center;
          background: linear-gradient(135deg, #2d6a4f, #40916c);
          font-size: 1.1rem;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 12px;
        }

        .api-note {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .api-note code {
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          color: #374151;
        }

        .ai-loading {
          text-align: center;
          padding: 60px 20px;
        }

        .ai-loading-icon {
          font-size: 3rem;
          margin-bottom: 20px;
          animation: bounce 1s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .ai-loading h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #111827;
          margin-top: 16px;
          margin-bottom: 8px;
        }

        .ai-loading p {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .error-section {
          text-align: center;
          padding: 40px;
        }

        .results-section {
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .results-header h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #111827;
        }

        .forecast-banner {
          background: linear-gradient(135deg, #1b4332, #2d6a4f);
          color: white;
          border-radius: 16px;
          padding: 28px 32px;
          margin-bottom: 28px;
        }

        .forecast-banner h3 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 20px;
          opacity: 0.9;
        }

        .forecast-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .forecast-stat {
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }

        .forecast-stat.red {
          background: rgba(239, 68, 68, 0.2);
        }

        .forecast-val {
          font-size: 1.6rem;
          font-weight: 800;
          line-height: 1.2;
        }

        .forecast-lbl {
          font-size: 0.78rem;
          opacity: 0.75;
          margin-top: 4px;
        }

        .results-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 32px;
        }

        .result-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }

        .result-card.full-width {
          grid-column: 1 / -1;
        }

        .result-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .result-card-header h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
        }

        .result-count {
          font-size: 0.78rem;
          color: #9ca3af;
          background: #f3f4f6;
          padding: 3px 10px;
          border-radius: 20px;
        }

        .waste-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #f3f4f6;
        }

        .waste-card {
          border-radius: 10px;
          padding: 14px;
          border: 1.5px solid #e5e7eb;
        }

        .waste-card.risk-high { border-color: #fca5a5; background: #fff5f5; }
        .waste-card.risk-medium { border-color: #fcd34d; background: #fffbeb; }
        .waste-card.risk-low { border-color: #b7e4c7; background: #f0faf3; }

        .waste-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          gap: 8px;
        }

        .waste-card-header strong {
          font-size: 0.85rem;
          color: #111827;
        }

        .waste-reason {
          font-size: 0.78rem;
          color: #4b5563;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .waste-recommendation {
          font-size: 0.75rem;
          color: #2d6a4f;
          background: rgba(45, 106, 79, 0.08);
          padding: 6px 8px;
          border-radius: 6px;
          line-height: 1.4;
        }

        .rec-label {
          font-weight: 700;
          margin-right: 4px;
        }

        .restaurant-risks {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .rest-risk-item {
          padding: 14px;
          border-radius: 10px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
        }

        .rest-risk-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .rest-risk-header strong {
          font-size: 0.9rem;
          color: #111827;
        }

        .rest-risk-detail {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .risk-issue, .risk-suggestion {
          font-size: 0.82rem;
          line-height: 1.5;
        }

        .risk-issue { color: #b91c1c; }
        .risk-suggestion { color: #2d6a4f; }

        .actions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .action-item {
          padding: 14px;
          background: #f9fafb;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
        }

        .action-header {
          margin-bottom: 8px;
        }

        .action-text {
          font-size: 0.88rem;
          color: #111827;
          font-weight: 500;
          line-height: 1.5;
          margin-bottom: 6px;
        }

        .action-impact {
          font-size: 0.78rem;
          color: #2d6a4f;
        }

        .impact-label {
          font-weight: 700;
          margin-right: 4px;
        }

        .insights-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .insight-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.875rem;
          color: #374151;
          line-height: 1.6;
        }

        .insight-dot {
          width: 8px; height: 8px;
          background: #52b788;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 6px;
        }

        .highlights-card {
          background: linear-gradient(135deg, #f0faf3, #d8f3dc);
          border: 1.5px solid #b7e4c7;
        }

        .highlights-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .highlight-item {
          display: flex;
          gap: 10px;
          font-size: 0.875rem;
          color: #1b4332;
          line-height: 1.6;
        }

        .highlight-item span:first-child {
          color: #52b788;
          font-weight: 800;
          flex-shrink: 0;
        }

        .cta-row {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
          padding-top: 12px;
        }

        @media (max-width: 768px) {
          .results-grid { grid-template-columns: 1fr; }
          .forecast-grid { grid-template-columns: repeat(2, 1fr); }
          .waste-cards { grid-template-columns: 1fr; }
          .what-ai-does { grid-template-columns: 1fr; }
          .launch-card { padding: 32px 24px; }
        }
      `}</style>
    </>
  );
}
