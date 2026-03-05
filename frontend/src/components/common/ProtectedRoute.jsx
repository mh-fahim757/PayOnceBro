import { Navigate, Outlet } from 'react-router-dom';
import { UrlState } from '../../context/AuthContext';
import { BeatLoader } from 'react-spinners';

const ProtectedRoute = ({ role }) => {
  const { user, isAuthenticated, loading, isSessionLoaded } = UrlState();

  // Wait until the Supabase session has been checked before making a redirect decision
  if (loading || !isSessionLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
        <BeatLoader color="#1e293b" />
      </div>
    );
  }

  // Not logged in at all → send to auth
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Wrong role → send to auth
  if (role && user?.role !== role) {
    console.log('ProtectedRoute debugging: Expected role:', role, 'but got user:', user);
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
