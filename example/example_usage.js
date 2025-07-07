const SwimScraper = require('../index');

(async () => {
  try {
    // 大会一覧取得（member_group_code: 21）
    const games = await SwimScraper.getMemberGroupGames(21);
    //console.log('大会一覧:', games);

    // 指定日の試合スケジュール取得（game_code: 2125211, 日付: 2025-07-05）
    const races = await SwimScraper.getRaceListByGameDate('2125211', '2025-07-05');
    //console.log('試合スケジュール:', races);

    // 選手名「小松 葵」で検索（game_code: 3824703）
    const searchedRaces = await SwimScraper.getSearchedRaces('3824703', '玉井　淳規', null, null);
    console.log('選手名が出場したヒート:', searchedRaces);

    // 所属名「LIBERO」で検索（game_code: 3824703）
    const searchedByTeam = await SwimScraper.getSearchedRaces('3824703', null, 'LIBERO', null);
    //console.log('所属「LIBERO」のヒート:', searchedByTeam);

    // 種目「個人メドレー」で検索（game_code: 3824703）
    const searchedByEvent = await SwimScraper.getSearchedRaces('3824703', null, null, '個人メドレー');
    //console.log('種目「個人メドレー」のヒート:', searchedByEvent);

    // 全条件指定で検索（複合検索）
    const fullSearch = await SwimScraper.getSearchedRaces('3824703', '中川 彩映', '南海DC', '個人メドレー');
    //console.log('複合検索結果:', fullSearch);

  } catch (error) {
    console.error('エラー:', error.message);
  }
})();