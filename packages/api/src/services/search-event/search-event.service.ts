import axios from 'axios';

const silentApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9100',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export class SearchEventService {
  static track(shopId: string, keyword: string): void {
    if (!keyword?.trim()) return;
    silentApi
      .post(`/search-events/${shopId}`, { keyword: keyword.trim().toLowerCase() })
      .catch(() => {});
  }
}
