import axios from 'axios';
import { decodeUnicode } from '../utils';
import { SwimApiError, SwimNetworkError, SwimRateLimitError } from '../errors/errors';

const client = axios.create({
  timeout: 10000, // 10 seconds timeout
});

export async function fetchJson<T = any>(url: string): Promise<T> {
  try {
    const res = await client.get(url);
    
    // Check for rate limiting
    if (res.status === 429) {
      throw new SwimRateLimitError('Rate limit exceeded');
    }

    const data = typeof res.data === 'string' ? JSON.parse(decodeUnicode(res.data)) : res.data;
    return data as T;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 429) {
        throw new SwimRateLimitError('Rate limit exceeded');
      }
      throw new SwimApiError(
        `API request failed: ${err.message}`, 
        err.response?.status
      );
    }
    throw new SwimNetworkError(`Network error: ${err.message}`);
  }
}
