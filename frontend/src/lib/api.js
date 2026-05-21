const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  url = url.trim();
  
  // If the user forgot to add http:// or https://, prepend it automatically
  if (!/^https?:\/\//i.test(url)) {
    const isLocal = url.includes('localhost') || url.includes('127.0.0.1') || url.startsWith('192.168.');
    url = isLocal ? `http://${url}` : `https://${url}`;
  }
  
  // Strip trailing slashes
  return url.replace(/\/+$/, '');
};

const BASE_URL = getBaseUrl();

const getToken = () => localStorage.getItem('auth_token');

const request = async (method, path, body = null) => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'An error occurred');
  }
  return data;
};

const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  delete: (path) => request('DELETE', path),
};

export default api;
