import { useEffect, useState } from 'react';
import api from '../utils/api';

const AdminStores = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get('/admin/stores');
        setStores(res.data);
      } catch (err) {
        console.error('Failed to fetch stores', err);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Stores</h2>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Address</th>
              <th className="p-2">Owner</th>
              <th className="p-2">Avg Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id} className="text-center border-t">
                <td className="p-2">{store.name}</td>
                <td className="p-2">{store.email}</td>
                <td className="p-2">{store.address}</td>
                <td className="p-2">{store.owner || 'N/A'}</td>
                <td className="p-2">{store.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStores;
