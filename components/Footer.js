import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="brand">
                <span>🌿</span>
                <span className="brand-name">GreenBridge</span>
              </div>
              <p className="footer-tagline">
                AI-Powered Food Rescue & Waste Reduction Platform. Connecting surplus food to communities in need.
              </p>
              <div className="footer-stats">
                <div className="stat-pill">🥗 Meals Rescued Daily</div>
                <div className="stat-pill">🌍 CO₂ Prevented</div>
                <div className="stat-pill">💧 Water Saved</div>
              </div>
            </div>

            <div className="footer-links-group">
              <h4>Platform</h4>
              <Link href="/restaurant">Restaurant Portal</Link>
              <Link href="/shelter">Shelter Portal</Link>
              <Link href="/predictions">AI Predictions</Link>
              <Link href="/impact">Impact Dashboard</Link>
            </div>

            <div className="footer-links-group">
              <h4>How It Works</h4>
              <span>Restaurants list surplus food</span>
              <span>Shelters discover & claim</span>
              <span>AI predicts waste patterns</span>
              <span>Track environmental impact</span>
            </div>

            <div className="footer-links-group">
              <h4>Technology</h4>
              <span>Powered by Gemini AI</span>
              <span>Next.js Backend</span>
              <span>Real-time Matching</span>
              <span>Carbon Tracking</span>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 GreenBridge. Built to reduce food waste and fight hunger.</p>
            <p className="powered-by">Powered by <strong>Gemini AI</strong> · Built with <span>♥</span></p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .footer {
          background: #1b4332;
          color: #b7e4c7;
          padding: 60px 0 30px;
          margin-top: 80px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 48px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 1.3rem;
        }

        .brand-name {
          font-weight: 800;
          color: white;
          font-size: 1.3rem;
        }

        .footer-tagline {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #95d5b2;
          margin-bottom: 16px;
          max-width: 280px;
        }

        .footer-stats {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .stat-pill {
          display: inline-block;
          background: rgba(255,255,255,0.08);
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          color: #b7e4c7;
          width: fit-content;
        }

        .footer-links-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-links-group h4 {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #74c69d;
          margin-bottom: 4px;
        }

        .footer-links-group a, .footer-links-group span {
          font-size: 0.9rem;
          color: #95d5b2;
          transition: color 0.2s;
          cursor: default;
        }

        .footer-links-group a:hover {
          color: white;
          cursor: pointer;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: #74c69d;
        }

        .powered-by span {
          color: #ef4444;
        }

        .powered-by strong {
          color: #95d5b2;
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }

          .footer-brand {
            grid-column: 1 / -1;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
