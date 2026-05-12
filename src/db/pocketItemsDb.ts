import Dexie, { type Table } from "dexie";
import { sampleItems } from "../data/sampleItems";
import type { PocketItem, PocketItemInput } from "../types/PocketItem";

class PocketItemsDatabase extends Dexie {
  pocketItems!: Table<PocketItem, string>;

  constructor() {
    super("pocket-maker-note");

    this.version(1).stores({
      pocketItems:
        "id, itemName, makerName, categoryName, lastPurchasedAt, updatedAt"
    });
  }
}

export const pocketItemsDb = new PocketItemsDatabase();
const sampleSeededKey = "pocket-maker-note:sample-seeded";

const createItemId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `item_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

const normalizeInput = (input: PocketItemInput): PocketItemInput => ({
  itemName: input.itemName.trim(),
  makerName: input.makerName.trim(),
  categoryName: input.categoryName.trim(),
  productDetail: input.productDetail.trim(),
  photoDataUrl: input.photoDataUrl,
  lastPurchasedAt: input.lastPurchasedAt,
  memo: input.memo.trim()
});

export const listPocketItems = async () => {
  return pocketItemsDb.pocketItems.orderBy("updatedAt").reverse().toArray();
};

export const getPocketItem = async (id: string) => {
  return pocketItemsDb.pocketItems.get(id);
};

export const addPocketItem = async (input: PocketItemInput) => {
  const now = new Date().toISOString();
  const item: PocketItem = {
    id: createItemId(),
    ...normalizeInput(input),
    createdAt: now,
    updatedAt: now
  };

  await pocketItemsDb.pocketItems.add(item);
  return item;
};

export const updatePocketItem = async (
  id: string,
  input: PocketItemInput
) => {
  const existing = await getPocketItem(id);

  if (!existing) {
    throw new Error("Pocket item was not found.");
  }

  const updatedItem: PocketItem = {
    ...existing,
    ...normalizeInput(input),
    updatedAt: new Date().toISOString()
  };

  await pocketItemsDb.pocketItems.put(updatedItem);
  return updatedItem;
};

export const deletePocketItem = async (id: string) => {
  await pocketItemsDb.pocketItems.delete(id);
};

export const seedPocketItemsIfEmpty = async () => {
  const wasSeeded = globalThis.localStorage?.getItem(sampleSeededKey);

  if (wasSeeded === "true") {
    return;
  }

  const itemCount = await pocketItemsDb.pocketItems.count();

  if (itemCount > 0) {
    globalThis.localStorage?.setItem(sampleSeededKey, "true");
    return;
  }

  await pocketItemsDb.pocketItems.bulkPut(sampleItems);
  globalThis.localStorage?.setItem(sampleSeededKey, "true");
};
