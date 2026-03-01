# 🌿 GreenBridge — AI-Powered Food Rescue + Waste Reduction Platform

GreenBridge connects restaurants with surplus food to shelters and food banks using Gemini AI for waste prediction and impact tracking.

## Features

- **Restaurant Portal** — Restaurants upload surplus food listings (type, quantity, pickup window, location)
- **Shelter Portal** — Shelters and food banks browse and claim available food with one click
- **AI Waste Predictions** — Gemini AI analyzes patterns to predict where food waste will happen and recommends actions
- **Impact Dashboard** — Real-time carbon saved, water saved, meals provided, and community impact stats powered by Gemini AI

## Tech Stack

- **Frontend**: HTML + CSS (via Next.js JSX pages with scoped `<style jsx>`)
- **Backend**: Next.js API routes
- **AI**: Google Gemini API (`gemini-1.5-flash`)
- **Data**: In-memory store with seed data (easily swappable with a real database)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and add your Gemini API key:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get a free Gemini API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

> Without the API key, the app still works — sample/fallback predictions are shown on the AI pages.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page with live stats and how-it-works |
| Restaurant Portal | `/restaurant` | List surplus food, view all listings |
| Shelter Portal | `/shelter` | Browse and claim available food |
| AI Predictions | `/predictions` | Gemini AI waste predictions & recommendations |
| Impact Dashboard | `/impact` | Carbon, water, and community impact metrics |

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/food` | Get all food listings |
| GET | `/api/food?status=available` | Get available food only |
| POST | `/api/food` | Create a new food listing |
| GET | `/api/food/[id]` | Get a specific listing |
| POST | `/api/claim` | Claim a food listing |
| GET/POST | `/api/predict` | Run Gemini AI waste prediction |
| GET | `/api/impact` | Get impact report with AI narrative |
| GET | `/api/restaurants` | Get all restaurants |
| GET | `/api/shelters` | Get all shelters |
| GET | `/api/stats` | Get global platform stats |

## Environmental Impact Calculations

- **Carbon**: ~2.5 kg CO₂ prevented per kg of food rescued
- **Water**: ~1,000 liters saved per kg of food rescued
- **Meal weight**: 0.5 kg per portion, 0.3 kg per item

## Project Structure

```
/
├── pages/
│   ├── index.js          # Landing page
│   ├── restaurant.js     # Restaurant portal
│   ├── shelter.js        # Shelter portal
│   ├── predictions.js    # AI predictions
│   ├── impact.js         # Impact dashboard
│   └── api/              # Next.js API routes
├── components/
│   ├── Navbar.js
│   └── Footer.js
├── lib/
│   ├── db.js             # In-memory data store
│   └── gemini.js         # Gemini AI client
└── styles/
    └── globals.css       # Global styles & utilities
```
