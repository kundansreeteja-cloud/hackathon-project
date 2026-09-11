# AquaWatch — Smart Water Usage Monitoring Frontend (DVPS-33)

> “A smart water-usage monitoring app for households that flags leaks and suggests conservation tips based on consumption patterns.”

AquaWatch is the frontend dashboard for hackathon problem statement **DVPS-33**. Built with React 19, Vite, and modern CSS, it connects dynamically to the backend analytics API to monitor water consumption, flag potential household leaks, visualize daily trends, and suggest actionable water conservation tips.

---

## 🚀 Quick Start

### 1. Install Dependencies
Navigate into the `frontend` folder:
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Inside `.env`, verify or configure the backend URL:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at the URL shown in the terminal (usually `http://localhost:5173`).

### 4. Build for Production (e.g. Vercel)
```bash
npm run build
```

---

## 🔌 Connecting to the Backend

The frontend communicates with the backend via the Fetch API using:
```http
POST ${VITE_API_URL}/api/analyze-water-usage
```

### Request Payload Sent by Frontend:
```json
{
  "householdSize": 4,
  "currentDailyUsage": 850,
  "previousDailyUsage": 650,
  "daysAnalyzed": 7,
  "usage": {
    "bathing": 300,
    "kitchen": 150,
    "laundry": 200,
    "cleaning": 100,
    "other": 100
  }
}
```

### Expected Response from Backend:
```json
{
  "status": "high",
  "leakDetected": true,
  "leakRisk": "High",
  "currentDailyUsage": 850,
  "previousDailyUsage": 650,
  "excessUsage": 200,
  "message": "Water usage is significantly higher than the previous pattern.",
  "tips": [
    "Check taps and visible pipes for leaks.",
    "Reduce shower time.",
    "Check whether the toilet is continuously running."
  ],
  "trend": [
    { "day": "Day 1", "usage": 700 },
    { "day": "Day 2", "usage": 720 }
  ]
}
```

---

## 📁 Project Structure

```
frontend/
├── .env.example               # Template environment configuration
├── .env                       # Local environment file
├── vercel.json                # Single-page routing configuration for Vercel
├── index.html                 # App shell with title, fonts, and meta description
├── src/
│   ├── components/
│   │   ├── Header.jsx         # App header with water branding, tagline & API URL indicator
│   │   ├── UsageForm.jsx      # Input form with numeric validation and demo presets
│   │   ├── ResultCard.jsx     # Consumption summary, status badge & backend message
│   │   ├── LeakAlert.jsx      # High/Medium/Low leak risk visual alert and checklist
│   │   ├── ConservationTips.jsx # Dynamic conservation recommendations from backend
│   │   ├── UsageChart.jsx     # Zero-dependency responsive SVG trend & breakdown chart
│   │   └── LoadingSpinner.jsx # Water droplet loading animation
│   ├── services/
│   │   └── api.js             # API request service using Fetch API & error handling
│   ├── App.jsx                # Main coordinator component
│   ├── App.css                # Dashboard and component styling
│   ├── index.css              # Global design system & theme variables
│   └── main.jsx               # React entry point
```

---

## 💡 Explaining to Hackathon Judges

1. **Tagline**: *"AquaWatch empowers households to monitor water usage, detect silent plumbing leaks early, and adopt personalized conservation habits."*
2. **Separation of Concerns**: The frontend is purely presentation & data-collection; all statistical thresholding, leak detection algorithms, and conservation advice are computed dynamically by the backend API.
3. **No Heavy Libraries**: Features a lightweight zero-dependency custom SVG trend chart avoiding React 19 package version conflicts.
4. **Resilient Error Handling**: Handles backend disconnection gracefully, highlighting connection diagnosis directly in the UI.
