// backend/services/routeService.js
// Route optimization using nearest-neighbour algorithm

import { haversineDistance } from '../utils/geoUtils.js';

/**
 * optimizeRoute — Nearest-neighbour algorithm to order stops by minimum distance
 * 
 * Input:
 *   stops: [{ id, lat, lng, name, type }, ...] (restaurants or customer)
 *   riderLocation: { lat, lng }
 * 
 * Output:
 *   { 
 *     orderedStops: [{ ...stop, distanceFromPrev }, ...],
 *     totalDistance: number (in km),
 *     mapsUrl: string (Google Maps navigation URL)
 *   }
 */
export const optimizeRoute = (stops, riderLocation) => {
  if (!stops || stops.length === 0) {
    return { orderedStops: [], totalDistance: 0, mapsUrl: '' };
  }

  const ordered = [];
  let current = riderLocation;
  const remaining = [...stops];

  // Nearest-neighbour: always go to closest unvisited stop
  while (remaining.length > 0) {
    let nearest = 0;
    let minDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const dist = haversineDistance(
        current.lat,
        current.lng,
        remaining[i].lat,
        remaining[i].lng
      );
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    }

    // Add nearest stop with distance from previous
    ordered.push({
      ...remaining[nearest],
      distanceFromPrev: minDist,
    });

    current = remaining[nearest];
    remaining.splice(nearest, 1);
  }

  // Calculate total distance
  const totalDistance = ordered.reduce((sum, stop) => sum + stop.distanceFromPrev, 0);

  // Build Google Maps URL with waypoints
  const waypoints = ordered.map((stop) => `${stop.lat},${stop.lng}`).join('/');
  const mapsUrl = `https://www.google.com/maps/dir/${riderLocation.lat},${riderLocation.lng}/${waypoints}`;

  return {
    orderedStops: ordered,
    totalDistance: parseFloat(totalDistance.toFixed(2)),
    mapsUrl,
  };
};
