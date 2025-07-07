# SwimLiveScraper README

`SwinLiveScraper` は、[日本水泳連盟ライブ結果配信サイト](https://live-results.swim.or.jp) から競技情報や種目結果を取得し、CSV形式で出力するためのNode.jsベースのライブラリです。API経由でデータを取得し、選手名や所属名、種目名などで検索することが可能です。

---

## 📦 概要

- 競技大会情報（日付別）の取得
- ヒートごとのレース状況と結果の取得
- 選手名・所属・種目名でのヒート検索機能
- 取得したデータをCSV形式で出力可能

---

## 🛠️ 使用技術 / 依存パッケージ

- Node.js
- `json2csv`：JSONデータをCSVに変換
- `fs`：ファイル操作（CSV出力）
- カスタムモジュール：
  - `scraper.js`: API通信処理
  - `parser.js`: レース結果の解析・整形
  - `utils.js`: 共通ユーティリティ関数

---

## 🧩 クラス構成

### `SwimLiveScraper`

メインクラスで、以下の静的メソッドを提供：

| メソッド名 | 説明 |
|-----------|------|
| `getMemberGroupGames(groupCode)` | 所属団体コードから大会一覧を取得 |
| `getGameDetails(gameCode)` | 大会コードから詳細情報を取得 |
| `getRaceListByGameDate(gameCode, date)` | 大会日付からレース一覧を取得 |
| `getRaceStatus(gameCode, programId, heat)` | 特定ヒートのレース状況を取得 |
| `getRaceResults(gameCode, programId, heat)` | レース結果を取得し、整形して返す |
| `getSearchedRaces(gameCode, playerName, belongName, eventName)` | 選手名・所属・種目名でレース情報を検索 |
| `exportToCSV(data, filename)` | 取得したデータをCSV形式で保存 |

---

## 📚 使い方

### 1. インストール

```bash
npm install
```

### 2. 基本的な使用例

#### 例: レース結果を取得してCSVに出力

```js
const { SwimLiveScraper } = require('swim-live-scraper');

(async () => {
  const gameCode = '2024TOK01';
  const programId = '101';
  const heat = '1';

  // レース結果を取得
  const results = await SwimLiveScraper.getRaceResults(gameCode, programId, heat);

  // CSVに出力
  SwimLiveScraper.exportToCSV(results, 'results.csv');
})();
```

#### 例: 選手名でレースを検索

```js
const gameCode = '2024TOK01';
const playerName = '山田太郎';

const races = await SwimLiveScraper.getSearchedRaces(gameCode, playerName);
console.log(races);
```

---

## 📁 ファイル構成

```
swim-live-scraper/
├── index.js                # エントリーポイント（メイン関数）
├── scraper.js              # 実際のスクレイピング・API呼び出し処理
├── parser.js               # JSON解析・整形処理
├── utils.js                # 共通ユーティリティ（例：Unicodeデコード）
├── package.json            # npm設定ファイル
├── README.md               # 説明書
└── examples/
    └── example_usage.js    # 使用例スクリプト
```

---

## 📄 出力されるCSVの主なフィールド

| フィールド名 | 内容 |
|-------------|------|
| `swimmer_name` | 選手名 |
| `entry_group_name1` | 所属名 |
| `heat` | ヒート番号 |
| `lane` | レーン番号 |
| `game_code` | 大会コード |
| `program_id` | 種目ID |
| `display_program_id` | 表示用種目ID |
| `distance` | 距離 |
| `race_date` | 競技日時 |
| `status_name` | ステータス（予選通過・失格など） |
| `result_time` | 結果タイム |

---

## ⚠️ 注意点

- すべてのAPIエンドポイントが**認証不要**ですが、利用規約に従ってください。
- 各URLには `${}` 形式のプレースホルダが含まれています。実際には適切な値に置き換えてください。
- **404エラー**が出る場合は、正しい大会コード・種目ID・ヒート番号を確認してください。

---

## 📝 License

MIT License

---

## 👥 問題報告・提案

GitHubリポジトリがある場合、IssueやPull Requestをお待ちしています！

--- 

以上です。