import { useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import AdminAddStore from './AdminAddStore';

const AdminStores = () => {
  const [stores, setStores] = useState([]);

  const fetchStores = useCallback(async () => {
    try {
      const res = await api.get('/admin/stores');
      setStores(res.data);
    } catch (err) {
      console.error('Failed to fetch stores', err);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Stores</h2>

      {/* Add Store Form */}
      <AdminAddStore onCreated={fetchStores} />

      <div className="overflow-x-auto bg-white rounded shadow p-4">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Owner</th>
              <th className="p-2 border">Avg Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td className="p-2 border">{store.name}</td>
                <td className="p-2 border">{store.email}</td>
                <td className="p-2 border">{store.address}</td>
                <td className="p-2 border">{store.owner || 'N/A'}</td>
                <td className="p-2 border">{store.rating}</td>
              </tr>
            ))}
            {stores.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  No stores found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStores;
