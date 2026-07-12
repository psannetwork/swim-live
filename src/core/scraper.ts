import axios from 'axios';
import { decodeUnicode } from '@utils';

export async function fetchJson(url: string): Promise<any> {
  try {
    const res = await axios.get(url);
    const data = typeof res.data === 'string' ? JSON.parse(decodeUnicode(res.data)) : res.data;
    return data || [];
  } catch (err: any) {
    console.error(`Error fetching ${url}:`, err.message);
    return [];
  }
}
