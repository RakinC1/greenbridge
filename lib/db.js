import { v4 as uuidv4 } from "uuid";

// Carbon savings: ~2.5 kg CO2 per kg of food rescued
// Water savings: ~1000 liters per kg of food rescued
// Average meal weight: 0.5 kg
const CARBON_PER_KG = 2.5;
const WATER_PER_KG = 1000;
const KG_PER_PORTION = 0.5;
const KG_PER_ITEM = 0.3;

function calcSavings(quantity, unit) {
  let kg = 0;
  if (unit === "kg") kg = quantity;
  else if (unit === "portions") kg = quantity * KG_PER_PORTION;
  else if (unit === "items") kg = quantity * KG_PER_ITEM;
  return {
    carbonSaved: parseFloat((kg * CARBON_PER_KG).toFixed(2)),
    waterSaved: parseFloat((kg * WATER_PER_KG).toFixed(0)),
    kgRescued: parseFloat(kg.toFixed(2)),
  };
}

// Seed restaurants
const restaurants = [
  { id: "r1", name: "The Green Table", type: "Fine Dining", location: "Downtown", totalDonated: 0, totalCarbonSaved: 0, totalWaterSaved: 0, mealsProvided: 0 },
  { id: "r2", name: "Harvest Bistro", type: "Casual", location: "Midtown", totalDonated: 0, totalCarbonSaved: 0, totalWaterSaved: 0, mealsProvided: 0 },
  { id: "r3", name: "Urban Bakehouse", type: "Bakery", location: "Westside", totalDonated: 0, totalCarbonSaved: 0, totalWaterSaved: 0, mealsProvided: 0 },
  { id: "r4", name: "Farm & Fork", type: "Farm-to-Table", location: "Eastside", totalDonated: 0, totalCarbonSaved: 0, totalWaterSaved: 0, mealsProvided: 0 },
];

// Seed shelters
const shelters = [
  { id: "s1", name: "City Hope Shelter", type: "Homeless Shelter", location: "Downtown", totalClaimed: 0, peopleServed: 0 },
  { id: "s2", name: "Family First Food Bank", type: "Food Bank", location: "Northside", totalClaimed: 0, peopleServed: 0 },
  { id: "s3", name: "Community Kitchen", type: "Community Center", location: "Southside", totalClaimed: 0, peopleServed: 0 },
  { id: "s4", name: "Sunrise Youth Center", type: "Youth Shelter", location: "Eastside", totalClaimed: 0, peopleServed: 0 },
];

// Seed food listings
const now = Date.now();
const hour = 3600000;

const foodListings = [
  {
    id: uuidv4(), restaurantId: "r1", restaurantName: "The Green Table",
    foodType: "Cooked Meals", category: "Hot Food",
    quantity: 25, unit: "portions", description: "Grilled salmon with roasted vegetables and rice. Freshly prepared, best consumed today.",
    pickupBy: new Date(now + 4 * hour).toISOString(),
    location: "123 Main St, Downtown", status: "available", claimedBy: null,
    ...calcSavings(25, "portions"), createdAt: new Date(now - hour).toISOString(),
  },
  {
    id: uuidv4(), restaurantId: "r2", restaurantName: "Harvest Bistro",
    foodType: "Fresh Produce", category: "Vegetables & Fruits",
    quantity: 15, unit: "kg", description: "Mixed seasonal vegetables: zucchini, bell peppers, tomatoes, spinach. Organic, farm-fresh.",
    pickupBy: new Date(now + 8 * hour).toISOString(),
    location: "456 Oak Ave, Midtown", status: "available", claimedBy: null,
    ...calcSavings(15, "kg"), createdAt: new Date(now - 2 * hour).toISOString(),
  },
  {
    id: uuidv4(), restaurantId: "r3", restaurantName: "Urban Bakehouse",
    foodType: "Bakery", category: "Bread & Pastries",
    quantity: 40, unit: "items", description: "Assorted artisan breads, croissants, and muffins from this morning's bake.",
    pickupBy: new Date(now + 3 * hour).toISOString(),
    location: "789 Elm St, Westside", status: "available", claimedBy: null,
    ...calcSavings(40, "items"), createdAt: new Date(now - 3 * hour).toISOString(),
  },
  {
    id: uuidv4(), restaurantId: "r4", restaurantName: "Farm & Fork",
    foodType: "Cooked Meals", category: "Hot Food",
    quantity: 18, unit: "portions", description: "Vegetarian pasta primavera with herbs and parmesan. Ideal for family-size portions.",
    pickupBy: new Date(now + 5 * hour).toISOString(),
    location: "321 Pine Rd, Eastside", status: "available", claimedBy: null,
    ...calcSavings(18, "portions"), createdAt: new Date(now - 30 * 60000).toISOString(),
  },
  {
    id: uuidv4(), restaurantId: "r1", restaurantName: "The Green Table",
    foodType: "Desserts", category: "Sweets",
    quantity: 30, unit: "items", description: "Chocolate lava cake and crème brûlée. Individually plated desserts from evening service.",
    pickupBy: new Date(now + 6 * hour).toISOString(),
    location: "123 Main St, Downtown", status: "claimed", claimedBy: "s1",
    ...calcSavings(30, "items"), createdAt: new Date(now - 5 * hour).toISOString(),
  },
  {
    id: uuidv4(), restaurantId: "r2", restaurantName: "Harvest Bistro",
    foodType: "Dairy & Eggs", category: "Dairy",
    quantity: 8, unit: "kg", description: "Assorted cheeses, yogurt, and fresh eggs. Cold chain maintained throughout.",
    pickupBy: new Date(now + 12 * hour).toISOString(),
    location: "456 Oak Ave, Midtown", status: "available", claimedBy: null,
    ...calcSavings(8, "kg"), createdAt: new Date(now - hour).toISOString(),
  },
];

// Update restaurant totals from seed data
function recalcRestaurantTotals() {
  restaurants.forEach((r) => {
    const listings = foodListings.filter((f) => f.restaurantId === r.id);
    r.totalDonated = listings.length;
    r.totalCarbonSaved = parseFloat(listings.reduce((a, f) => a + f.carbonSaved, 0).toFixed(2));
    r.totalWaterSaved = parseFloat(listings.reduce((a, f) => a + f.waterSaved, 0).toFixed(0));
    r.mealsProvided = listings.filter((f) => f.unit === "portions").reduce((a, f) => a + f.quantity, 0);
  });
}

function recalcShelterTotals() {
  shelters.forEach((s) => {
    const claimed = foodListings.filter((f) => f.claimedBy === s.id);
    s.totalClaimed = claimed.length;
    s.peopleServed = claimed.reduce((a, f) => a + (f.unit === "portions" ? f.quantity : Math.floor(f.kgRescued * 2)), 0);
  });
}

recalcRestaurantTotals();
recalcShelterTotals();

// --- API functions ---

export function getAllFood() {
  return [...foodListings];
}

export function getAvailableFood() {
  return foodListings.filter((f) => f.status === "available");
}

export function getFoodById(id) {
  return foodListings.find((f) => f.id === id) || null;
}

export function addFood(data) {
  const savings = calcSavings(data.quantity, data.unit);
  const listing = {
    id: uuidv4(),
    restaurantId: data.restaurantId,
    restaurantName: data.restaurantName,
    foodType: data.foodType,
    category: data.category || data.foodType,
    quantity: Number(data.quantity),
    unit: data.unit,
    description: data.description,
    pickupBy: data.pickupBy,
    location: data.location,
    status: "available",
    claimedBy: null,
    ...savings,
    createdAt: new Date().toISOString(),
  };
  foodListings.push(listing);
  recalcRestaurantTotals();
  return listing;
}

export function claimFood(id, shelterId) {
  const listing = foodListings.find((f) => f.id === id);
  if (!listing) return { error: "Food listing not found" };
  if (listing.status !== "available") return { error: "Food is no longer available" };
  listing.status = "claimed";
  listing.claimedBy = shelterId;
  recalcShelterTotals();
  return listing;
}

export function getRestaurants() {
  return [...restaurants];
}

export function getRestaurantById(id) {
  return restaurants.find((r) => r.id === id) || null;
}

export function getShelters() {
  return [...shelters];
}

export function getShelterById(id) {
  return shelters.find((s) => s.id === id) || null;
}

export function getGlobalStats() {
  const available = foodListings.filter((f) => f.status === "available").length;
  const claimed = foodListings.filter((f) => f.status === "claimed").length;
  const totalCarbonSaved = parseFloat(foodListings.reduce((a, f) => a + f.carbonSaved, 0).toFixed(2));
  const totalWaterSaved = parseFloat(foodListings.reduce((a, f) => a + f.waterSaved, 0).toFixed(0));
  const totalKgRescued = parseFloat(foodListings.reduce((a, f) => a + f.kgRescued, 0).toFixed(2));
  const mealsProvided = foodListings.filter((f) => f.unit === "portions").reduce((a, f) => a + f.quantity, 0);
  return { available, claimed, total: foodListings.length, totalCarbonSaved, totalWaterSaved, totalKgRescued, mealsProvided };
}

export function getWastePredictionData() {
  // Returns data useful for AI analysis
  const byType = {};
  foodListings.forEach((f) => {
    if (!byType[f.foodType]) byType[f.foodType] = { type: f.foodType, total: 0, claimed: 0, avgQuantity: 0, quantities: [] };
    byType[f.foodType].total++;
    byType[f.foodType].quantities.push(f.quantity);
    if (f.status === "claimed") byType[f.foodType].claimed++;
  });
  Object.values(byType).forEach((t) => {
    t.avgQuantity = parseFloat((t.quantities.reduce((a, b) => a + b, 0) / t.quantities.length).toFixed(1));
    t.claimRate = parseFloat(((t.claimed / t.total) * 100).toFixed(1));
    delete t.quantities;
  });

  const byRestaurant = restaurants.map((r) => {
    const listings = foodListings.filter((f) => f.restaurantId === r.id);
    const claimedCount = listings.filter((f) => f.status === "claimed").length;
    return {
      name: r.name, type: r.type, location: r.location,
      totalListings: listings.length,
      claimedListings: claimedCount,
      availableListings: listings.filter((f) => f.status === "available").length,
      claimRate: listings.length > 0 ? parseFloat(((claimedCount / listings.length) * 100).toFixed(1)) : 0,
      avgQuantityPerListing: listings.length > 0 ? parseFloat((listings.reduce((a, f) => a + f.quantity, 0) / listings.length).toFixed(1)) : 0,
    };
  });

  return { byType: Object.values(byType), byRestaurant, totalListings: foodListings.length, globalStats: getGlobalStats() };
}
