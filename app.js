"use strict";

const STORAGE_KEY = "greenbridge-state-v1";
const GEMINI_MODEL = "gemini-1.5-flash";

const IMPACT_FACTORS = {
  carbonKgPerMeal: 2.7,
  waterLitersPerMeal: 1100,
};

const state = createEmptyState();
const ui = {};

document.addEventListener("DOMContentLoaded", init);

function createEmptyState() {
  return {
    nextListingId: 1,
    recipientName: "Downtown Hope Shelter",
    apiKey: "",
    listings: [],
    claims: [],
  };
}

function init() {
  cacheDom();
  hydrateState();
  bindEvents();
  setDefaultPickupTime();
  renderAll();
}

function cacheDom() {
  ui.uploadForm = document.getElementById("uploadForm");
  ui.restaurantName = document.getElementById("restaurantName");
  ui.foodType = document.getElementById("foodType");
  ui.servings = document.getElementById("servings");
  ui.pickupTime = document.getElementById("pickupTime");
  ui.location = document.getElementById("location");
  ui.notes = document.getElementById("notes");
  ui.recipientName = document.getElementById("recipientName");
  ui.searchInput = document.getElementById("searchInput");
  ui.statusFilter = document.getElementById("statusFilter");
  ui.listingGrid = document.getElementById("listingGrid");
  ui.claimTimeline = document.getElementById("claimTimeline");
  ui.listedMealsValue = document.getElementById("listedMealsValue");
  ui.rescueRateValue = document.getElementById("rescueRateValue");
  ui.activeDonationsValue = document.getElementById("activeDonationsValue");
  ui.mealsRescuedValue = document.getElementById("mealsRescuedValue");
  ui.carbonSavedValue = document.getElementById("carbonSavedValue");
  ui.waterSavedValue = document.getElementById("waterSavedValue");
  ui.seedDataBtn = document.getElementById("seedDataBtn");
  ui.resetDataBtn = document.getElementById("resetDataBtn");
  ui.apiKeyInput = document.getElementById("apiKeyInput");
  ui.saveApiKeyBtn = document.getElementById("saveApiKeyBtn");
  ui.focusAreaInput = document.getElementById("focusAreaInput");
  ui.runPredictionBtn = document.getElementById("runPredictionBtn");
  ui.aiStatusText = document.getElementById("aiStatusText");
  ui.aiOutput = document.getElementById("aiOutput");
}

function bindEvents() {
  ui.uploadForm.addEventListener("submit", onUploadSubmit);
  ui.recipientName.addEventListener("input", onRecipientNameChange);
  ui.searchInput.addEventListener("input", renderListings);
  ui.statusFilter.addEventListener("change", renderListings);
  ui.listingGrid.addEventListener("click", onListingGridClick);
  ui.seedDataBtn.addEventListener("click", onLoadDemoData);
  ui.resetDataBtn.addEventListener("click", onResetData);
  ui.saveApiKeyBtn.addEventListener("click", onSaveApiKey);
  ui.runPredictionBtn.addEventListener("click", onRunPrediction);
}

function hydrateState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    Object.assign(state, createEmptyState());
    addDemoData({ persist: false });
  } else {
    try {
      const parsed = JSON.parse(raw);
      Object.assign(state, createEmptyState(), parsed);
      if (!Array.isArray(state.listings)) state.listings = [];
      if (!Array.isArray(state.claims)) state.claims = [];
      state.nextListingId = getNextId(state.listings);
    } catch (error) {
      console.warn("Failed to parse local data. Resetting.", error);
      Object.assign(state, createEmptyState());
      addDemoData({ persist: false });
    }
  }

  saveState();
  ui.recipientName.value = state.recipientName || "";
  ui.apiKeyInput.value = state.apiKey || "";
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getNextId(listings) {
  const maxId = listings.reduce((max, listing) => Math.max(max, Number(listing.id) || 0), 0);
  return maxId + 1;
}

function setDefaultPickupTime() {
  if (!ui.pickupTime || ui.pickupTime.value) return;

  const date = new Date(Date.now() + 2 * 60 * 60 * 1000);
  date.setMinutes(Math.ceil(date.getMinutes() / 15) * 15, 0, 0);
  ui.pickupTime.value = toDatetimeLocal(date);
}

function toDatetimeLocal(date) {
  const pad = (n) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function onUploadSubmit(event) {
  event.preventDefault();
  const restaurantName = ui.restaurantName.value.trim();
  const foodType = ui.foodType.value.trim();
  const servings = Number(ui.servings.value);
  const pickupLocal = ui.pickupTime.value;
  const location = ui.location.value.trim();
  const notes = ui.notes.value.trim();

  if (!restaurantName || !foodType || !location || !pickupLocal || servings < 1) {
    setAiStatus("Please complete all required upload fields.", "error");
    return;
  }

  const pickupDate = new Date(pickupLocal);
  if (Number.isNaN(pickupDate.getTime())) {
    setAiStatus("Pickup date is invalid. Please choose a valid date/time.", "error");
    return;
  }

  state.listings.unshift({
    id: state.nextListingId++,
    restaurantName,
    foodType,
    servings,
    pickupTime: pickupDate.toISOString(),
    location,
    notes,
    status: "available",
    createdAt: new Date().toISOString(),
    claimedBy: "",
    claimedAt: "",
  });

  saveState();
  ui.uploadForm.reset();
  setDefaultPickupTime();
  renderAll();
}

function onRecipientNameChange(event) {
  state.recipientName = event.target.value.trim();
  saveState();
  renderListings();
}

function onListingGridClick(event) {
  const claimButton = event.target.closest("button[data-action='claim']");
  if (!claimButton) return;

  const listingId = Number(claimButton.dataset.id);
  if (!listingId) return;
  claimListing(listingId);
}

function claimListing(listingId) {
  const listing = state.listings.find((item) => Number(item.id) === listingId);
  if (!listing || listing.status !== "available") return;

  const recipientName = getRecipientName("");
  if (!recipientName) {
    setAiStatus("Enter shelter or food bank name before claiming donations.", "warn");
    ui.recipientName.focus();
    return;
  }

  const claimedAt = new Date().toISOString();
  listing.status = "claimed";
  listing.claimedBy = recipientName;
  listing.claimedAt = claimedAt;

  state.claims.unshift({
    id: `${listing.id}-${Date.now()}`,
    listingId: listing.id,
    restaurantName: listing.restaurantName,
    foodType: listing.foodType,
    servings: listing.servings,
    recipientName,
    claimedAt,
  });

  saveState();
  renderAll();
}

function onLoadDemoData() {
  addDemoData({ persist: true });
  renderAll();
  setAiStatus("Demo donations loaded into the live feed.", "success");
}

function addDemoData({ persist }) {
  const templates = [
    {
      restaurantName: "Harbor Kitchen",
      foodType: "Vegetable wraps + lentil soup",
      servings: 42,
      pickupOffsetHours: 3,
      location: "Downtown",
      notes: "Packed in biodegradable containers.",
    },
    {
      restaurantName: "Sunrise Bakery",
      foodType: "Whole-grain sandwiches + fruit cups",
      servings: 28,
      pickupOffsetHours: 5,
      location: "East Side",
      notes: "Contains gluten. Keep refrigerated.",
    },
    {
      restaurantName: "Olive & Thyme Bistro",
      foodType: "Pasta trays + mixed salad",
      servings: 60,
      pickupOffsetHours: 2,
      location: "West Market",
      notes: "Pickup at rear loading entrance.",
    },
  ];

  const now = Date.now();
  const newListings = templates.map((item, index) => ({
    id: state.nextListingId + index,
    restaurantName: item.restaurantName,
    foodType: item.foodType,
    servings: item.servings,
    pickupTime: new Date(now + item.pickupOffsetHours * 60 * 60 * 1000).toISOString(),
    location: item.location,
    notes: item.notes,
    status: "available",
    createdAt: new Date().toISOString(),
    claimedBy: "",
    claimedAt: "",
  }));

  state.listings.unshift(...newListings);
  state.nextListingId += newListings.length;

  if (persist) saveState();
}

function onResetData() {
  Object.assign(state, createEmptyState());
  state.recipientName = "Downtown Hope Shelter";
  addDemoData({ persist: false });
  saveState();

  ui.uploadForm.reset();
  ui.searchInput.value = "";
  ui.statusFilter.value = "all";
  ui.focusAreaInput.value = "";
  ui.recipientName.value = state.recipientName;
  ui.apiKeyInput.value = "";
  ui.aiOutput.textContent =
    "No AI forecast yet. Click \"Run Gemini Forecast\" to generate hotspot predictions and operational recommendations.";
  setDefaultPickupTime();
  renderAll();
  setAiStatus("Local data has been reset.", "warn");
}

function onSaveApiKey() {
  state.apiKey = ui.apiKeyInput.value.trim();
  saveState();

  if (!state.apiKey) {
    setAiStatus("Gemini API key removed.", "warn");
    return;
  }

  setAiStatus("Gemini API key saved locally in this browser.", "success");
}

async function onRunPrediction() {
  const apiKey = state.apiKey || ui.apiKeyInput.value.trim();
  if (!apiKey) {
    setAiStatus("Add and save a Gemini API key before running a forecast.", "error");
    ui.apiKeyInput.focus();
    return;
  }

  state.apiKey = apiKey;
  saveState();

  const prompt = buildGeminiPrompt();
  ui.runPredictionBtn.disabled = true;
  ui.aiOutput.textContent = "Generating Gemini forecast...";
  setAiStatus("Running Gemini forecast...", "info");

  try {
    const forecast = await requestGeminiForecast(prompt, apiKey);
    ui.aiOutput.textContent = forecast;
    const refreshed = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      month: "short",
      day: "numeric",
    }).format(new Date());
    setAiStatus(`Forecast updated ${refreshed}.`, "success");
  } catch (error) {
    ui.aiOutput.textContent =
      "Gemini forecast request failed. Check your API key, network, and model access.\n\n" +
      String(error.message || error);
    setAiStatus(`Gemini request failed: ${error.message || error}`, "error");
  } finally {
    ui.runPredictionBtn.disabled = false;
  }
}

function buildGeminiPrompt() {
  const totals = computeTotals();
  const focusArea = ui.focusAreaInput.value.trim() || "city-wide operations";
  const available = state.listings
    .filter((listing) => listing.status === "available")
    .slice(0, 20)
    .map((listing) => ({
      restaurant: listing.restaurantName,
      item: listing.foodType,
      servings: listing.servings,
      pickupTime: listing.pickupTime,
      location: listing.location,
    }));

  const recentClaims = state.claims.slice(0, 12).map((claim) => ({
    recipient: claim.recipientName,
    servings: claim.servings,
    restaurant: claim.restaurantName,
    claimedAt: claim.claimedAt,
  }));

  return `You are an operations forecasting assistant for GreenBridge, a food rescue and waste reduction platform.

Objective:
- Predict where food waste risk is most likely in the next 24 hours.
- Suggest practical allocation and pickup actions for shelters and food banks.

Focus area: ${focusArea}
Current timestamp: ${new Date().toISOString()}

Platform summary:
${JSON.stringify(
  {
    totals,
    availableDonations: available,
    recentClaims,
  },
  null,
  2
)}

Return your response in concise markdown with this exact structure:
### Waste Hotspots (Next 24h)
- Location | Risk Score (1-10) | Why

### Recommended Actions
- Bullet list of at least 5 actions, each action must be specific and operational.

### Priority Pickups
- 3 to 5 immediate pickups with expected impact.

### Data Gaps
- Mention missing inputs that would improve prediction accuracy.`;
}

async function requestGeminiForecast(prompt, apiKey) {
  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent` +
    `?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 900,
      },
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      data?.error?.message ||
      `HTTP ${response.status}: ${response.statusText || "Unknown error"}`;
    throw new Error(message);
  }

  const text = (data?.candidates || [])
    .flatMap((candidate) => candidate?.content?.parts || [])
    .map((part) => part?.text || "")
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
}

function computeTotals() {
  const listedMeals = state.listings.reduce((sum, listing) => sum + Number(listing.servings || 0), 0);
  const mealsRescued = state.listings
    .filter((listing) => listing.status === "claimed")
    .reduce((sum, listing) => sum + Number(listing.servings || 0), 0);
  const activeDonations = state.listings.filter((listing) => listing.status === "available").length;

  const carbonSavedKg = mealsRescued * IMPACT_FACTORS.carbonKgPerMeal;
  const waterSavedLiters = mealsRescued * IMPACT_FACTORS.waterLitersPerMeal;
  const rescueRate = listedMeals > 0 ? (mealsRescued / listedMeals) * 100 : 0;

  return {
    listedMeals,
    mealsRescued,
    activeDonations,
    carbonSavedKg,
    waterSavedLiters,
    rescueRate,
  };
}

function renderAll() {
  renderImpactCards();
  renderListings();
  renderClaimTimeline();
}

function renderImpactCards() {
  const totals = computeTotals();
  ui.activeDonationsValue.textContent = formatNumber(totals.activeDonations);
  ui.mealsRescuedValue.textContent = formatNumber(totals.mealsRescued);
  ui.carbonSavedValue.textContent = `${formatNumber(totals.carbonSavedKg, 1)} kg`;
  ui.waterSavedValue.textContent = `${formatNumber(totals.waterSavedLiters)} L`;
  ui.listedMealsValue.textContent = formatNumber(totals.listedMeals);
  ui.rescueRateValue.textContent = `${formatNumber(totals.rescueRate, 1)}%`;
}

function renderListings() {
  const term = ui.searchInput.value.trim().toLowerCase();
  const filter = ui.statusFilter.value;
  const recipientName = getRecipientName("Current recipient");

  const filtered = state.listings
    .filter((listing) => {
      if (filter !== "all" && listing.status !== filter) return false;
      if (!term) return true;
      return (
        listing.restaurantName.toLowerCase().includes(term) ||
        listing.foodType.toLowerCase().includes(term) ||
        listing.location.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "available" ? -1 : 1;
      return new Date(a.pickupTime).getTime() - new Date(b.pickupTime).getTime();
    });

  ui.listingGrid.innerHTML = "";
  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No donations match the current filters.";
    ui.listingGrid.append(empty);
    return;
  }

  filtered.forEach((listing) => ui.listingGrid.append(createListingCard(listing, recipientName)));
}

function createListingCard(listing, recipientName) {
  const card = document.createElement("article");
  card.className = `donation-card ${listing.status}`;

  const header = document.createElement("div");
  header.className = "donation-header";

  const left = document.createElement("div");
  const title = document.createElement("p");
  title.className = "donation-title";
  title.textContent = listing.restaurantName;
  const item = document.createElement("p");
  item.className = "donation-item";
  item.textContent = listing.foodType;
  left.append(title, item);

  const badge = document.createElement("span");
  badge.className = `badge ${listing.status}`;
  badge.textContent = listing.status === "available" ? "Available" : "Claimed";

  header.append(left, badge);

  const meta = document.createElement("ul");
  meta.className = "donation-meta";
  meta.append(
    makeMetaItem(`Servings: ${formatNumber(listing.servings)}`),
    makeMetaItem(`Pickup by: ${formatDateTime(listing.pickupTime)}`),
    makeMetaItem(`Location: ${listing.location}`)
  );

  card.append(header, meta);

  if (listing.notes) {
    const notes = document.createElement("p");
    notes.className = "donation-note";
    notes.textContent = listing.notes;
    card.append(notes);
  }

  const actions = document.createElement("div");
  actions.className = "donation-actions";

  if (listing.status === "available") {
    const claimBtn = document.createElement("button");
    claimBtn.className = "btn primary";
    claimBtn.type = "button";
    claimBtn.dataset.action = "claim";
    claimBtn.dataset.id = String(listing.id);
    claimBtn.textContent = `Claim for ${recipientName}`;
    actions.append(claimBtn);
  } else {
    const claimedInfo = document.createElement("p");
    claimedInfo.className = "helper-text";
    claimedInfo.textContent = `Claimed by ${listing.claimedBy} on ${formatDateTime(listing.claimedAt)}`;
    actions.append(claimedInfo);
  }

  card.append(actions);
  return card;
}

function makeMetaItem(text) {
  const li = document.createElement("li");
  li.textContent = text;
  return li;
}

function getRecipientName(fallback) {
  const typedName = (ui.recipientName.value || "").trim();
  const storedName = (state.recipientName || "").trim();
  return typedName || storedName || fallback;
}

function renderClaimTimeline() {
  ui.claimTimeline.innerHTML = "";

  if (state.claims.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "No claims yet. Claim a donation to begin your impact timeline.";
    ui.claimTimeline.append(empty);
    return;
  }

  state.claims.slice(0, 10).forEach((claim) => {
    const item = document.createElement("li");
    item.className = "timeline-item";

    const time = document.createElement("div");
    time.className = "timeline-time";
    time.textContent = formatDateTime(claim.claimedAt);

    const content = document.createElement("div");
    content.className = "timeline-content";
    const title = document.createElement("strong");
    title.textContent = `${claim.recipientName} rescued ${formatNumber(claim.servings)} meals`;
    const subtitle = document.createElement("span");
    subtitle.textContent = `${claim.restaurantName} - ${claim.foodType}`;
    content.append(title, subtitle);

    item.append(time, content);
    ui.claimTimeline.append(item);
  });
}

function setAiStatus(message, tone = "info") {
  const colors = {
    info: "#afc1e8",
    success: "#84f8cb",
    warn: "#ffd585",
    error: "#ff9db0",
  };
  ui.aiStatusText.textContent = message;
  ui.aiStatusText.style.color = colors[tone] || colors.info;
}

function formatDateTime(isoString) {
  const value = new Date(isoString);
  if (Number.isNaN(value.getTime())) return "Unknown time";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function formatNumber(value, decimals = 0) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: decimals,
  }).format(value || 0);
}
