import {
  categoryIconTemplates,
  defaultCategoryIconKey,
  getCategoryIconTemplate
} from "../data/categoryIconTemplates";
import type { CategoryIconKey } from "../types/CategoryIconKey";
import CategoryIcon from "./CategoryIcon";

type CategoryIconPickerProps = {
  value?: CategoryIconKey;
  onChange: (value: CategoryIconKey) => void;
};

export default function CategoryIconPicker({
  value,
  onChange
}: CategoryIconPickerProps) {
  const selectedIconKey =
    getCategoryIconTemplate(value).key ?? defaultCategoryIconKey;

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-bold text-gray-800">
        カテゴリーアイコン
      </legend>
      <div className="grid grid-cols-2 gap-2">
        {categoryIconTemplates.map((template) => {
          const isSelected = template.key === selectedIconKey;

          return (
            <button
              key={template.key}
              type="button"
              aria-label={`${template.label}: ${template.hint}`}
              aria-pressed={isSelected}
              onClick={() => onChange(template.key)}
              className={`min-h-12 rounded-lg border px-3 py-2 text-left transition ${
                isSelected
                  ? "border-teal-800 bg-teal-50 text-teal-900 ring-2 ring-teal-100"
                  : "border-gray-200 bg-white text-gray-800"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-bold leading-5">
                <CategoryIcon iconKey={template.key} className="h-5 w-5" />
                <span>{template.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
