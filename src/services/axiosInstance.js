import axios from 'axios';

const TOKEN_STORAGE_KEY = 'mines_auth_token';

/** Read token from URL (?token=...) once and persist, or read from localStorage. */
export function getAuthToken() {
  if (typeof window === 'undefined') return null;

  try {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token') || params.get('auth');
    if (urlToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, urlToken);
      return urlToken;
    }
    return (
      localStorage.getItem(TOKEN_STORAGE_KEY) ||
      localStorage.getItem('token') ||
      null
    );
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
    else localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem('token');
  } catch {
    // Ignore storage errors
  }
}

const axiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'https://api.wingo4all.site').replace(/\/+$/, ''),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach Bearer token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Unwrap data and normalize API errors
axiosInstance.interceptors.response.use(
  (response) => {
    const payload = response.data;
    if (payload?.success === false) {
      const err = new Error(payload.message || payload.error || 'Request failed');
      err.status = response.status;
      err.payload = payload;
      return Promise.reject(err);
    }
    return payload?.data !== undefined ? payload.data : payload;
  },
  (error) => {
    const status = error.response?.status;
    const payload = error.response?.data;

    if (status === 401) clearAuthToken();

    const rawMessage = payload?.message ?? payload?.error ?? error.message;
    const message = typeof rawMessage === 'string'
      ? rawMessage
      : Array.isArray(rawMessage)
        ? rawMessage.map((item) => typeof item === 'string' ? item : item?.message || JSON.stringify(item)).join(', ')
        : rawMessage && typeof rawMessage === 'object'
          ? rawMessage.message || Object.values(rawMessage).flat().map(String).join(', ')
          : `Request failed (${status || 'network'})`;
    const err = new Error(message);
    err.status = status;
    err.payload = payload;
    return Promise.reject(err);
  },
);

export default axiosInstance;
