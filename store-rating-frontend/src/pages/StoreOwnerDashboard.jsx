import { useEffect, useState } from 'react';
import api from '../utils/api';

const StoreOwnerDashboard = () => {
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/store-owner/dashboard');
      setStoreInfo(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Store Dashboard</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {storeInfo && (
        <div className="border p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">{storeInfo.storeName}</h3>
          <p className="text-gray-600 mb-1">📍 {storeInfo.address}</p>
          <p className="mb-4">
            ⭐ Average Rating: <strong>{storeInfo.averageRating}</strong>
          </p>

          <h4 className="font-semibold mb-2">🧾 Submitted Ratings:</h4>
          {storeInfo.ratings.length === 0 && <p>No ratings yet.</p>}
          <ul className="space-y-2">
            {storeInfo.ratings.map((rating) => (
              <li key={rating.id} className="border p-2 rounded">
                <p>⭐ Score: {rating.score}</p>
                <p>
                  👤 By: {rating.submittedBy.name} ({rating.submittedBy.email})
                </p>
                <p className="text-sm text-gray-500">
                  🕒 {new Date(rating.submittedAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;
