import React from 'react';

/**
 * NavigationButton — Button to open Google Maps navigation
 * 
 * Props:
 *   - mapsUrl: string (Google Maps URL)
 *   - totalDistance: number (in km)
 */
const NavigationButton = ({ mapsUrl = '', totalDistance = 0 }) => {
  const handleNavigate = () => {
    if (mapsUrl) {
      window.open(mapsUrl, '_blank');
    }
  };

  return (
    <button
      onClick={handleNavigate}
      disabled={!mapsUrl}
      className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
        mapsUrl
          ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
          : 'bg-gray-400 cursor-not-allowed opacity-50'
      }`}
    >
      <span className="flex items-center justify-center gap-2">
        <span>🗺️</span>
        <span>Start Navigation</span>
        {totalDistance > 0 && (
          <span className="text-sm">({totalDistance.toFixed(1)} km)</span>
        )}
      </span>
    </button>
  );
};

export default NavigationButton;
