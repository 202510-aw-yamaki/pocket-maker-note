type CategoryFilterProps = {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
};

const allCategory = "すべて";

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelect
}: CategoryFilterProps) {
  const categoryOptions = [allCategory, ...categories];

  return (
    <div aria-label="カテゴリー絞り込み" className="overflow-x-auto pb-1">
      <div className="flex min-w-max gap-2">
        {categoryOptions.map((category) => {
          const isSelected = category === selectedCategory;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              className={`min-h-11 rounded-full border px-4 text-sm font-bold transition ${
                isSelected
                  ? "border-teal-800 bg-teal-800 text-white"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { allCategory };
