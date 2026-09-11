/**
 * API Service for AquaWatch - Smart Water Usage Monitoring
 * Connects to the backend via POST /api/analyze-water-usage
 */

// Retrieve base URL from environment or default to localhost:5000
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

/**
 * Analyzes household water usage by sending metrics to the backend.
 * @param {Object} payload - The household usage data payload
 * @returns {Promise<Object>} The analysis result from the backend
 */
export async function analyzeWaterUsage(payload) {
  const endpoint = `${API_BASE_URL}/api/analyze-water-usage`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    let data = null;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      // If server returned non-JSON error page (e.g. HTML 404/500)
      if (!response.ok) {
        throw new Error(
          `Server responded with error status ${response.status} (${response.statusText}).`
        );
      }
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Received non-JSON response from server.');
      }
    }

    if (!response.ok) {
      const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    // Distinguish network failures (backend offline / CORS) from application errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(
        `Unable to reach backend server at ${API_BASE_URL}. Please verify that the backend is running and CORS is enabled.`
      );
    }

    // Re-throw the descriptive error message
    throw error;
  }
}

export { API_BASE_URL };
