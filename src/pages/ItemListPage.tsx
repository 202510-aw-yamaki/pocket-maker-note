import { useEffect, useState } from "react";
import ItemCard from "../components/ItemCard";
import { listPocketItems, seedPocketItemsIfEmpty } from "../db/pocketItemsDb";
import type { PocketItem } from "../types/PocketItem";

export default function ItemListPage() {
  const [items, setItems] = useState<PocketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      try {
        await seedPocketItemsIfEmpty();
        const storedItems = await listPocketItems();
        setItems(storedItems);
      } catch (error) {
        setErrorMessage("商品データを読み込めませんでした。");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadItems();
  }, []);

  return (
    <main className="min-h-screen bg-sky-50 text-gray-950">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-6 pt-5">
        <header className="mb-5 space-y-2">
          <p className="text-sm font-bold text-teal-800">
            いつものメーカー帳
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-normal">
            いつもの商品を確認
          </h1>
          <p className="text-base leading-7 text-gray-700">
            メーカー・サイズ・写真を店頭ですぐ見返せます。
          </p>
        </header>

        {isLoading ? (
          <p className="rounded-lg bg-white p-4 text-gray-700">
            読み込み中です。
          </p>
        ) : null}

        {errorMessage ? (
          <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            {errorMessage}
          </p>
        ) : null}

        {!isLoading && !errorMessage ? (
          <section className="space-y-3" aria-label="登録済み商品">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}
