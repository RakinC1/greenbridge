import { getAllFood, getAvailableFood, addFood, getRestaurants } from "../../../lib/db";

export default function handler(req, res) {
  if (req.method === "GET") {
    const { status } = req.query;
    const food = status === "available" ? getAvailableFood() : getAllFood();
    return res.status(200).json({ success: true, data: food });
  }

  if (req.method === "POST") {
    const { restaurantId, restaurantName, foodType, category, quantity, unit, description, pickupBy, location } = req.body;
    if (!restaurantId || !foodType || !quantity || !unit || !description || !pickupBy || !location) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
    const restaurants = getRestaurants();
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    const name = restaurantName || (restaurant ? restaurant.name : "Unknown Restaurant");
    const listing = addFood({ restaurantId, restaurantName: name, foodType, category, quantity: Number(quantity), unit, description, pickupBy, location });
    return res.status(201).json({ success: true, data: listing });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
}
