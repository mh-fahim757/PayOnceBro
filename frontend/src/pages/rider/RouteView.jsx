import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import StopList from '../../components/rider/StopList';
import NavigationButton from '../../components/rider/NavigationButton';

const RouteView = () => {
  const [searchParams] = useSearchParams();
  const clusterId = searchParams.get('clusterId');
  
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeClusterId, setActiveClusterId] = useState(clusterId);

  // If no clusterId in query, fetch rider's current active assignment
  useEffect(() => {
    const fetchActiveAssignment = async () => {
      if (clusterId) {
        // Use the provided clusterId
        setActiveClusterId(clusterId);
        return;
      }

      try {
        // Fetch assignments to find an active one
        const response = await api.get('/rider/assignments');
        const assignments = response.data.assignments || response.data || [];
        
        console.log('📍 Assignments fetched:', assignments);
        
        if (assignments.length === 0) {
          setError('No active assignments. Accept an order first.');
          return;
        }

        // Find first active assignment with a cluster
        const active = assignments.find(a => {
          console.log(`Checking assignment: id=${a.id}, cluster_id=${a.cluster_id}, status=${a.status}`);
          return a.cluster_id && ['accepted', 'preparing', 'pickup', 'on_the_way'].includes(a.status);
        });
        
        console.log('📍 Active assignment found:', active);
        
        if (active && active.cluster_id) {
          setActiveClusterId(active.cluster_id);
        } else {
          setError('No active cluster assignment found. Start an order first.');
        }
      } catch (err) {
        setError('Failed to fetch assignments');
        console.error('Assignment fetch error:', err);
      }
    };

    fetchActiveAssignment();
  }, [clusterId]);

  // Fetch route optimization data
  useEffect(() => {
    const fetchRoute = async () => {
      if (!activeClusterId) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/rider/route/${activeClusterId}`);
        setRoute(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load route');
        console.error('Route fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [activeClusterId]);

  if (!activeClusterId && !error) {
    return (
      <div className="p-8">
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          Loading route...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Route Optimization</h1>
          <p className="text-gray-600 mt-2">Your optimized pickup and delivery route</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
            Optimizing your route...
          </div>
        )}

        {/* Route Content */}
        {route && (
          <div className="space-y-6">
            {/* Stop List */}
            <StopList
              stops={route.orderedStops || []}
              totalDistance={route.totalDistance || 0}
              isLoading={loading}
            />

            {/* Navigation Button */}
            <NavigationButton
              mapsUrl={route.mapsUrl}
              totalDistance={route.totalDistance}
            />

            {/* Route Info Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3">Route Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Follow the numbered stops in order for the shortest route</li>
                <li>✓ Pickup all items from each restaurant before moving to the next</li>
                <li>✓ Deliver the complete order to the customer at the final stop</li>
                <li>✓ Click "Start Navigation" to open Google Maps</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteView;