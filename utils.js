function decodeUnicode(str) {
  return str.replace(/\\u([\da-f]{4})/gi, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
}

module.exports = { decodeUnicode };