import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UrlProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import RiderLayout from './components/layouts/RiderLayout';
import Dashboard from './pages/rider/Dashboard';
import RouteView from './pages/rider/RouteView';
import Earnings from './pages/rider/Earnings';
import Auth from './pages/auth/Auth';

function App() {
  return (
    <BrowserRouter>
      <UrlProvider>
        <Routes>
          {/* Auth page — Login & Register tabs */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Navigate to="/auth" replace />} />

          {/* Protected Rider Routes */}
          <Route element={<ProtectedRoute role="rider" />}>
            <Route path="/rider" element={<RiderLayout />}>
              {/* Redirect /rider to /rider/dashboard automatically */}
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="route" element={<RouteView />} />
              <Route path="earnings" element={<Earnings />} />
            </Route>
          </Route>

          {/* Catch-all for 404s */}
          <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Routes>
      </UrlProvider>
    </BrowserRouter>
  );
}

export default App;