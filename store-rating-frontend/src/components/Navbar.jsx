import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>
        🏪 Store Rating App
      </h1>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm px-2 py-1 bg-gray-100 rounded">
            Role: <strong>{user.role}</strong>
          </span>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
