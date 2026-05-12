# Sample Data

MVP開発時に使うサンプルデータ。

実装段階では、この内容をもとに `src/data/sampleItems.ts` を作る。

## TypeScript sample

```ts
import type { PocketItem } from "../types/PocketItem";

export const sampleItems: PocketItem[] = [
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
  },
  {
    id: "2",
    itemName: "ケチャップ",
    makerName: "カゴメ",
    categoryName: "調味料",
    productDetail: "トマトケチャップ 500g",
    lastPurchasedAt: "2026-04-20",
    memo: "デルモンテではなくカゴメ。",
    createdAt: "2026-04-20T09:00:00.000Z",
    updatedAt: "2026-04-20T09:00:00.000Z"
  },
  {
    id: "3",
    itemName: "にんにくチューブ",
    makerName: "S&B",
    categoryName: "チューブ調味料",
    productDetail: "おろし生にんにく 43g",
    lastPurchasedAt: "2026-04-10",
    memo: "大容量ではなく普通サイズ。",
    createdAt: "2026-04-10T09:00:00.000Z",
    updatedAt: "2026-04-10T09:00:00.000Z"
  },
  {
    id: "4",
    itemName: "しょうがチューブ",
    makerName: "S&B",
    categoryName: "チューブ調味料",
    productDetail: "おろし生しょうが 40g",
    lastPurchasedAt: "2026-04-12",
    memo: "にんにくと同じメーカーで揃える。",
    createdAt: "2026-04-12T09:00:00.000Z",
    updatedAt: "2026-04-12T09:00:00.000Z"
  },
  {
    id: "5",
    itemName: "マヨネーズ",
    makerName: "キユーピー",
    categoryName: "調味料",
    productDetail: "キユーピー マヨネーズ 450g",
    lastPurchasedAt: "2026-04-25",
    memo: "ハーフではなく普通のもの。",
    createdAt: "2026-04-25T09:00:00.000Z",
    updatedAt: "2026-04-25T09:00:00.000Z"
  }
];
```

## 注意

このファイルはドキュメント用。

実装時には Codex が以下のファイルを作る。

```txt
src/data/sampleItems.ts
```