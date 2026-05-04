import axios from 'axios';

const silentApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9100',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export class LinkClickService {
  static track(shopId: string): void {
    silentApi.post(`/link-click-events/${shopId}`).catch(() => {});
  }
}
