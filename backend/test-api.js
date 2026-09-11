/**
 * Automated Test Suite for AquaWatch Backend API
 * Executes tests against all required endpoints and validation rules.
 */

const { server } = require('./server');

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('\n🧪 Running AquaWatch Backend Test Suite...\n');
  let passed = 0;
  let failed = 0;

  async function assertTest(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Health Check Test
  await assertTest('GET /api/health returns 200 with ok status', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error(`Expected status 'ok', got ${data.status}`);
    if (!data.message.includes('Water monitoring API is running')) {
      throw new Error(`Unexpected message: ${data.message}`);
    }
  });

  // 2. High Usage / Leak Scenario
  await assertTest('POST /api/analyze-water-usage flags High leak risk for 850L vs 650L', async () => {
    const payload = {
      householdSize: 4,
      currentDailyUsage: 850,
      previousDailyUsage: 650,
      daysAnalyzed: 7,
      usage: {
        bathing: 300,
        kitchen: 150,
        laundry: 200,
        cleaning: 100,
        other: 100,
      },
    };

    const res = await fetch(`${BASE_URL}/api/analyze-water-usage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    const data = await res.json();

    if (data.status !== 'high') throw new Error(`Expected status 'high', got ${data.status}`);
    if (data.leakDetected !== true) throw new Error(`Expected leakDetected true, got ${data.leakDetected}`);
    if (data.leakRisk !== 'High') throw new Error(`Expected leakRisk 'High', got ${data.leakRisk}`);
    if (data.excessUsage !== 200) throw new Error(`Expected excessUsage 200, got ${data.excessUsage}`);
    if (data.percentageChange !== 30.77) throw new Error(`Expected percentageChange 30.77, got ${data.percentageChange}`);
    if (!Array.isArray(data.tips) || data.tips.length < 3) throw new Error('Expected at least 3 tips');
    if (!Array.isArray(data.trend) || data.trend.length !== 7) throw new Error('Expected 7 trend points');
  });

  // 3. Moderate Usage Scenario
  await assertTest('POST /api/analyze-water-usage classifies 700L vs 600L as moderate', async () => {
    const payload = {
      householdSize: 3,
      currentDailyUsage: 700,
      previousDailyUsage: 600,
      daysAnalyzed: 7,
    };

    const res = await fetch(`${BASE_URL}/api/analyze-water-usage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    const data = await res.json();

    if (data.status !== 'moderate') throw new Error(`Expected status 'moderate', got ${data.status}`);
    if (data.leakRisk !== 'Medium') throw new Error(`Expected leakRisk 'Medium', got ${data.leakRisk}`);
    if (data.excessUsage !== 100) throw new Error(`Expected excessUsage 100, got ${data.excessUsage}`);
    if (data.percentageChange !== 16.67) throw new Error(`Expected percentageChange 16.67, got ${data.percentageChange}`);
  });

  // 4. Normal Usage Scenario (reduction / conservation)
  await assertTest('POST /api/analyze-water-usage classifies 500L vs 520L as normal / low risk', async () => {
    const payload = {
      householdSize: 3,
      currentDailyUsage: 500,
      previousDailyUsage: 520,
      daysAnalyzed: 7,
      usage: {
        bathing: 180,
        kitchen: 120,
        laundry: 110,
        cleaning: 50,
        other: 40,
      },
    };

    const res = await fetch(`${BASE_URL}/api/analyze-water-usage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    const data = await res.json();

    if (data.status !== 'normal') throw new Error(`Expected status 'normal', got ${data.status}`);
    if (data.leakDetected !== false) throw new Error(`Expected leakDetected false, got ${data.leakDetected}`);
    if (data.leakRisk !== 'Low') throw new Error(`Expected leakRisk 'Low', got ${data.leakRisk}`);
    if (data.excessUsage !== -20) throw new Error(`Expected excessUsage -20, got ${data.excessUsage}`);
    if (data.percentageChange !== -3.85) throw new Error(`Expected percentageChange -3.85, got ${data.percentageChange}`);
  });

  // 5. Validation: Missing required fields
  await assertTest('POST /api/analyze-water-usage returns 400 for missing fields', async () => {
    const res = await fetch(`${BASE_URL}/api/analyze-water-usage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ householdSize: 3 }),
    });

    if (res.status !== 400) throw new Error(`Expected status 400, got ${res.status}`);
    const data = await res.json();
    if (data.error !== 'Validation Error') throw new Error(`Expected 'Validation Error', got ${data.error}`);
  });

  // 6. Validation: Non-numeric and zero/negative values
  await assertTest('POST /api/analyze-water-usage returns 400 for negative householdSize', async () => {
    const res = await fetch(`${BASE_URL}/api/analyze-water-usage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        householdSize: -1,
        currentDailyUsage: 850,
        previousDailyUsage: 650,
        daysAnalyzed: 7,
      }),
    });

    if (res.status !== 400) throw new Error(`Expected status 400, got ${res.status}`);
  });

  await assertTest('POST /api/analyze-water-usage returns 400 for non-numeric currentDailyUsage', async () => {
    const res = await fetch(`${BASE_URL}/api/analyze-water-usage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        householdSize: 4,
        currentDailyUsage: 'not-a-number',
        previousDailyUsage: 650,
        daysAnalyzed: 7,
      }),
    });

    if (res.status !== 400) throw new Error(`Expected status 400, got ${res.status}`);
  });

  await assertTest('POST /api/analyze-water-usage returns 400 for invalid daysAnalyzed', async () => {
    const res = await fetch(`${BASE_URL}/api/analyze-water-usage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        householdSize: 4,
        currentDailyUsage: 800,
        previousDailyUsage: 650,
        daysAnalyzed: 0,
      }),
    });

    if (res.status !== 400) throw new Error(`Expected status 400, got ${res.status}`);
  });

  // 7. Root route
  await assertTest('GET / returns 200 with online status', async () => {
    const res = await fetch(`${BASE_URL}/`);
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    const data = await res.json();
    if (data.status !== 'online') throw new Error(`Expected status 'online', got ${data.status}`);
  });

  // 8. 404 Route
  await assertTest('GET /api/non-existent returns 404 Not Found', async () => {
    const res = await fetch(`${BASE_URL}/api/non-existent`);
    if (res.status !== 404) throw new Error(`Expected status 404, got ${res.status}`);
  });

  console.log(`\n🏁 Test Results: ${passed} Passed, ${failed} Failed\n`);

  server.close();
  setTimeout(() => {
    process.exit(failed > 0 ? 1 : 0);
  }, 100);
}

// Allow server a brief moment to bind before testing
setTimeout(runTests, 500);
