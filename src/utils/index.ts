export function decodeUnicode(str: string): string {
  return str.replace(/\\u([\da-f]{4})/gi, (_, hex: string) =>
    String.fromCharCode(parseInt(hex, 16))
  );
}