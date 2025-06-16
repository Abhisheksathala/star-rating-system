import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    userCount: 0,
    storeCount: 0,
    ratingCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [logout, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
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

      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-2xl text-blue-600">{stats.userCount}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Total Stores</h2>
            <p className="text-2xl text-green-600">{stats.storeCount}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Total Ratings</h2>
            <p className="text-2xl text-purple-600">{stats.ratingCount}</p>
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Manage Users
        </button>
        <button
          onClick={() => navigate('/admin/stores')}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Manage Stores
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
