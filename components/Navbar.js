import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/restaurant", label: "Restaurant Portal" },
    { href: "/shelter", label: "Shelter Portal" },
    { href: "/predictions", label: "AI Predictions" },
    { href: "/impact", label: "Impact" },
  ];

  const isActive = (href) => router.pathname === href;

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link href="/" className="navbar-brand">
            <span className="brand-icon">🌿</span>
            <span className="brand-name">GreenBridge</span>
          </Link>

          <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive(link.href) ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            <Link href="/restaurant" className="btn btn-primary btn-sm">
              + Donate Food
            </Link>
            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 8px rgba(0,0,0,0.06);
        }

        .navbar-inner {
          display: flex;
          align-items: center;
          gap: 32px;
          height: 68px;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .brand-icon {
          font-size: 1.5rem;
        }

        .brand-name {
          font-size: 1.3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #2d6a4f, #52b788);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
        }

        .nav-link {
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #4b5563;
          transition: all 0.2s;
        }

        .nav-link:hover {
          color: #2d6a4f;
          background: #f0faf3;
        }

        .nav-link.active {
          color: #2d6a4f;
          background: #d8f3dc;
          font-weight: 600;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 1.4rem;
          color: #374151;
          padding: 4px;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .navbar-links {
            display: none;
            position: absolute;
            top: 68px;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 16px;
            border-bottom: 1px solid #e5e7eb;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            gap: 4px;
          }

          .navbar-links.open {
            display: flex;
          }

          .nav-link {
            width: 100%;
          }

          .menu-toggle {
            display: block;
          }

          .navbar-actions .btn {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
