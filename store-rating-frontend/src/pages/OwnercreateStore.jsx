import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OwnerCreateStore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [msg, setMsg] = useState(null);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/stores', { ...form, ownerId: user.id });
      setMsg({ type: 'success', text: 'Store created!' });
      setTimeout(() => navigate('/store-owner'), 1000);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Creation failed' });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Your Store</h2>
      {msg && (
        <p className={msg.type === 'error' ? 'text-red-500' : 'text-green-600'}>{msg.text}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <input
          name="name"
          placeholder="Store Name"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Contact Email"
          className="w-full p-2 border rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="address"
          placeholder="Store Address"
          className="w-full p-2 border rounded"
          value={form.address}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Create Store
        </button>
      </form>
    </div>
  );
};

export default OwnerCreateStore;
