import CategoryIcon from "./CategoryIcon";
import type { CategoryIconKey } from "../types/CategoryIconKey";

export type CategoryFilterOption = {
  name: string;
  iconKey?: CategoryIconKey;
  count: number;
};

type CategoryFilterProps = {
  categories: CategoryFilterOption[];
  selectedCategory: string;
  onSelect: (category: string) => void;
};

const allCategory = "すべて";

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelect
}: CategoryFilterProps) {
  const categoryOptions: CategoryFilterOption[] = [
    {
      name: allCategory,
      iconKey: "seasoning-other",
      count: categories.reduce((total, category) => total + category.count, 0)
    },
    ...categories
  ];

  return (
    <div
      aria-label="カテゴリー絞り込み"
      className="-mx-4 overflow-x-auto px-4 pb-1 scrollbar-none"
    >
      <div className="grid auto-cols-[6.25rem] grid-flow-col gap-2 pr-12">
        {categoryOptions.map((category) => {
          const isSelected = category.name === selectedCategory;

          return (
            <button
              key={category.name}
              type="button"
              onClick={() => onSelect(category.name)}
              className={`flex h-20 flex-col items-start justify-between rounded-lg border p-3 text-left transition ${
                isSelected
                  ? "border-teal-800 bg-teal-800 text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-800"
              }`}
            >
              <CategoryIcon iconKey={category.iconKey} className="h-6 w-6" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold leading-5">
                  {category.name}
                </span>
                <span
                  className={`block text-xs font-semibold leading-4 ${
                    isSelected ? "text-teal-50" : "text-gray-500"
                  }`}
                >
                  {category.count}件
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { allCategory };
