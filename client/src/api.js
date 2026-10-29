const API_BASE = import.meta.env.VITE_API_URL || '';

export const api = async (path, method = 'GET', body) => {
  const t = localStorage.getItem('token');
  const r = await fetch(`${API_BASE}/api${path}`, {
    method, body: body && JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', ...(t && { Authorization: 'Bearer ' + t }) }
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.message || 'Something went wrong');
  return d;
};
