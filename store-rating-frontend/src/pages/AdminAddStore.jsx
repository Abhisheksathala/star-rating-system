import { useEffect, useState } from 'react';
import api from '../utils/api';
// import { useNavigate } from 'react-router-dom';

const AdminAddStore = ({ onCreated }) => {
  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await api.get('/admin/users', { params: { role: 'STORE_OWNER' } });
        setOwners(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOwners();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/admin/stores', form);
      setSuccess('Store created successfully!');
      onCreated?.();
      setForm({ name: '', email: '', address: '', ownerId: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Creation failed');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Store</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Store Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Contact Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={2}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Store Owner</label>
          <select
            name="ownerId"
            value={form.ownerId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">— Select Owner —</option>
            {owners.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Store
        </button>
      </form>
    </div>
  );
};

export default AdminAddStore;
