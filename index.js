const { fetchJson } = require('./scraper');
const { parseRaceResults } = require('./parser');

class SwimLiveScraper {
  static async getMemberGroupGames(groupCode) {
    const url = `https://live-results.swim.or.jp/api/games/member_group/${groupCode}`;
    return await fetchJson(url);
  }

  static async getRaceListByGameDate(gameCode, date) {
    const url = `https://live-results.swim.or.jp/api/race_heats/race_list/${gameCode}?game_date=${date}`;
    return await fetchJson(url);
  }

  static async getRaceResults(gameCode, programId, heat) {
    const url = `https://live-results.swim.or.jp/api/result/race?game_code=${gameCode}&program_id=${programId}&heat=${heat}&raceStatus=9`;
    const raw = await fetchJson(url);
    return parseRaceResults(raw);
  }

  static exportToCSV(data, filename) {
    const fs = require('fs');
    const csv = require('json2csv').parse;
    const csvData = csv(data);
    fs.writeFileSync(filename, csvData);
    console.log(`${filename} へ出力しました。`);
  }
}

module.exports = SwimLiveScraper;