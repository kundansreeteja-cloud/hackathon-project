# AquaWatch Backend API (DVPS-33)

> **Hackathon Problem Statement DVPS-33:**
> *“A smart water-usage monitoring app for households that flags leaks and suggests conservation tips based on consumption patterns.”*

This is the backend REST API for the AquaWatch application, built using **Node.js** and **Express.js**.

---

## 📁 Project Structure

```
backend/
├── server.js                   # Application entry point, middleware & CORS configuration
├── package.json                # Project metadata, dependencies, scripts
├── test-api.js                 # Automated end-to-end endpoint & validation test suite
├── .env.example                # Template for environment variables
├── .env                        # Local environment configuration
├── .gitignore                  # Git ignore rules
└── src/
    ├── routes/
    │   └── waterRoutes.js      # Route declarations for /api/health and /api/analyze-water-usage
    ├── controllers/
    │   └── waterController.js  # Request validation and controller response orchestration
    └── services/
        └── waterAnalysis.js    # Core analysis engine (leak risk, metrics, dynamic tips & trends)
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default values:
- `PORT=5000`
- `CORS_ORIGIN=*`

### 3. Start the Server
- **Production mode:**
  ```bash
  npm start
  ```
- **Development mode (auto-reload on changes):**
  ```bash
  npm run dev
  ```

### 4. Run Automated Test Suite
```bash
npm test
```

---

## 📡 API Endpoints

### 1. Health Check
- **Endpoint:** `GET /api/health`
- **Description:** Verifies that the API service is up and reachable.
- **Sample Request:**
  ```bash
  curl -X GET http://localhost:5000/api/health
  ```
- **Response (200 OK):**
  ```json
  {
    "status": "ok",
    "message": "Water monitoring API is running"
  }
  ```

---

### 2. Analyze Water Usage
- **Endpoint:** `POST /api/analyze-water-usage`
- **Description:** Validates consumption data, assesses leak probability, computes percentage change, produces personalized tips, and generates historical trends.
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "householdSize": 3,
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
- **Response (200 OK):**
  ```json
  {
    "status": "high",
    "leakDetected": true,
    "leakRisk": "High",
    "currentDailyUsage": 850,
    "previousDailyUsage": 650,
    "excessUsage": 200,
    "percentageChange": 30.77,
    "message": "Water usage is significantly higher than the previous pattern (+30.77%). High leak risk — possible leak detected. Immediate fixture inspection recommended.",
    "tips": [
      "Check taps and visible pipes for continuous leaks or loose fittings.",
      "Check whether the toilet is continuously running (test flapper valve with food coloring).",
      "Inspect overhead water tanks, float valves, and overflow pipes for unattended spillage.",
      "Conduct a 15-minute static meter test by shutting all indoor taps to confirm concealed pipe leaks.",
      "Bathing represents a major portion of consumption: reduce shower time or switch to a bucket bath."
    ],
    "trend": [
      { "day": "Day 1", "usage": 648 },
      { "day": "Day 2", "usage": 662 },
      { "day": "Day 3", "usage": 689 },
      { "day": "Day 4", "usage": 725 },
      { "day": "Day 5", "usage": 770 },
      { "day": "Day 6", "usage": 815 },
      { "day": "Day 7", "usage": 852 }
    ]
  }
  ```

---

## 🔍 Leak Detection & Analysis Logic

1. **Excess Usage Calculation:**
   $$\text{excessUsage} = \text{currentDailyUsage} - \text{previousDailyUsage}$$

2. **Percentage Change:**
   $$\text{percentageChange} = \left(\frac{\text{currentDailyUsage} - \text{previousDailyUsage}}{\text{previousDailyUsage}}\right) \times 100$$

3. **Status & Leak Risk Classification:**
   - **Normal ($\le 10\%$ increase or usage decreased):**
     - `status`: `"normal"`
     - `leakRisk`: `"Low"`
     - `leakDetected`: `false`
     - Focuses on preventative maintenance and routine efficiency habits.
   - **Moderate ($10\% < \text{increase} \le 25\%$):**
     - `status`: `"moderate"`
     - `leakRisk`: `"Medium"`
     - `leakDetected`: `false`
     - Flags minor drip hazards, valve trickles, and meter monitoring.
   - **High ($> 25\%$ increase):**
     - `status`: `"high"`
     - `leakRisk`: `"High"`
     - `leakDetected`: `true`
     - Wording cautions: *"High leak risk — possible leak detected"*. Triggers immediate inspections for running toilets, dripping taps, and concealed line breaks.

4. **Dynamic Trend Simulation:**
   - Generates daily points for the observation window (`daysAnalyzed`).
   - For leak scenarios, models a realistic escalating curve from historical baseline to current surge with subtle daily variances ($\pm 3\text{--}6\%$).

---

## 🛡️ Input Validation & Error Handling

All incoming requests are validated against strict criteria:
- Rejects missing required fields (`householdSize`, `currentDailyUsage`, `previousDailyUsage`, `daysAnalyzed`).
- Rejects non-numeric types, booleans, and nulls.
- Rejects `householdSize <= 0` or non-integer values.
- Rejects `currentDailyUsage <= 0` or `previousDailyUsage <= 0`.
- Rejects `daysAnalyzed <= 0` or non-integer values.
- Rejects negative category values inside optional `usage` breakdown.

**Error Response Example (400 Bad Request):**
```json
{
  "error": "Validation Error",
  "message": "Invalid householdSize: must be a positive whole number greater than 0."
}
```

---

## ☁️ Deployment on Render

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your Git repository.
3. Configure the service settings:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add Environment Variables:
   - `PORT`: `5000` (Render will also automatically assign its own port, which our `process.env.PORT || 5000` handles).
   - `CORS_ORIGIN`: Your deployed frontend URL (e.g. `https://aquawatch-frontend.vercel.app` or `*`).
