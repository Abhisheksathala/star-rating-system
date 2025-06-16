import { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
  const [msg, setMsg] = useState(null);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/update-password', form);
      setMsg({ type: 'success', text: 'Password updated – please log in again.' });
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      {msg && (
        <p className={msg.type === 'error' ? 'text-red-500' : 'text-green-600'}>{msg.text}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <input
          name="oldPassword"
          type="password"
          placeholder="Current Password"
          className="w-full p-2 border rounded"
          value={form.oldPassword}
          onChange={handleChange}
          required
        />
        <input
          name="newPassword"
          type="password"
          placeholder="New Password"
          className="w-full p-2 border rounded"
          value={form.newPassword}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
