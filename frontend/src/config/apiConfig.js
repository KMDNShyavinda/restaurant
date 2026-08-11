export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    // In production, use relative URL so Nginx proxies it via Port 80
    return '/api';
  }
  
  return 'http://localhost:8080/api';
};

export const getWsUrl = (path = '') => {
  if (import.meta.env.VITE_WS_URL) {
    return `${import.meta.env.VITE_WS_URL}${path}`;
  }
  
  const protocol = typeof window !== 'undefined' && window.location?.protocol === 'https:' ? 'wss:' : 'ws:';
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const port = typeof window !== 'undefined' && window.location?.port ? `:${window.location.port}` : '';
  
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    // In production, Nginx proxies WebSocket over the same port
    return `${protocol}//${hostname}${port}${path}`;
  }
  
  return `ws://localhost:8080${path}`;
};
