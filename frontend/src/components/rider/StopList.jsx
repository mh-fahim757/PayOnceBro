import React from 'react';

/**
 * StopList — Displays ordered stops for route optimization
 * 
 * Props:
 *   - stops: [{ id, name, type, lat, lng, distanceFromPrev }, ...]
 *   - totalDistance: number (in km)
 *   - isLoading: boolean
 */
const StopList = ({ stops = [], totalDistance = 0, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (stops.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center py-12">
        <p className="text-gray-400">No stops found for this route</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Pickup Route</h2>
        <p className="text-sm text-gray-600">Total Distance: <span className="font-bold">{totalDistance.toFixed(2)} km</span></p>
      </div>

      <div className="space-y-3">
        {stops.map((stop, index) => {
          const isRestaurant = stop.type === 'restaurant';
          const isCustomer = stop.type === 'customer';
          
          return (
            <div key={stop.id} className="flex items-start gap-4">
              {/* Stop number circle */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full font-semibold text-white text-sm flex items-center justify-center ${isCustomer ? 'bg-green-500' : 'bg-blue-500'}`}>
                {index + 1}
              </div>

              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {stop.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {isRestaurant && '📍 Restaurant'}
                  {isCustomer && '🏠 Customer Delivery'}
                </p>
                {index < stops.length - 1 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Distance to next: <span className="font-semibold">{stop.distanceFromPrev?.toFixed(2) || 0} km</span>
                  </p>
                )}
              </div>

              {/* Visual line between stops */}
              {index < stops.length - 1 && (
                <div className="w-0.5 h-12 bg-gray-200 ml-2 -mr-4" />
              )}
            </div>
          );
        })}
      </div>

      {/* Route summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-600">Restaurants</p>
            <p className="text-lg font-bold text-gray-900">
              {stops.filter(s => s.type === 'restaurant').length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Total Distance</p>
            <p className="text-lg font-bold text-gray-900">
              {totalDistance.toFixed(2)} km
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Est. Time</p>
            <p className="text-lg font-bold text-gray-900">
              {Math.ceil((totalDistance / 30) * 60)} min
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StopList;
