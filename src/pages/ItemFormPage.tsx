import { FormEvent, useEffect, useState } from "react";
import PhotoInput from "../components/PhotoInput";
import {
  listPocketItemCategories,
  listPocketItemMakers
} from "../db/pocketItemsDb";
import type { PocketItem, PocketItemInput } from "../types/PocketItem";

type ItemFormPageProps = {
  mode: "add" | "edit";
  initialItem?: PocketItem;
  onBack: () => void;
  onSubmit: (input: PocketItemInput) => Promise<void>;
};

const emptyInput: PocketItemInput = {
  itemName: "",
  makerName: "",
  categoryName: "",
  productDetail: "",
  photoDataUrl: "",
  lastPurchasedAt: "",
  memo: ""
};

const createInitialInput = (item?: PocketItem): PocketItemInput => {
  if (!item) {
    return emptyInput;
  }

  return {
    itemName: item.itemName,
    makerName: item.makerName,
    categoryName: item.categoryName,
    productDetail: item.productDetail,
    photoDataUrl: item.photoDataUrl,
    lastPurchasedAt: item.lastPurchasedAt,
    memo: item.memo
  };
};

type OptionMenuProps = {
  id: string;
  label: string;
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  onChange: (value: string) => void;
  placeholder: string;
};

function OptionMenuField({
  id,
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
  onChange,
  placeholder
}: OptionMenuProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="block text-sm font-bold text-gray-800">
          {label}
        </label>
        <button
          type="button"
          onClick={onToggle}
          disabled={options.length === 0}
          aria-expanded={isOpen}
          aria-controls={`${id}Options`}
          className="min-h-9 rounded-full border border-teal-200 bg-teal-50 px-3 text-sm font-bold text-teal-800 disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
        >
          選択
        </button>
      </div>
      <div className="relative">
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full rounded-lg border border-gray-300 px-4 text-base outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
          placeholder={placeholder}
        />
        {isOpen ? (
          <div
            id={`${id}Options`}
            className="absolute left-0 right-0 top-full z-20 mt-2 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
          >
            {options.map((option) => {
              const isSelected = option === value;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSelect(option)}
                  className={`min-h-11 w-full rounded-md px-3 text-left text-base font-semibold ${
                    isSelected
                      ? "bg-teal-800 text-white"
                      : "text-gray-800 hover:bg-teal-50"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function ItemFormPage({
  mode,
  initialItem,
  onBack,
  onSubmit
}: ItemFormPageProps) {
  const [input, setInput] = useState<PocketItemInput>(() =>
    createInitialInput(initialItem)
  );
  const [makerOptions, setMakerOptions] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [isMakerMenuOpen, setIsMakerMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [makers, categories] = await Promise.all([
          listPocketItemMakers(),
          listPocketItemCategories()
        ]);
        setMakerOptions(makers);
        setCategoryOptions(categories);
      } catch (error) {
        console.error(error);
      }
    };

    void loadOptions();
  }, []);

  const updateField = (field: keyof PocketItemInput, value: string) => {
    setInput((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requiredFields = [
      input.itemName,
      input.makerName,
      input.categoryName,
      input.productDetail
    ];

    if (requiredFields.some((value) => value.trim().length === 0)) {
      setErrorMessage("必須項目を入力してください。");
      return;
    }

    setErrorMessage("");
    setIsSaving(true);

    try {
      await onSubmit(input);
    } catch (error) {
      setErrorMessage("保存できませんでした。");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-sky-50 text-gray-950">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-6 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 min-h-11 self-start rounded-full border border-gray-300 bg-white px-4 text-sm font-bold text-gray-800"
        >
          ← 戻る
        </button>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <header>
            <p className="text-sm font-bold text-teal-800">
              いつものメーカー帳
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight">
              {mode === "add" ? "商品を追加" : "商品を編集"}
            </h1>
          </header>

          {errorMessage ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
              {errorMessage}
            </p>
          ) : null}

          <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <label className="block space-y-2">
              <span className="block text-sm font-bold text-gray-800">
                アイテム名
              </span>
              <input
                value={input.itemName}
                onChange={(event) => updateField("itemName", event.target.value)}
                className="h-12 w-full rounded-lg border border-gray-300 px-4 text-base outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                placeholder="醤油"
              />
            </label>

            <OptionMenuField
              id="makerName"
              label="メーカー名"
              value={input.makerName}
              options={makerOptions}
              isOpen={isMakerMenuOpen}
              onToggle={() => {
                setIsMakerMenuOpen((currentValue) => !currentValue);
                setIsCategoryMenuOpen(false);
              }}
              onSelect={(maker) => {
                updateField("makerName", maker);
                setIsMakerMenuOpen(false);
              }}
              onChange={(value) => updateField("makerName", value)}
              placeholder="キッコーマン"
            />

            <OptionMenuField
              id="categoryName"
              label="カテゴリー"
              value={input.categoryName}
              options={categoryOptions}
              isOpen={isCategoryMenuOpen}
              onToggle={() => {
                setIsCategoryMenuOpen((currentValue) => !currentValue);
                setIsMakerMenuOpen(false);
              }}
              onSelect={(category) => {
                updateField("categoryName", category);
                setIsCategoryMenuOpen(false);
              }}
              onChange={(value) => updateField("categoryName", value)}
              placeholder="調味料"
            />

            <label className="block space-y-2">
              <span className="block text-sm font-bold text-gray-800">
                商品詳細・サイズ
              </span>
              <input
                value={input.productDetail}
                onChange={(event) =>
                  updateField("productDetail", event.target.value)
                }
                className="h-12 w-full rounded-lg border border-gray-300 px-4 text-base outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                placeholder="特選 丸大豆しょうゆ 1L"
              />
            </label>

            <PhotoInput
              value={input.photoDataUrl}
              onChange={(value) => updateField("photoDataUrl", value)}
            />

            <label className="block space-y-2">
              <span className="block text-sm font-bold text-gray-800">
                最後に買った日
              </span>
              <input
                type="date"
                value={input.lastPurchasedAt}
                onChange={(event) =>
                  updateField("lastPurchasedAt", event.target.value)
                }
                className="h-12 w-full rounded-lg border border-gray-300 px-4 text-base outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              />
            </label>

            <label className="block space-y-2">
              <span className="block text-sm font-bold text-gray-800">
                メモ
              </span>
              <textarea
                value={input.memo}
                onChange={(event) => updateField("memo", event.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                placeholder="赤いキャップのやつ。減塩ではない。"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="min-h-12 w-full rounded-lg bg-teal-800 px-4 text-base font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isSaving ? "保存中" : "保存する"}
          </button>
        </form>
      </div>
    </main>
  );
}
