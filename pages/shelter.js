import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

const SHELTERS = [
  { id: "s1", name: "City Hope Shelter", type: "Homeless Shelter", location: "Downtown" },
  { id: "s2", name: "Family First Food Bank", type: "Food Bank", location: "Northside" },
  { id: "s3", name: "Community Kitchen", type: "Community Center", location: "Southside" },
  { id: "s4", name: "Sunrise Youth Center", type: "Youth Shelter", location: "Eastside" },
];

const FOOD_CATEGORIES = ["All", "Cooked Meals", "Fresh Produce", "Bakery", "Dairy & Eggs", "Desserts", "Beverages", "Other"];

function timeUrgency(iso) {
  const diff = new Date(iso) - new Date();
  if (diff < 0) return "expired";
  if (diff < 2 * 3600000) return "urgent";
  if (diff < 5 * 3600000) return "soon";
  return "ok";
}

function formatPickupTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = d - now;
  if (diff < 0) return "Expired";
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${mins}m remaining`;
  return `${mins} minutes remaining`;
}

function FoodCard({ item, onClaim, claiming, shelterId }) {
  const urgency = timeUrgency(item.pickupBy);
  const isClaiming = claiming === item.id;

  return (
    <div className={`food-card ${urgency} ${item.status === "claimed" ? "claimed" : ""}`}>
      {urgency === "urgent" && item.status === "available" && (
        <div className="urgency-ribbon">⚡ Urgent – Claim Now!</div>
      )}

      <div className="food-card-header">
        <div className="food-type-badge">{item.foodType}</div>
        <span className={`badge badge-${item.status === "available" ? "available" : "claimed"}`}>
          {item.status === "available" ? "Available" : "Claimed"}
        </span>
      </div>

      <div className="food-quantity">{item.quantity} {item.unit}</div>
      <div className="food-restaurant">from {item.restaurantName}</div>

      <p className="food-description">{item.description}</p>

      <div className="food-details">
        <div className="detail-row">
          <span className="detail-icon">📍</span>
          <span>{item.location}</span>
        </div>
        <div className="detail-row">
          <span className="detail-icon">⏰</span>
          <span className={`time-text ${urgency}`}>
            {formatPickupTime(item.pickupBy)}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-icon">📅</span>
          <span>By {new Date(item.pickupBy).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>

      <div className="food-impact">
        <div className="impact-row">
          <span className="impact-icon">🌿</span>
          <span>Saves {item.carbonSaved} kg CO₂</span>
        </div>
        <div className="impact-row">
          <span className="impact-icon">💧</span>
          <span>Saves {item.waterSaved.toLocaleString()}L water</span>
        </div>
      </div>

      {item.status === "available" ? (
        <button
          className={`btn btn-primary claim-btn ${isClaiming ? "claiming" : ""}`}
          onClick={() => onClaim(item.id)}
          disabled={isClaiming || !shelterId}
          title={!shelterId ? "Please select your shelter first" : ""}
        >
          {isClaiming ? "Claiming..." : "🤝 Claim This Food"}
        </button>
      ) : (
        <div className="claimed-message">
          ✓ Claimed by {SHELTERS.find(s => s.id === item.claimedBy)?.name || "a shelter"}
        </div>
      )}

      <style jsx>{`
        .food-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 3px 12px rgba(0,0,0,0.07);
          border: 1.5px solid #f3f4f6;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }

        .food-card:hover:not(.claimed) {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.11);
          border-color: #74c69d;
        }

        .food-card.urgent { border-color: #fca5a5; }
        .food-card.soon { border-color: #fcd34d; }
        .food-card.claimed { opacity: 0.65; }

        .urgency-ribbon {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(90deg, #ef4444, #f97316);
          color: white;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 16px;
          text-align: center;
          letter-spacing: 0.04em;
        }

        .food-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          margin-top: ${urgency === "urgent" ? "20px" : "0"};
        }

        .food-type-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: #40916c;
          background: #d8f3dc;
          padding: 3px 10px;
          border-radius: 20px;
          letter-spacing: 0.02em;
        }

        .food-quantity {
          font-size: 1.6rem;
          font-weight: 900;
          color: #111827;
          line-height: 1.2;
        }

        .food-restaurant {
          font-size: 0.82rem;
          color: #6b7280;
          margin-bottom: 10px;
          font-style: italic;
        }

        .food-description {
          font-size: 0.875rem;
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 14px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .food-details {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f3f4f6;
        }

        .detail-row {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.82rem;
          color: #4b5563;
        }

        .detail-icon { font-size: 0.9rem; flex-shrink: 0; }

        .time-text.urgent { color: #dc2626; font-weight: 700; }
        .time-text.soon { color: #d97706; font-weight: 600; }

        .food-impact {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 14px;
        }

        .impact-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #2d6a4f;
          font-weight: 500;
        }

        .impact-icon { font-size: 0.85rem; }

        .claim-btn {
          width: 100%;
          justify-content: center;
        }

        .claim-btn.claiming {
          opacity: 0.8;
        }

        .claimed-message {
          text-align: center;
          font-size: 0.875rem;
          font-weight: 600;
          color: #2d6a4f;
          background: #d8f3dc;
          padding: 10px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

export default function ShelterPortal() {
  const [food, setFood] = useState([]);
  const [shelters, setShelters] = useState(SHELTERS);
  const [loading, setLoading] = useState(true);
  const [selectedShelter, setSelectedShelter] = useState("s1");
  const [claiming, setClaiming] = useState(null);
  const [claimMsg, setClaimMsg] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("available");
  const [sortBy, setSortBy] = useState("urgent");

  useEffect(() => {
    fetch("/api/food")
      .then((r) => r.json())
      .then((d) => { setFood(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));

    fetch("/api/shelters")
      .then((r) => r.json())
      .then((d) => { if (d.data) setShelters(d.data); })
      .catch(() => {});
  }, []);

  async function handleClaim(foodId) {
    if (!selectedShelter) return;
    setClaiming(foodId);
    setClaimMsg(null);

    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodId, shelterId: selectedShelter }),
      });
      const data = await res.json();
      if (data.success) {
        setFood((prev) => prev.map((f) => f.id === foodId ? { ...f, status: "claimed", claimedBy: selectedShelter } : f));
        const shelter = shelters.find(s => s.id === selectedShelter);
        setClaimMsg({ type: "success", text: `✓ Food claimed successfully by ${shelter?.name}! They will coordinate pickup.` });
      } else {
        setClaimMsg({ type: "error", text: data.error || "Failed to claim food." });
      }
    } catch {
      setClaimMsg({ type: "error", text: "Network error. Please try again." });
    }
    setClaiming(null);
    setTimeout(() => setClaimMsg(null), 5000);
  }

  const getFilteredSorted = () => {
    let items = [...food];
    if (filterStatus !== "all") items = items.filter(f => f.status === filterStatus);
    if (filterCategory !== "All") items = items.filter(f => f.foodType === filterCategory || f.category === filterCategory);
    if (sortBy === "urgent") {
      items.sort((a, b) => {
        const ua = timeUrgency(a.pickupBy);
        const ub = timeUrgency(b.pickupBy);
        const order = { urgent: 0, soon: 1, ok: 2, expired: 3 };
        return (order[ua] || 2) - (order[ub] || 2);
      });
    } else if (sortBy === "quantity") {
      items.sort((a, b) => b.quantity - a.quantity);
    } else if (sortBy === "carbon") {
      items.sort((a, b) => b.carbonSaved - a.carbonSaved);
    }
    return items;
  };

  const filteredFood = getFilteredSorted();
  const availableCount = food.filter(f => f.status === "available").length;
  const claimedCount = food.filter(f => f.status === "claimed").length;
  const urgentCount = food.filter(f => f.status === "available" && timeUrgency(f.pickupBy) === "urgent").length;
  const currentShelter = shelters.find(s => s.id === selectedShelter);

  return (
    <>
      <Head>
        <title>Shelter Portal – GreenBridge</title>
      </Head>

      <div className="page-header">
        <div className="container">
          <h1>🏠 Shelter & Food Bank Portal</h1>
          <p>Browse and claim available surplus food from restaurants in your area.</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {claimMsg && (
            <div className={`alert alert-${claimMsg.type === "success" ? "success" : "error"}`} style={{marginBottom: "20px", maxWidth: "600px"}}>
              {claimMsg.text}
            </div>
          )}

          {/* Top Controls */}
          <div className="top-bar">
            <div className="shelter-selector">
              <label className="form-label" style={{marginBottom: "6px", display: "block"}}>
                🏠 Your Organization
              </label>
              <select className="form-input" value={selectedShelter} onChange={(e) => setSelectedShelter(e.target.value)} style={{minWidth: "240px"}}>
                {shelters.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} — {s.type}</option>
                ))}
              </select>
              {currentShelter && (
                <div className="shelter-info">
                  📍 {currentShelter.location}
                  {currentShelter.totalClaimed > 0 && ` · ${currentShelter.totalClaimed} items claimed · ${currentShelter.peopleServed} people served`}
                </div>
              )}
            </div>

            <div className="quick-stats">
              <div className="qs-card green">
                <div className="qs-val">{availableCount}</div>
                <div className="qs-lbl">Available Now</div>
              </div>
              <div className={`qs-card ${urgentCount > 0 ? "red" : "gray"}`}>
                <div className="qs-val">{urgentCount}</div>
                <div className="qs-lbl">Urgent Claims</div>
              </div>
              <div className="qs-card blue">
                <div className="qs-val">{claimedCount}</div>
                <div className="qs-lbl">Already Claimed</div>
              </div>
            </div>
          </div>

          {urgentCount > 0 && (
            <div className="urgent-alert">
              ⚡ <strong>{urgentCount} urgent listing{urgentCount !== 1 ? "s" : ""}</strong> expiring within 2 hours! Claim now to prevent waste.
            </div>
          )}

          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="category-pills">
              {FOOD_CATEGORIES.map((cat) => (
                <button key={cat} className={`cat-pill ${filterCategory === cat ? "active" : ""}`} onClick={() => setFilterCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="filter-controls">
              <select className="form-input" style={{maxWidth: "160px"}} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="available">Available Only</option>
                <option value="claimed">Claimed</option>
              </select>
              <select className="form-input" style={{maxWidth: "160px"}} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="urgent">Sort: Urgency</option>
                <option value="quantity">Sort: Quantity</option>
                <option value="carbon">Sort: CO₂ Impact</option>
              </select>
            </div>
          </div>

          <div className="results-info">
            Showing <strong>{filteredFood.length}</strong> listing{filteredFood.length !== 1 ? "s" : ""}
            {filterCategory !== "All" && ` in ${filterCategory}`}
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p>Loading available food...</p>
            </div>
          ) : filteredFood.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No food listings found</h3>
              <p>Try adjusting your filters or check back soon — restaurants update their listings regularly.</p>
            </div>
          ) : (
            <div className="food-grid">
              {filteredFood.map((item) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  onClaim={handleClaim}
                  claiming={claiming}
                  shelterId={selectedShelter}
                />
              ))}
            </div>
          )}

          {/* Info Banner */}
          <div className="info-banner">
            <div className="info-banner-content">
              <div className="info-icon">🤖</div>
              <div>
                <h3>Want to predict future food availability?</h3>
                <p>GreenBridge's AI analyzes restaurant patterns to predict upcoming surplus — so your shelter can plan ahead.</p>
              </div>
              <Link href="/predictions" className="btn btn-primary">
                View AI Predictions
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 24px;
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        }

        .shelter-info {
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: 6px;
        }

        .quick-stats {
          display: flex;
          gap: 12px;
        }

        .qs-card {
          background: #f9fafb;
          border-radius: 12px;
          padding: 14px 18px;
          text-align: center;
          min-width: 90px;
          border: 1.5px solid #e5e7eb;
        }

        .qs-card.green { background: #f0faf3; border-color: #b7e4c7; }
        .qs-card.red { background: #fee2e2; border-color: #fca5a5; }
        .qs-card.blue { background: #eff6ff; border-color: #bfdbfe; }
        .qs-card.gray { background: #f9fafb; border-color: #e5e7eb; }

        .qs-val {
          font-size: 1.5rem;
          font-weight: 800;
          color: #111827;
          line-height: 1.2;
        }

        .qs-lbl {
          font-size: 0.72rem;
          color: #6b7280;
          font-weight: 500;
          margin-top: 2px;
        }

        .urgent-alert {
          background: #fff7ed;
          border: 1.5px solid #fed7aa;
          border-radius: 10px;
          padding: 12px 18px;
          font-size: 0.9rem;
          color: #c2410c;
          margin-bottom: 20px;
        }

        .filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .category-pills {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .cat-pill {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: 600;
          border: 1.5px solid #e5e7eb;
          background: white;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cat-pill:hover {
          border-color: #74c69d;
          color: #2d6a4f;
        }

        .cat-pill.active {
          background: #2d6a4f;
          border-color: #2d6a4f;
          color: white;
        }

        .filter-controls {
          display: flex;
          gap: 10px;
        }

        .results-info {
          font-size: 0.85rem;
          color: #6b7280;
          margin-bottom: 20px;
        }

        .food-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }

        .info-banner {
          background: linear-gradient(135deg, #f0faf3, #d8f3dc);
          border: 1.5px solid #b7e4c7;
          border-radius: 16px;
          padding: 24px 28px;
        }

        .info-banner-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .info-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .info-banner-content h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #1b4332;
          margin-bottom: 4px;
        }

        .info-banner-content p {
          font-size: 0.875rem;
          color: #40916c;
          line-height: 1.5;
        }

        .info-banner-content .btn {
          flex-shrink: 0;
          margin-left: auto;
        }

        @media (max-width: 1024px) {
          .food-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .top-bar { flex-direction: column; }
          .quick-stats { width: 100%; justify-content: space-between; }
          .food-grid { grid-template-columns: 1fr; }
          .filter-bar { flex-direction: column; align-items: flex-start; }
          .filter-controls { flex-wrap: wrap; }
          .info-banner-content { flex-direction: column; text-align: center; }
          .info-banner-content .btn { margin: 0 auto; }
        }
      `}</style>
    </>
  );
}
