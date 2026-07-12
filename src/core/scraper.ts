import axios from 'axios';
import { decodeUnicode } from '@utils';

export async function fetchJson(url: string): Promise<any> {
  try {
    const res = await axios.get(url);
    return typeof res.data === 'string' ? JSON.parse(decodeUnicode(res.data)) : res.data;
  } catch (err: any) {
    throw new Error(`Failed to fetch ${url}: ${err.message}`);
  }
}
