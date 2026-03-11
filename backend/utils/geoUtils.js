// backend/utils/geoUtils.js
// ─────────────────────────────────────────────────────────────────────────────
// Pure math helpers — no DB calls, no API calls, just calculations.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * haversineDistance
 *
 * Calculates the straight-line distance between two GPS points on Earth.
 * Think of it like drawing a line on a globe between two pins.
 *
 * @param {number} lat1  - latitude of point A  (e.g. 23.8103)
 * @param {number} lng1  - longitude of point A (e.g. 90.4125)
 * @param {number} lat2  - latitude of point B
 * @param {number} lng2  - longitude of point B
 * @returns {number} distance in kilometres
 */
export const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Earth's radius in km

  // Convert degree difference to radians
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180

  // Haversine formula
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}