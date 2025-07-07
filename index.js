const { fetchJson } = require('./scraper');
const { parseRaceResults } = require('./parser');

class SwimLiveScraper {
  static async getMemberGroupGames(groupCode) {
    const url = `https://live-results.swim.or.jp/api/games/member_group/${groupCode}`;
    return await fetchJson(url);
  }

  static async getGameDetails(gameCode) {
    const url = `https://live-results.swim.or.jp/api/games/${gameCode}`;
    return await fetchJson(url);
  }

  static async getRaceListByGameDate(gameCode, date) {
    const url = `https://live-results.swim.or.jp/api/race_heats/race_list/${gameCode}?game_date=${date}`;
    return await fetchJson(url);
  }

  static async getRaceStatus(gameCode, programId, heat) {
    const url = `https://live-results.swim.or.jp/api/race_heats/race?game_code=${gameCode}&program_id=${programId}&heat=${heat}`;
    return await fetchJson(url);
  }

  static async getRaceResults(gameCode, programId, heat) {
    const url = ` https://live-results.swim.or.jp/api/result/race?game_code=${gameCode}&program_id=${programId}&heat=${heat}&raceStatus=9`;
    const raw = await fetchJson(url);
    return parseRaceResults(raw);
  }

  // 🔍 新規追加：選手名・所属・種目名でヒート情報検索
  static async getSearchedRaces(gameCode, playerName = null, belongName = null, eventName = null) {
    let url = ` https://live-results.swim.or.jp/api/race_heats/searchedRaceHeats/${gameCode}`;
    const params = [];

    if (playerName) params.push(`playerName=${encodeURIComponent(playerName)}`);
    if (belongName) params.push(`belongName=${encodeURIComponent(belongName)}`);
    if (eventName) params.push(`eventName=${encodeURIComponent(eventName)}`);

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    return await fetchJson(url);
  }

  static exportToCSV(data, filename) {
    const fs = require('fs');
    const json2csv = require('json2csv').parse;
    const csvData = json2csv(data);
    fs.writeFileSync(filename, csvData);
    console.log(`${filename} へ出力しました。`);
  }
}

module.exports = SwimLiveScraper;