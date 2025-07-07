const axios = require('axios');
const { decodeUnicode } = require('./utils');

async function fetchJson(url) {
  try {
    const res = await axios.get(url);
    const data = typeof res.data === 'string' ? JSON.parse(decodeUnicode(res.data)) : res.data;
    return data || [];
  } catch (err) {
    console.error(`Error fetching ${url}:`, err.message);
    return [];
  }
}

module.exports = { fetchJson };