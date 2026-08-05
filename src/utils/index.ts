export function decodeUnicode(str: string): string {
  return str.replace(/\\u([\da-f]{4})/gi, (_, hex: string) =>
    String.fromCharCode(parseInt(hex, 16))
  );
}

export class SimpleCache {
  private static cache = new Map<string, { data: any; expiry: number }>();

  static get(key: string) {
    const entry = this.cache.get(key);
    if (!entry || entry.expiry < Date.now()) return null;
    return entry.data;
  }

  static set(key: string, data: any, ttlMs: number) {
    this.cache.set(key, { data, expiry: Date.now() + ttlMs });
  }
}