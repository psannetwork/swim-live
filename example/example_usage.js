const SwimScraper = require('../../swim-live');

(async () => {
  // 大会一覧を取得
  const games = await SwimScraper.getMemberGroupGames(21);
  console.log('大会一覧:', games);

  // 特定大会の試合スケジュールを取得
  const races = await SwimScraper.getRaceListByGameDate('2125211', '2025-07-05');
  console.log('試合スケジュール:', races);

  // 特定ヒートの結果を取得
  const results = await SwimScraper.getRaceResults('3824703', '8', '10');
  console.log('ヒート結果:', results);

  // CSVに出力
  SwimScraper.exportToCSV(results, 'race_results.csv');
})();