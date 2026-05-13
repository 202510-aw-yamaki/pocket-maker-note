import { useEffect, useMemo, useState } from "react";
import CategoryFilter, {
  allCategory,
  type CategoryFilterOption
} from "../components/CategoryFilter";
import ItemCard from "../components/ItemCard";
import SearchBox from "../components/SearchBox";
import { resolvePocketItemCategoryIconKey } from "../data/categoryIconTemplates";
import { listPocketItems, seedPocketItemsIfEmpty } from "../db/pocketItemsDb";
import type { PocketItem } from "../types/PocketItem";

type ItemListPageProps = {
  onSelectItem: (itemId: string) => void;
  onAddItem: () => void;
};

export default function ItemListPage({
  onSelectItem,
  onAddItem
}: ItemListPageProps) {
  const [items, setItems] = useState<PocketItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(allCategory);
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

  const categories = useMemo<CategoryFilterOption[]>(() => {
    const categoryMap = new Map<string, CategoryFilterOption>();

    items.forEach((item) => {
      const categoryName = item.categoryName.trim();

      if (!categoryName || categoryMap.has(categoryName)) {
        return;
      }

      categoryMap.set(categoryName, {
        name: categoryName,
        iconKey: resolvePocketItemCategoryIconKey(item)
      });
    });

    return Array.from(categoryMap.values()).sort((current, next) =>
      current.name.localeCompare(next.name, "ja")
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === allCategory ||
        item.categoryName === selectedCategory;
      const searchableText = [
        item.itemName,
        item.makerName,
        item.productDetail,
        item.memo
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch =
        normalizedQuery.length === 0 ||
        searchableText.includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [items, searchQuery, selectedCategory]);

  return (
    <main className="min-h-screen bg-sky-50 text-gray-950">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-24 pt-5">
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

        <section className="sticky top-0 z-10 mb-4 space-y-3 bg-sky-50 pb-3">
          <SearchBox value={searchQuery} onChange={setSearchQuery} />
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </section>

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
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} onSelect={onSelectItem} />
            ))}
            {filteredItems.length === 0 ? (
              <p className="rounded-lg bg-white p-4 text-gray-700">
                該当する商品がありません。
              </p>
            ) : null}
          </section>
        ) : null}

        <button
          type="button"
          onClick={onAddItem}
          className="fixed bottom-5 right-5 z-20 min-h-14 rounded-full bg-teal-800 px-5 text-base font-bold text-white shadow-lg shadow-teal-900/20"
        >
          + 追加
        </button>
      </div>
    </main>
  );
}
