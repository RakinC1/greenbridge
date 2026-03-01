# GreenBridge

GreenBridge is a modern, AI-powered food rescue + waste reduction web app built with **HTML, CSS, and vanilla JavaScript**.

## What it does

- Restaurants upload surplus food listings.
- Shelters and food banks claim available donations.
- Gemini-powered AI predicts where food waste risk is likely to happen.
- Dashboard shows sustainability impact:
  - Meals rescued
  - Carbon saved (kg CO2e)
  - Water saved (liters)

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (no framework)
- Gemini API (`generateContent`)

## Run locally

Open `index.html` in your browser, or use a static server:

```bash
python -m http.server 8080
```

Then visit: `http://localhost:8080`

## Gemini API setup

1. Create a Gemini API key in Google AI Studio.
2. In the app, paste it into **Gemini API Key** and click **Save Key Locally**.
3. Click **Run Gemini Forecast** to generate predictions.

> Note: For this demo, the key is stored in `localStorage` in your browser. In production, call Gemini from a backend/proxy instead of exposing API keys client-side.