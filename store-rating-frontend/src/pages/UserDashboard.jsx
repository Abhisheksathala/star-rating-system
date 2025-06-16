import { useEffect, useState } from 'react';
import api from '../utils/api';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await api.get('/user/stores', { params: search });
      setStores(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load stores', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search.name, search.address]);

  const handleRating = async (storeId, score, hasRated) => {
    try {
      if (hasRated) {
        await api.put('/user/rate', { storeId, score });
      } else {
        await api.post('/user/rate', { storeId, score });
      }
      fetchStores(); // Refresh after rating
    } catch (err) {
      alert('Rating failed: ' + err.response?.data?.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Store Ratings</h2>

      <div className="flex gap-4 mb-4">
        <input
          placeholder="Search Name"
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
          className="input"
        />
        <input
          placeholder="Search Address"
          value={search.address}
          onChange={(e) => setSearch({ ...search, address: e.target.value })}
          className="input"
        />
        <button onClick={fetchStores} className="btn">
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {stores.map((store) => (
          <div key={store.id} className="border p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold">{store.name}</h3>
            <p className="text-gray-600">{store.address}</p>
            <p>
              ⭐ Overall Rating: <strong>{store.overallRating}</strong>
            </p>
            <p>
              Your Rating:
              {store.userRating ? ` ⭐ ${store.userRating}` : ' Not rated yet'}
            </p>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() => handleRating(store.id, score, !!store.userRating)}
                  className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded"
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
