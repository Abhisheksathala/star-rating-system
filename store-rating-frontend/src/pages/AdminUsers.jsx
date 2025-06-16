import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminUsers = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
  });
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v.trim() !== ''),
      );
      const res = await api.get('/admin/users', { params });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // initial load

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">User Management</h1>
        <button
          onClick={() => navigate('/admin')}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          ⬅ Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
        <input
          name="name"
          placeholder="Search by name"
          className="p-2 border rounded"
          value={filters.name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Search by email"
          className="p-2 border rounded"
          value={filters.email}
          onChange={handleChange}
        />
        <input
          name="address"
          placeholder="Search by address"
          className="p-2 border rounded"
          value={filters.address}
          onChange={handleChange}
        />
        <select
          name="role"
          className="p-2 border rounded"
          value={filters.role}
          onChange={handleChange}
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
      </div>

      <button
        onClick={handleSearch}
        className="mb-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        🔍 Search
      </button>

      <div className="overflow-x-auto bg-white rounded shadow p-4">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Rating</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.address}</td>
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 border text-center">
                  {user.role === 'STORE_OWNER' && user.rating ? user.rating : '-'}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
