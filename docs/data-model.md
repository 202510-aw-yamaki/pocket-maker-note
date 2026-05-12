# Data Model

## Main entity: PocketItem

買い物中に確認したい1商品を表す。

## TypeScript model

```ts
export type PocketItem = {
  id: string;
  itemName: string;
  makerName: string;
  categoryName: string;
  productDetail: string;
  photoDataUrl?: string;
  lastPurchasedAt?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};
```

## Fields

### id

一意のID。

例:

```txt
"item_001"
```

実装時は `crypto.randomUUID()` などを使う。

### itemName

商品の一般名。

例:

```txt
醤油
ケチャップ
にんにくチューブ
しょうがチューブ
マヨネーズ
```

### makerName

メーカー名。

例:

```txt
キッコーマン
カゴメ
S&B
ハウス
キユーピー
```

このアプリの中心となる項目なので、必須扱いにする。

### categoryName

カテゴリー名。

例:

```txt
調味料
チューブ調味料
ソース類
日用品
洗剤
```

初期版では自由入力でよい。

### productDetail

商品名、型番、サイズ、バリエーションなど。

例:

```txt
特選 丸大豆しょうゆ 1L
トマトケチャップ 500g
おろし生にんにく 43g
減塩ではない普通タイプ
赤キャップのもの
```

### photoDataUrl

写真データ。

初期版では、画像を Data URL として IndexedDB に保存する。

例:

```txt
data:image/jpeg;base64,...
```

### lastPurchasedAt

最後に買った日。

形式:

```txt
YYYY-MM-DD
```

例:

```txt
2026-05-12
```

### memo

補足メモ。

例:

```txt
赤いキャップのやつ。減塩ではない。
大容量ではなく普通サイズ。
デルモンテではなくカゴメ。
```

### createdAt

作成日時。

ISO文字列で保存する。

例:

```txt
2026-05-12T09:00:00.000Z
```

### updatedAt

更新日時。

ISO文字列で保存する。

例:

```txt
2026-05-12T09:30:00.000Z
```

## Storage

MVPでは IndexedDB を使用する。

推奨ライブラリ:

```txt
Dexie.js
```

## IndexedDB table

Table name:

```txt
pocketItems
```

## Indexes

想定する検索・絞り込みのため、以下を考慮する。

```txt
id
itemName
makerName
categoryName
updatedAt
```

## Search target

検索対象は以下。

```txt
itemName
makerName
productDetail
memo
```

## Example object

```ts
{
  id: "1",
  itemName: "醤油",
  makerName: "キッコーマン",
  categoryName: "調味料",
  productDetail: "特選 丸大豆しょうゆ 1L",
  lastPurchasedAt: "2026-05-01",
  memo: "赤いキャップのやつ。減塩ではない。",
  createdAt: "2026-05-01T09:00:00.000Z",
  updatedAt: "2026-05-01T09:00:00.000Z"
}
```