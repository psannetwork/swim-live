もちろんです。以下に、**既存の API ドキュメントに新たなエンドポイント `/api/race_heats/searchedRaceHeats/{game_code}?playerName={}&belongName={}&eventName={}`** を追加した **完全なドキュメント** を記載します。

---

# 📄 API ドキュメント（日本語版）  
## タイトル：`live-results.swim.or.jp 公式水泳大会ライブ結果配信システム API Document`

---

## 1. 概要

本システムは、日本の水泳大会で使用される公式ライブスコア・レース結果配信システムです。  
選手情報、ヒート情報、タイム結果、ラップタイム、反応時間などをJSON形式で取得できます。

- URL: https://live-results.swim.or.jp/  
- 提供形態: REST API + JSON
- 対象者: 大会運営者、コーチ、観客、開発者など

---

## 2. 基本的な仕組みとデータ構造

### 大会構造

```
member_group → game → race_list → race → result
```

| 階層 | 説明 |
|------|------|
| `member_group` | 地域や団体単位（例：静岡県 = code=21） |
| `game` | 大会ごとの詳細情報（例：東部中部地区予選会） |
| `race_list` | 日付ごとの試合一覧（種目、日時、性別など） |
| `race` | 各ヒートの進行状況と設定情報 |
| `result` | 各ヒートの実際の結果（タイム、順位、所属など） |

---

## 3. API エンドポイント一覧

### ① `/api/games/member_group/{group_code}`  
**目的:** 地域または団体に属する大会一覧を取得  
**メソッド:** GET  
**例:**  
```bash
GET /api/games/member_group/21
```

#### レスポンス例：
```json
[
  {
    "game_code": "2125211",
    "member_group_code": "21",
    "game_name": "静岡：静岡県中学総合体育大会水泳の部 東部・中部地区予選会",
    "date_start": "2025-07-05",
    "date_end": "2025-07-06"
  },
  ...
]
```

---

### ② `/api/games/{game_code}`  
**目的:** 特定の大会の詳細情報を取得  
**メソッド:** GET  
**例:**  
```bash
GET /api/games/2125211
```

#### レスポンス例：
```json
{
  "game_code": "2125211",
  "game_name": "静岡：静岡県中学総合体育大会水泳の部 東部・中部地区予選会",
  "pool": "静岡県富士市",
  "lane_num_preliminary_round": 10,
  "touchpad": 1
}
```

---

### ③ `/api/race_heats/race_list/{game_code}?game_date={YYYY-MM-DD}`  
**目的:** 大会内の指定日の試合スケジュールを取得  
**メソッド:** GET  
**例:**  
```bash
GET /api/race_heats/race_list/2125211?game_date=2025-07-05
```

#### レスポンス例：
```json
[
  {
    "program_id": "6",
    "swimming_style_name": "自由形",
    "distance_name": "50m",
    "gender_name": "男子",
    "heat": "10",
    "game_time": "10:21:00"
  },
  ...
]
```

---

### ④ `/api/race_heats/race`  
**目的:** 各ヒートの進行状況と公開設定を取得  
**メソッド:** GET  
**パラメータ:** `game_code`, `program_id`, `heat`  
**例:**  
```bash
GET /api/race_heats/race?game_code=3824703&program_id=8&heat=10
```

#### レスポンス例：
```json
{
  "is_finished": "true",
  "has_reaction_time": "true",
  "has_lap_time": "true",
  "race_publishing_setting_detail": "組レース成立後即時公開"
}
```

---

### ⑤ `/api/result/race`  
**目的:** 各ヒートの選手ごとの結果を取得  
**メソッド:** GET  
**パラメータ:** `game_code`, `program_id`, `heat`, `raceStatus`  
**例:**  
```bash
GET /api/result/race?game_code=3824703&program_id=8&heat=10&raceStatus=9
```

#### レスポンス例：
```json
[
  {
    "rank": 1,
    "swimmer_name": "小松 葵",
    "school_name": "高校",
    "entry_group_name1": "LIBERO",
    "result_time": "2:16.57",
    "reaction_time": "0.60",
    "lap50": "29.22",
    "lap100": "1:07.82"
  },
  ...
]
```

---

### 🔸 新規追加エンドポイント ⑥  
## `/api/race_heats/searchedRaceHeats/{game_code}?playerName={}&belongName={}&eventName={}`

---

### ✅ 目的:
選手名、所属名、種目名から検索し、該当する**出場予定・過去のヒート情報**を取得します。

---

### 📌 メソッド:
```http
GET
```

---

### 🧩 パラメータ:

| パラメータ名 | 必須 | 説明 |
|--------------|------|------|
| `game_code` | 必須 | 大会の一意のコード（例: `3824703`） |
| `playerName` | 任意 | 選手名（例: `吉田花子`） |
| `belongName` | 任意 | 所属名（例: `XXXXXクラブ`） |
| `eventName` | 任意 | 種目名（例: `個人メドレー`） |

---

### 📌 使用例:

#### 例1：選手名のみで検索
```bash
GET /api/race_heats/searchedRaceHeats/3824703?playerName=%E4%B8%AD%E5%B7%9D%E3%80%80%E5%BD%A9%E6%98%A0
```

> 注：日本語文字列はURLエンコードされています。

---

### 📦 レスポンス構造:

```json
[
  {
    "swimmer_name": "吉田花子",
    "entry_group_name1": "XXXXXクラブ",
    "entry_group_name2": null,
    "entry_group_name3": null,
    "heat": 1,
    "lane": 4,
    "game_code": "3824703",
    "program_id": "7",
    "display_program_id": "1",
    "swimming_style_code": "5",
    "swimming_style_name": "個人メドレー",
    "distance": "200",
    "distance_name": "200m",
    "race_division_name": "タイム決勝",
    "gender_code": "2",
    "gender_name": "女子",
    "class_name": "無差別",
    "game_time": null,
    "race_date": "2025-07-07",
    "race_status": "9"
  },
  ...
]
```

---

### 🧭 各フィールドの説明:

| フィールド名 | 型 | 説明 |
|--------------|----|------|
| `swimmer_name` | string | 選手名 |
| `entry_group_name*` | string/null | 所属団体名（複数あり） |
| `heat` | integer | ヒート番号 |
| `lane` | integer | 使用レーン |
| `game_code` | string | 大会の一意な識別子 |
| `program_id` | string | 内部種目ID |
| `display_program_id` | string | 表示用種目ID |
| `swimming_style_code` | integer | 泳法コード（1: 自由形、2: 背泳ぎ、5: 個人メドレーなど） |
| `swimming_style_name` | string | 泳法の日本語名称 |
| `distance` | string | 距離（m） |
| `distance_name` | string | 表示用距離名（例："50m"） |
| `race_division_name` | string | レース区分（例："タイム決勝"など） |
| `gender_code` | integer | 性別のコード（1: 男子、2: 女子） |
| `gender_name` | string | 性別の日本語名称 |
| `class_name` | string | クラス名（例："無差別"など） |
| `game_time` | float/null | 記録（タイム）が入る。未記録時は`null` |
| `race_date` | date (YYYY-MM-DD) | レース開催日 |
| `race_status` | integer | レースのステータス（例：0=未実施、9=結果確定など） |

---

### 🧩 利用ユースケース:

| シナリオ | 説明 |
|----------|------|
| 🔍 選手の過去履歴照会 | 特定選手が出場した大会・種目を一括表示 |
| 📆 出場予定確認 | 選手が今後の大会でどの種目に登録されているかを確認 |
| 📊 所属チームの出場選手リスト | `belongName` で絞り込み、チーム全体の出場種目を一覧表示 |
| 📋 種目別出場選手一覧 | `eventName` で絞り込み、特定種目の出場者を抽出 |

---

### 🛑 注意点:

- **文字エンコード必須**: 日本語の選手名・所属名は**UTF-8 URLエンコード**が必要。
- **部分一致検索不可**: 完全一致での検索になるため、曖昧検索には対応していない。
- **null値の扱い**: 所属名2・3は空の場合があり、nullで返却される。

---

## 4. 公開設定（publishing_setting）

| 設定項目 | 内容 |
|----------|------|
| `startlist_publishing_setting_detail` | スタートリストの公開タイミング（例：登録後即時公開） |
| `relay_publishing_setting_detail` | リレー順の公開タイミング（例：スタート後公開） |
| `race_publishing_setting_detail` | 結果の公開タイミング（例：組レース成立後即時公開） |

---

## 5. ステータスコードと意味

| フィールド名 | 値 | 意味 |
|--------------|----|------|
| `is_finished` | true/false | 試合が終了しているか |
| `race_pub_status` | 0, 1, 9 | 結果の公開ステータス（0:非公開, 1:公開済, 9:待機中） |
| `status_text` | "データ登録完了"など | 状況説明文 |

---

## 6. 主な利用ユースケース

| ユースケース | 説明 |
|--------------|------|
| ✅ ライブスコア表示 | Webや大型ディスプレイにリアルタイム反映 |
| ✅ 成績分析 | ラップタイムや反応時間から技術分析 |
| ✅ 選手育成支援 | 過去データとの比較、成長トレンド把握 |
| ✅ 自動集計・CSV出力 | Excelでのランキング集計や印刷用PDF生成 |
| ✅ AIによるタイム予測 | 学習モデルを使って将来のタイムを予測 |

---

## 7. 注意点と制限事項

- **権限管理あり**：一部のAPIは管理者権限が必要
- **データ更新頻度**：結果反映は数秒〜数十秒遅延する場合あり
- **Unicode対応**：日本語文字列は `\uXXXX` 形式でエンコードされているため、デコードが必要

---

## 8. 参考資料

- [JASF 公式サイト](https://www.jasf.gr.jp/)
- [live-results.swim.or.jp](https://live-results.swim.or.jp/)
- JSONデコードツール: [https://www.jsondecoder.org/](https://www.jsondecoder.org/)

---

## 9. 今後の拡張提案

- GraphQL形式への対応
- CSVやExcel形式の自動出力機能
- データビジュアル化ダッシュボード
- LINEやSlack通知連携
- モバイルアプリSDK提供（iOS/Android）

---

# 📝 最後に

このドキュメントは、**競技水泳のライブ配信API** に関する基礎知識と利用方法を網羅したものです。  

特に新たに追加された `/api/race_heats/searchedRaceHeats/{game_code}?playerName={}&belongName={}&eventName={}` は、選手・所属・種目名からヒート情報を検索可能にする強力なエンドポイントです。

今後の統合やアプリケーション開発において、活用いただけることを願っています！

--- 