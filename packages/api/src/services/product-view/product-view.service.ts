import axios from 'axios';

const silentApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9100',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

silentApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    let sessionId = localStorage.getItem('_sid');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('_sid', sessionId);
    }
    config.headers['X-Session-ID'] = sessionId;
  }
  return config;
});

export class ProductViewService {
  static track(shopId: string, productId: string): void {
    silentApi.post(`/product-views/${shopId}/${productId}`).catch(() => {});
  }
}
