export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  const hostname = typeof window !== 'undefined' && window.location?.hostname ? window.location.hostname : 'localhost';
  return `http://${hostname}:8080/api`;
};

export const getWsUrl = (path = '') => {
  if (import.meta.env.VITE_WS_URL) {
    return `${import.meta.env.VITE_WS_URL}${path}`;
  }
  const protocol = typeof window !== 'undefined' && window.location?.protocol === 'https:' ? 'wss:' : 'ws:';
  const hostname = typeof window !== 'undefined' && window.location?.hostname ? window.location.hostname : 'localhost';
  return `${protocol}//${hostname}:8080${path}`;
};
