import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

const FOOD_TYPES = ["Cooked Meals", "Fresh Produce", "Bakery", "Dairy & Eggs", "Beverages", "Snacks & Packaged", "Desserts", "Grains & Cereals", "Prepared Salads", "Other"];
const UNITS = ["portions", "kg", "items"];

const RESTAURANTS = [
  { id: "r1", name: "The Green Table" },
  { id: "r2", name: "Harvest Bistro" },
  { id: "r3", name: "Urban Bakehouse" },
  { id: "r4", name: "Farm & Fork" },
];

function formatTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = d - now;
  if (diff < 0) return "Expired";
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${mins}m left`;
  return `${mins}m left`;
}

function timeUrgency(iso) {
  const diff = new Date(iso) - new Date();
  if (diff < 0) return "expired";
  if (diff < 2 * 3600000) return "urgent";
  if (diff < 5 * 3600000) return "soon";
  return "ok";
}

function FoodListingCard({ listing, onStatusChange }) {
  const urgency = timeUrgency(listing.pickupBy);

  return (
    <div className={`listing-card ${urgency}`}>
      <div className="listing-header">
        <div>
          <div className="listing-type">{listing.foodType}</div>
          <div className="listing-qty">{listing.quantity} {listing.unit}</div>
        </div>
        <span className={`badge badge-${listing.status === "available" ? "available" : "claimed"}`}>
          {listing.status === "available" ? "✓ Available" : "✓ Claimed"}
        </span>
      </div>

      <p className="listing-desc">{listing.description}</p>

      <div className="listing-meta">
        <div className="meta-row">
          <span className="meta-icon">📍</span>
          <span>{listing.location}</span>
        </div>
        <div className="meta-row">
          <span className="meta-icon">⏰</span>
          <span className={`pickup-time ${urgency}`}>
            Pickup by {new Date(listing.pickupBy).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {formatTime(listing.pickupBy)}
          </span>
        </div>
      </div>

      <div className="listing-impact">
        <div className="impact-chip">
          <span>🌿</span>
          <span>{listing.carbonSaved} kg CO₂</span>
        </div>
        <div className="impact-chip">
          <span>💧</span>
          <span>{listing.waterSaved.toLocaleString()}L</span>
        </div>
        <div className="impact-chip">
          <span>⚖️</span>
          <span>{listing.kgRescued} kg food</span>
        </div>
      </div>

      <style jsx>{`
        .listing-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          border-left: 4px solid #52b788;
          transition: transform 0.2s;
        }

        .listing-card:hover { transform: translateY(-2px); }
        .listing-card.urgent { border-left-color: #ef4444; }
        .listing-card.soon { border-left-color: #f59e0b; }
        .listing-card.expired { border-left-color: #9ca3af; opacity: 0.7; }

        .listing-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .listing-type {
          font-size: 0.78rem;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .listing-qty {
          font-size: 1.2rem;
          font-weight: 800;
          color: #111827;
        }

        .listing-desc {
          font-size: 0.875rem;
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .listing-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 12px;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: #6b7280;
        }

        .meta-icon { font-size: 0.9rem; }

        .pickup-time.urgent { color: #dc2626; font-weight: 600; }
        .pickup-time.soon { color: #d97706; font-weight: 600; }

        .listing-impact {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .impact-chip {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #f0faf3;
          color: #2d6a4f;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}

export default function RestaurantPortal() {
  const [listings, setListings] = useState([]);
  const [restaurants, setRestaurants] = useState(RESTAURANTS);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listings");
  const [filterRestaurant, setFilterRestaurant] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  const [form, setForm] = useState({
    restaurantId: "r1",
    foodType: "Cooked Meals",
    quantity: "",
    unit: "portions",
    description: "",
    pickupBy: "",
    location: "",
    category: "",
  });

  useEffect(() => {
    fetch("/api/food")
      .then((r) => r.json())
      .then((d) => { setListings(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));

    fetch("/api/restaurants")
      .then((r) => r.json())
      .then((d) => setRestaurants(d.data || RESTAURANTS))
      .catch(() => {});
  }, []);

  const filteredListings = listings.filter((l) => {
    if (filterRestaurant !== "all" && l.restaurantId !== filterRestaurant) return false;
    if (filterStatus !== "all" && l.status !== filterStatus) return false;
    return true;
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMsg(null);

    const restaurant = restaurants.find((r) => r.id === form.restaurantId);
    const payload = { ...form, restaurantName: restaurant?.name || "" };

    try {
      const res = await fetch("/api/food", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        setListings((prev) => [data.data, ...prev]);
        setSubmitMsg({ type: "success", text: `✓ Food listed successfully! Saved ${data.data.carbonSaved} kg CO₂ and ${data.data.waterSaved.toLocaleString()}L water.` });
        setForm({ restaurantId: "r1", foodType: "Cooked Meals", quantity: "", unit: "portions", description: "", pickupBy: "", location: "", category: "" });
        setActiveTab("listings");
      } else {
        setSubmitMsg({ type: "error", text: data.error || "Failed to list food." });
      }
    } catch {
      setSubmitMsg({ type: "error", text: "Network error. Please try again." });
    }
    setSubmitting(false);
  }

  const statsForRestaurant = (id) => {
    const mine = listings.filter((l) => l.restaurantId === id);
    return {
      total: mine.length,
      available: mine.filter((l) => l.status === "available").length,
      claimed: mine.filter((l) => l.status === "claimed").length,
      carbon: mine.reduce((a, l) => a + l.carbonSaved, 0).toFixed(1),
      water: mine.reduce((a, l) => a + l.waterSaved, 0),
    };
  };

  const selectedRestaurantStats = statsForRestaurant(filterRestaurant === "all" ? "r1" : filterRestaurant);

  return (
    <>
      <Head>
        <title>Restaurant Portal – GreenBridge</title>
      </Head>

      <div className="page-header">
        <div className="container">
          <h1>🍽️ Restaurant Portal</h1>
          <p>List your surplus food and connect with shelters and food banks in your area.</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {/* Overview Stats */}
          <div className="overview-stats">
            {restaurants.slice(0, 4).map((r) => {
              const s = statsForRestaurant(r.id);
              return (
                <div key={r.id} className="overview-card">
                  <div className="rest-name">{r.name}</div>
                  <div className="rest-type">{r.type}</div>
                  <div className="rest-stats-row">
                    <div>
                      <div className="rest-stat-val">{s.total}</div>
                      <div className="rest-stat-lbl">Listed</div>
                    </div>
                    <div>
                      <div className="rest-stat-val" style={{color: "#3b82f6"}}>{s.claimed}</div>
                      <div className="rest-stat-lbl">Claimed</div>
                    </div>
                    <div>
                      <div className="rest-stat-val">{s.carbon} kg</div>
                      <div className="rest-stat-lbl">CO₂ Saved</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="portal-layout">
            {/* Left: Tabs */}
            <div className="portal-main">
              <div className="tab-bar">
                <button className={`tab-btn ${activeTab === "listings" ? "active" : ""}`} onClick={() => setActiveTab("listings")}>
                  📋 All Listings
                </button>
                <button className={`tab-btn ${activeTab === "add" ? "active" : ""}`} onClick={() => setActiveTab("add")}>
                  + Add New Listing
                </button>
              </div>

              {activeTab === "listings" && (
                <div className="listings-panel">
                  <div className="filters-row">
                    <select className="form-input" style={{maxWidth: "200px"}} value={filterRestaurant} onChange={(e) => setFilterRestaurant(e.target.value)}>
                      <option value="all">All Restaurants</option>
                      {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                    <select className="form-input" style={{maxWidth: "160px"}} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                      <option value="all">All Status</option>
                      <option value="available">Available</option>
                      <option value="claimed">Claimed</option>
                    </select>
                    <span className="filter-count">{filteredListings.length} listing{filteredListings.length !== 1 ? "s" : ""}</span>
                  </div>

                  {loading ? (
                    <div className="loading-container">
                      <div className="loading-spinner" />
                      <p>Loading listings...</p>
                    </div>
                  ) : filteredListings.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>
                      <h3>No listings found</h3>
                      <p>Add a new food listing to get started.</p>
                    </div>
                  ) : (
                    <div className="listings-grid">
                      {filteredListings.map((listing) => (
                        <FoodListingCard key={listing.id} listing={listing} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "add" && (
                <div className="add-panel">
                  <div className="add-header">
                    <h2>List Surplus Food</h2>
                    <p>Fill in the details below. Nearby shelters will be notified immediately.</p>
                  </div>

                  {submitMsg && (
                    <div className={`alert alert-${submitMsg.type === "success" ? "success" : "error"}`} style={{marginBottom: "20px"}}>
                      {submitMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="food-form">
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Restaurant *</label>
                        <select className="form-input" value={form.restaurantId} onChange={(e) => setForm({ ...form, restaurantId: e.target.value })} required>
                          {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Food Type *</label>
                        <select className="form-input" value={form.foodType} onChange={(e) => setForm({ ...form, foodType: e.target.value })} required>
                          {FOOD_TYPES.map((t) => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Quantity *</label>
                        <input type="number" className="form-input" placeholder="e.g. 20" min="1" value={form.quantity}
                          onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Unit *</label>
                        <select className="form-input" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} required>
                          {UNITS.map((u) => <option key={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description *</label>
                      <textarea className="form-input" rows={3} placeholder="Describe the food, preparation method, allergens, freshness, etc."
                        value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Pickup Deadline *</label>
                        <input type="datetime-local" className="form-input" value={form.pickupBy}
                          onChange={(e) => setForm({ ...form, pickupBy: e.target.value })} required
                          min={new Date().toISOString().slice(0, 16)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Pickup Location *</label>
                        <input type="text" className="form-input" placeholder="e.g. 123 Main St, Downtown"
                          value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
                      </div>
                    </div>

                    {form.quantity && form.unit && (
                      <div className="impact-preview">
                        <div className="impact-preview-title">🌿 Estimated Impact Preview</div>
                        <div className="impact-preview-grid">
                          <div className="preview-stat">
                            <span>🌍</span>
                            <span>{(form.quantity * (form.unit === "kg" ? 2.5 : form.unit === "portions" ? 1.25 : 0.75)).toFixed(1)} kg CO₂ saved</span>
                          </div>
                          <div className="preview-stat">
                            <span>💧</span>
                            <span>{Math.round(form.quantity * (form.unit === "kg" ? 1000 : form.unit === "portions" ? 500 : 300)).toLocaleString()}L water saved</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <button type="submit" className="btn btn-primary btn-large" disabled={submitting} style={{width: "100%", marginTop: "8px"}}>
                      {submitting ? "Listing Food..." : "🍽️ List Food for Rescue"}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <aside className="portal-sidebar">
              <div className="sidebar-card">
                <h3>💡 Tips for Faster Claims</h3>
                <ul className="tips-list">
                  <li>Add clear descriptions including portion sizes</li>
                  <li>Set realistic pickup windows (4–6 hours)</li>
                  <li>Include allergen information</li>
                  <li>List hot food items first — they expire fastest</li>
                  <li>Bundle small quantities into single listings</li>
                </ul>
              </div>

              <div className="sidebar-card">
                <h3>📊 Platform Stats</h3>
                <div className="sidebar-stats">
                  <div className="sidebar-stat">
                    <div className="sidebar-stat-val">{listings.filter(l => l.status === "available").length}</div>
                    <div className="sidebar-stat-lbl">Available Now</div>
                  </div>
                  <div className="sidebar-stat">
                    <div className="sidebar-stat-val">{listings.filter(l => l.status === "claimed").length}</div>
                    <div className="sidebar-stat-lbl">Claimed Today</div>
                  </div>
                  <div className="sidebar-stat">
                    <div className="sidebar-stat-val">{listings.reduce((a,l) => a + l.carbonSaved, 0).toFixed(1)}</div>
                    <div className="sidebar-stat-lbl">kg CO₂ Saved</div>
                  </div>
                </div>
              </div>

              <div className="sidebar-card sidebar-cta">
                <div className="cta-emoji">🤖</div>
                <h3>AI Waste Prediction</h3>
                <p>See which food types are most at risk and get actionable recommendations.</p>
                <Link href="/predictions" className="btn btn-primary" style={{width: "100%", justifyContent: "center"}}>
                  View Predictions
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <style jsx>{`
        .overview-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .overview-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          border-top: 3px solid #52b788;
        }

        .rest-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: #111827;
          margin-bottom: 2px;
        }

        .rest-type {
          font-size: 0.78rem;
          color: #6b7280;
          margin-bottom: 14px;
        }

        .rest-stats-row {
          display: flex;
          justify-content: space-between;
        }

        .rest-stat-val {
          font-size: 1.2rem;
          font-weight: 800;
          color: #2d6a4f;
        }

        .rest-stat-lbl {
          font-size: 0.72rem;
          color: #9ca3af;
          font-weight: 500;
        }

        .portal-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 24px;
          align-items: start;
        }

        .portal-main {
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        .tab-bar {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .tab-btn {
          padding: 16px 24px;
          font-size: 0.9rem;
          font-weight: 600;
          border: none;
          background: none;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }

        .tab-btn:hover { color: #2d6a4f; }
        .tab-btn.active { color: #2d6a4f; border-bottom-color: #2d6a4f; background: white; }

        .listings-panel, .add-panel {
          padding: 24px;
        }

        .filters-row {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .filter-count {
          font-size: 0.85rem;
          color: #6b7280;
          font-weight: 500;
        }

        .listings-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .add-header {
          margin-bottom: 24px;
        }

        .add-header h2 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 4px;
        }

        .add-header p {
          font-size: 0.9rem;
          color: #6b7280;
        }

        .food-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .impact-preview {
          background: #f0faf3;
          border: 1px solid #b7e4c7;
          border-radius: 10px;
          padding: 14px 18px;
        }

        .impact-preview-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #2d6a4f;
          margin-bottom: 10px;
        }

        .impact-preview-grid {
          display: flex;
          gap: 20px;
        }

        .preview-stat {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.88rem;
          color: #40916c;
          font-weight: 600;
        }

        .portal-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sidebar-card {
          background: white;
          border-radius: 14px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .sidebar-card h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 14px;
        }

        .tips-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .tips-list li {
          font-size: 0.83rem;
          color: #4b5563;
          line-height: 1.5;
          padding-left: 12px;
          position: relative;
        }

        .tips-list li::before {
          content: "→";
          position: absolute;
          left: 0;
          color: #52b788;
          font-size: 0.8rem;
        }

        .sidebar-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          text-align: center;
        }

        .sidebar-stat-val {
          font-size: 1.2rem;
          font-weight: 800;
          color: #2d6a4f;
        }

        .sidebar-stat-lbl {
          font-size: 0.7rem;
          color: #9ca3af;
          font-weight: 500;
        }

        .sidebar-cta {
          background: linear-gradient(135deg, #f0faf3, #d8f3dc);
          border: 1.5px solid #b7e4c7;
          text-align: center;
        }

        .cta-emoji { font-size: 2rem; margin-bottom: 8px; }

        .sidebar-cta h3 { font-size: 1rem; }

        .sidebar-cta p {
          font-size: 0.83rem;
          color: #4b5563;
          margin-bottom: 14px;
        }

        @media (max-width: 1024px) {
          .overview-stats { grid-template-columns: repeat(2, 1fr); }
          .portal-layout { grid-template-columns: 1fr; }
          .listings-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .overview-stats { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </>
  );
}
