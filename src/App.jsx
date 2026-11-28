import { useState } from 'react';
import MinesPage from './pages/MinesPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { loginUser } from './services/authService.js';
import { clearAuthToken, getAuthToken } from './services/axiosInstance.js';

export default function App() {
  const [authenticated, setAuthenticated] = useState(Boolean(getAuthToken()));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [account, setAccount] = useState(null);

  async function handleLogin(credentials) {
    setLoading(true);
    setError('');
    try {
      const response = await loginUser(credentials);
      if (!getAuthToken()) {
        const token = response?.data?.token ?? response?.token ?? response?.login_token ?? response?.accessToken ?? response?.authToken;
        if (!token) throw new Error('Login response did not include an auth token.');
      }
      setAccount(response?.data ?? response);
      setAuthenticated(true);
    } catch (err) {
      clearAuthToken();
      const serverMessage = err.payload?.message ?? err.payload?.error;
      setError(typeof serverMessage === 'string' ? serverMessage : err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return authenticated
    ? <MinesPage initialAccount={account} onLogout={() => { clearAuthToken(); setAccount(null); setAuthenticated(false); }} />
    : <LoginPage onLogin={handleLogin} loading={loading} error={error} />;
}
