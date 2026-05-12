const API_BASE = 'http://localhost:5000';

const api = {
  get: async (endpoint) => {
    const token = localStorage.getItem('bookbazaar_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await fetch(`${API_BASE}${endpoint}`, { headers });
    return res.json();
  },
  post: async (endpoint, data, isFormData = false) => {
    const token = localStorage.getItem('bookbazaar_token');
    const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    return res.json();
  },
  put: async (endpoint, data, isFormData = false) => {
    const token = localStorage.getItem('bookbazaar_token');
    const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    return res.json();
  },
  delete: async (endpoint) => {
    const token = localStorage.getItem('bookbazaar_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    return res.json();
  }
};

export default api;
export { API_BASE };
