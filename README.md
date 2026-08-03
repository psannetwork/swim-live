# swim-live-scraper

JASF公式水泳大会のライブスコアAPIおよびV1 APIからデータを取得するライブラリで、型安全で正規化されたデータ構造を提供します。

## インストール

```bash
npm install swim-live-scraper
```

## 使用方法

```typescript
import { SwimLiveScraper } from 'swim-live-scraper';

// 例: 正規化されたゲームリストを取得（マスターデータを自動統合）
const games = await SwimLiveScraper.getGames();
console.log(games); 
// NormalizedGame[]を返却: { game_name, group_name, status_label, ... }

// 例: V1アスリートを検索
const athletes = await SwimLiveScraper.searchAthletes({ 
  name: '田中', 
  school_class_code: 1, 
  gender_code: 1 
});

// 例: 特定日付のレースヒートリストを取得
const raceHeats = await SwimLiveScraper.getRaceHeatsListByGameDate('1234567', '2026-08-01');
console.log(raceHeats);
// NormalizedRace[]を返却: { program_id, race_name, class_name, division_name, ... }
```

## ドキュメント

詳細については[APIドキュメント](docs/API.md)を参照してください。