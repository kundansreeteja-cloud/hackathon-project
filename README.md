DVPS33 - SMART WATER USAGE MONITORING SYSTEM
================================================

Problem Statement:
DVPS33 - A smart water-usage monitoring app for households that flags leaks and suggests conservation tips based on consumption patterns.


1. PROJECT OVERVIEW
-------------------

Our project is a smart water-usage monitoring application designed to help households understand and reduce their water consumption.

The system collects household water-usage data and analyzes consumption patterns to identify unusual increases that may indicate a possible water leak.

It also provides personalized water-saving recommendations based on the user's actual consumption patterns.

The application is designed as a dynamic full-stack system where water usage, alerts, analytics, scores, and recommendations are generated from real database data rather than fixed values.


2. KEY FEATURES
---------------

- Dynamic household water-usage tracking
- Daily, weekly and monthly consumption analysis
- Category-wise water usage tracking
- Automatic calculation of total water consumption
- Unusual consumption detection
- Possible water-leak alerts
- Personalized water conservation recommendations
- Dynamic Water Smart Score
- Water-saving calculation
- Water-saving streak
- Historical water-usage records
- Interactive charts and analytics
- Edit and delete water-usage records
- Simulated smart-meter monitoring for demonstration
- Responsive web interface
- MongoDB database for persistent data storage


3. HOW THE SYSTEM WORKS
-----------------------

User enters water consumption data
                |
                v
        React Frontend
                |
                v
        Node.js + Express
                |
                v
          MongoDB Atlas
                |
                v
      Pattern Analysis Engine
                |
       +--------+--------+
       |        |        |
       v        v        v
    Average   Anomaly   Water
    Usage     Detection Score
                |
                v
       Possible Leak Alert
                |
                v
   Personalized Recommendations
                |
                v
        Dashboard & Analytics


4. LEAK DETECTION
-----------------

The application does not claim to physically detect a leak.

Instead, it analyzes historical water-consumption patterns and identifies unusually high consumption that may indicate a leak.

For example:

Normal average usage = 260 Litres/day
Current usage = 430 Litres/day

Percentage increase:

((430 - 260) / 260) × 100

If the increase is significantly higher than the household's normal pattern, the system generates a "Possible Water Leak" alert.

The system also provides possible causes such as:

- Toilet leakage
- Dripping tap
- Continuous water flow
- Unusual household activity


5. AI / SMART FEATURES
----------------------

The intelligent part of the application is used to:

- Analyze water-consumption patterns
- Identify unusual usage
- Explain why an alert was generated
- Generate personalized water-saving recommendations
- Provide insights based on household behavior

The system is designed to work even if an external AI API is unavailable by using rule-based recommendations as a fallback.


6. DYNAMIC FUNCTIONALITY
------------------------

The application is fully dynamic.

Water-usage values are not hardcoded in the frontend.

When a user adds a new reading:

1. The frontend sends the data to the backend.
2. The backend validates the data.
3. The total usage is calculated.
4. The data is stored in MongoDB.
5. The system analyzes the new reading.
6. Possible alerts are generated.
7. The Water Smart Score is recalculated.
8. Savings and recommendations are updated.
9. The dashboard and charts display the latest data.

Users can also edit or delete previous readings, and the calculations update accordingly.


7. WATER USAGE CATEGORIES
-------------------------

The application supports categories such as:

- Shower
- Kitchen
- Toilet
- Laundry
- Cleaning
- Other

The total daily water consumption is calculated from these categories.


8. DASHBOARD
------------

The dashboard displays:

- Today's water usage
- Average daily usage
- Weekly consumption
- Monthly consumption
- Water Smart Score
- Possible leak status
- Estimated water saved
- Conservation streak
- Recent alerts
- Personalized recommendations

Charts are generated dynamically from database records.


9. SMART METER SIMULATION
-------------------------

For the hackathon demonstration, the application includes an optional simulated smart-meter feature.

The simulator generates realistic water-consumption readings periodically.

This allows us to demonstrate how the system could work with real IoT water meters in the future.

Future smart-meter architecture:

Smart Water Meter
        |
        v
   Internet/API
        |
        v
     Backend
        |
        v
      Database
        |
        v
 Anomaly Detection
        |
        v
   User Dashboard


10. TECHNOLOGY STACK
--------------------

Frontend:
- React.js
- Vite
- JavaScript
- Tailwind CSS
- Recharts

Backend:
- Node.js
- Express.js

Database:
- MongoDB Atlas
- Mongoose

AI / Analysis:
- Anomaly detection
- Pattern analysis
- AI-generated recommendations where applicable


11. PROJECT STRUCTURE
---------------------

water-smart/
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- hooks/
|   |   |-- utils/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |-- package.json
|
|-- backend/
|   |-- models/
|   |-- routes/
|   |-- controllers/
|   |-- services/
|   |-- utils/
|   |-- server.js
|   |-- package.json
|
|-- README.txt
|-- .gitignore


12. INSTALLATION
----------------

Prerequisites:

- Node.js
- npm
- MongoDB Atlas account
- Git


Frontend installation:

1. Open the frontend folder.

2. Run:

npm install

3. Start the development server:

npm run dev


Backend installation:

1. Open the backend folder.

2. Run:

npm install

3. Create a .env file.

Example:

MONGODB_URI=your_mongodb_connection_string
AI_API_KEY=your_ai_api_key
PORT=5000


4. Start the backend:

npm start

or:

node server.js


13. ENVIRONMENT VARIABLES
-------------------------

Backend:

MONGODB_URI=
AI_API_KEY=
PORT=

Frontend:

VITE_API_URL=

IMPORTANT:
API keys, MongoDB credentials and other secrets must never be uploaded to GitHub.

The .env file should be included in .gitignore.


14. EXPECTED DEMO FLOW
----------------------

1. Open the application.

2. View the household dashboard.

3. Show normal water-consumption data.

4. Add a new water-usage reading.

5. The reading is saved to MongoDB.

6. The backend automatically analyzes the new reading.

7. If the usage is unusually high, a possible leak alert is generated.

8. Show the percentage increase compared with normal consumption.

9. Show possible causes.

10. Show personalized water-saving recommendations.

11. Show the updated Water Smart Score.

12. Open the analytics page and show the updated chart.

13. Start the Smart Meter Simulation.

14. Demonstrate changing consumption values.

15. Open the history page and show stored readings.


15. FUTURE SCOPE
----------------

The project can be extended with:

- Real IoT smart water meters
- Real-time sensor data
- Automatic water-flow monitoring
- Automated water shutoff systems
- Apartment/community-level monitoring
- Advanced machine-learning anomaly detection
- Municipal water-management integration
- Mobile application
- Push notifications
- Multi-household support


16. SOCIAL IMPACT
-----------------

The application encourages responsible water consumption by helping households understand their usage and identify unusual consumption patterns.

It can help users:

- Reduce unnecessary water usage
- Detect possible leaks earlier
- Save water and money
- Develop better conservation habits
- Make informed decisions using consumption data


17. IMPORTANT DISCLAIMER
------------------------

The application identifies unusual water-consumption patterns and flags them as possible leak indicators.

It does not guarantee that a physical water leak exists.

Users should inspect their plumbing or contact a qualified professional when a possible leak is detected.


18. TEAM
--------

Team Members:

Member 1 - Frontend Development
Member 2 - Backend & Database
Member 3 - Integration, Deployment & Testing


19. PROJECT OBJECTIVE
--------------------

Our objective is to transform ordinary household water-consumption data into useful insights.

Instead of simply showing how much water a household uses, the system analyzes consumption patterns, identifies unusual behavior, warns users about possible leaks, and provides personalized recommendations to encourage water conservation.


================================================
DVPS33 - SMART WATER USAGE MONITORING SYSTEM
================================================