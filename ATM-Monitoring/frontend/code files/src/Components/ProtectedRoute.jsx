import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated, selectRole } from '../redux/userSlice';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectRole);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles || allowedRoles.includes(userRole)) {
    return children;
  }

  return <Navigate to={userRole === 'TECHNICIAN' ? '/analytics' : '/dashboard'} />;
};

export default ProtectedRoute;