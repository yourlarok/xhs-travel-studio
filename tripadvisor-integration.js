const API_ROOT = "https://api.content.tripadvisor.com/api/v1";

async function getJson(url, key) {
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Tripadvisor API ${response.status}: ${body.slice(0, 180)}`);
  }
  return response.json();
}

function registerTripadvisorIntegration({ ipcMain }) {
  ipcMain.handle("tripadvisor:research", async (_event, input = {}) => {
    const apiKey = String(input.apiKey || "").trim();
    if (!apiKey) return { connected: false, needsKey: true, items: [], capturedAt: new Date().toISOString() };
    const queries = Array.isArray(input.queries) ? input.queries.map(String).map(v => v.trim()).filter(Boolean).slice(0, 12) : [];
    const language = /^[a-z]{2}(?:_[A-Z]{2})?$/.test(input.language || "") ? input.language : "en";
    const maxLocations = Math.max(1, Math.min(Number(input.maxLocations) || 3, 5));
    const items = [];
    for (const query of queries) {
      const searchUrl = `${API_ROOT}/location/search?key=${encodeURIComponent(apiKey)}&searchQuery=${encodeURIComponent(query)}&language=${encodeURIComponent(language)}`;
      const search = await getJson(searchUrl, apiKey);
      for (const location of (search.data || []).slice(0, maxLocations)) {
        const reviewUrl = `${API_ROOT}/location/${encodeURIComponent(location.location_id)}/reviews?key=${encodeURIComponent(apiKey)}&language=${encodeURIComponent(language)}`;
        let reviews = [];
        try { reviews = (await getJson(reviewUrl, apiKey)).data || []; } catch (error) { reviews = [{ api_error: error.message }]; }
        items.push({
          query,
          locationId: location.location_id,
          name: location.name,
          address: location.address_obj,
          webUrl: location.web_url,
          reviews: reviews.slice(0, 5).map(review => ({
            id: review.id,
            rating: review.rating,
            title: review.title,
            text: review.text,
            publishedDate: review.published_date,
            tripType: review.trip_type,
            userLocation: review.user?.user_location?.name,
            url: review.url,
            apiError: review.api_error
          }))
        });
      }
    }
    return { connected: true, capturedAt: new Date().toISOString(), language, queryCount: queries.length, items };
  });
}

module.exports = { registerTripadvisorIntegration };
