import CategoryIcon from "./CategoryIcon";
import type { CategoryIconKey } from "../types/CategoryIconKey";

export type CategoryFilterOption = {
  name: string;
  iconKey?: CategoryIconKey;
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
      iconKey: "seasoning-other"
    },
    ...categories
  ];

  return (
    <div aria-label="カテゴリー絞り込み" className="overflow-x-auto pb-1">
      <div className="flex min-w-max gap-2">
        {categoryOptions.map((category) => {
          const isSelected = category.name === selectedCategory;

          return (
            <button
              key={category.name}
              type="button"
              onClick={() => onSelect(category.name)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold transition ${
                isSelected
                  ? "border-teal-800 bg-teal-800 text-white"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              <CategoryIcon iconKey={category.iconKey} className="h-4 w-4" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { allCategory };
