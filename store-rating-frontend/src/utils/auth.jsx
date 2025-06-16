import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function RedirectToRoleDashboard() {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  switch (user.role) {
    case 'ADMIN':
      return <Navigate to="/admin" />;
    case 'USER':
      return <Navigate to="/user" />;
    case 'STORE_OWNER':
      return <Navigate to="/store-owner" />;
    default:
      return <div>Invalid role</div>;
  }
}

export default RedirectToRoleDashboard;
