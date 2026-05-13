import { useEffect, useMemo, useState } from "react";
import CategoryFilter, {
  allCategory,
  type CategoryFilterOption
} from "../components/CategoryFilter";
import CategoryIcon from "../components/CategoryIcon";
import ItemCard from "../components/ItemCard";
import SearchBox from "../components/SearchBox";
import {
  categoryIconTemplates,
  getCategoryIconTemplate,
  getCategoryIconTone,
  resolvePocketItemCategoryIconKey
} from "../data/categoryIconTemplates";
import { listPocketItems, seedPocketItemsIfEmpty } from "../db/pocketItemsDb";
import type { PocketItem } from "../types/PocketItem";

type ItemListPageProps = {
  onSelectItem: (itemId: string) => void;
  onAddItem: () => void;
};

type LatestItemGroup = CategoryFilterOption & {
  latestItem: PocketItem;
};

const categoryOrder = new Map(
  categoryIconTemplates.map((template, index) => [template.key, index])
);

const getItemDateTime = (item: PocketItem) => {
  const dateValue = item.lastPurchasedAt || item.updatedAt;
  const time = new Date(dateValue).getTime();

  return Number.isNaN(time) ? 0 : time;
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
      const iconKey = resolvePocketItemCategoryIconKey(item);
      const category = categoryMap.get(iconKey);

      if (category) {
        category.count += 1;
        return;
      }

      categoryMap.set(iconKey, {
        value: iconKey,
        name: getCategoryIconTemplate(iconKey).label,
        iconKey,
        count: 1
      });
    });

    return Array.from(categoryMap.values()).sort((current, next) =>
      (categoryOrder.get(current.iconKey ?? "seasoning-other") ?? 999) -
      (categoryOrder.get(next.iconKey ?? "seasoning-other") ?? 999)
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === allCategory ||
        resolvePocketItemCategoryIconKey(item) === selectedCategory;
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

  const latestItemGroups = useMemo<LatestItemGroup[]>(() => {
    const groupMap = new Map<string, LatestItemGroup>();

    filteredItems.forEach((item) => {
      const iconKey = resolvePocketItemCategoryIconKey(item);
      const existingGroup = groupMap.get(iconKey);

      if (existingGroup) {
        existingGroup.count += 1;

        if (getItemDateTime(item) > getItemDateTime(existingGroup.latestItem)) {
          existingGroup.latestItem = item;
        }

        return;
      }

      groupMap.set(iconKey, {
        value: iconKey,
        name: getCategoryIconTemplate(iconKey).label,
        iconKey,
        count: 1,
        latestItem: item
      });
    });

    return Array.from(groupMap.values()).sort((current, next) =>
      (categoryOrder.get(current.iconKey ?? "seasoning-other") ?? 999) -
      (categoryOrder.get(next.iconKey ?? "seasoning-other") ?? 999)
    );
  }, [filteredItems]);

  return (
    <main className="min-h-screen bg-slate-50 text-gray-950">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-3 pb-24 pt-4">
        <header className="mb-3 flex min-h-11 items-center justify-between gap-3">
          <button
            type="button"
            aria-label="メニュー"
            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl font-bold text-gray-800"
          >
            ≡
          </button>
          <p className="min-w-0 flex-1 truncate text-center text-sm font-bold text-teal-900">
            いつも買ってるあのメーカー ポケット帳
          </p>
          <button
            type="button"
            onClick={onAddItem}
            aria-label="追加"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-800 text-2xl font-bold leading-none text-white shadow-sm"
          >
            +
          </button>
        </header>

        <section className="sticky top-0 z-10 mb-3 space-y-3 bg-slate-50 pb-3">
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
            {latestItemGroups.map((group) => {
              const tone = getCategoryIconTone(group.iconKey);

              return (
                <section key={group.value} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                  <header className={`flex min-h-9 items-center gap-2 px-3 py-2 ${tone.bar}`}>
                      <CategoryIcon
                        iconKey={group.iconKey}
                        className="h-5 w-5 shrink-0"
                      />
                    <h2 className="min-w-0 flex-1 truncate text-base font-bold">
                      {group.name}
                    </h2>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${tone.barCount}`}>
                      最新1件
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${tone.barCount}`}>
                      {group.count}件
                    </span>
                    <span className="text-lg font-bold leading-none">›</span>
                  </header>
                  <div className="p-2">
                    <ItemCard
                      item={group.latestItem}
                      onSelect={onSelectItem}
                      variant="compact"
                    />
                  </div>
                </section>
              );
            })}
            {filteredItems.length === 0 ? (
              <p className="rounded-lg bg-white p-4 text-gray-700">
                該当する商品がありません。
              </p>
            ) : null}
          </section>
        ) : null}

      </div>
    </main>
  );
}
