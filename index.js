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
    const { Parser } = require('json2csv');
    
    if (!data || data.length === 0) {
      console.warn("データが空です。デフォルトのヘッダーのみで出力します。");
      
      const defaultFields = [
        "swimmer_name", "entry_group_name1", "heat", "lane",
        "game_code", "program_id", "display_program_id", "distance",
        "race_date", "status_name", "result_time"
      ];
      const parser = new Parser({ fields: defaultFields });
      const csv = parser.parse([]);
      
      fs.writeFileSync(filename, csv);
      console.log(`${filename} へ空のCSVを出力しました。`);
      return;
    }

    try {
      const parser = new Parser();
      const csv = parser.parse(data);
      fs.writeFileSync(filename, csv);
      console.log(`${filename} へ出力しました。`);
    } catch (err) {
      console.error("CSV出力中にエラー:", err.message);
    }
  }
}

module.exports = SwimLiveScraper;