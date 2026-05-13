import { FormEvent, useEffect, useState } from "react";
import PhotoInput from "../components/PhotoInput";
import { listPocketItemCategories } from "../db/pocketItemsDb";
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

export default function ItemFormPage({
  mode,
  initialItem,
  onBack,
  onSubmit
}: ItemFormPageProps) {
  const [input, setInput] = useState<PocketItemInput>(() =>
    createInitialInput(initialItem)
  );
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await listPocketItemCategories();
        setCategoryOptions(categories);
      } catch (error) {
        console.error(error);
      }
    };

    void loadCategories();
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

            <label className="block space-y-2">
              <span className="block text-sm font-bold text-gray-800">
                メーカー名
              </span>
              <input
                value={input.makerName}
                onChange={(event) =>
                  updateField("makerName", event.target.value)
                }
                className="h-12 w-full rounded-lg border border-gray-300 px-4 text-base outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                placeholder="キッコーマン"
              />
            </label>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="categoryName"
                  className="block text-sm font-bold text-gray-800"
                >
                  カテゴリー
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setIsCategoryMenuOpen((currentValue) => !currentValue)
                  }
                  disabled={categoryOptions.length === 0}
                  aria-expanded={isCategoryMenuOpen}
                  aria-controls="categoryOptions"
                  className="min-h-9 rounded-full border border-teal-200 bg-teal-50 px-3 text-sm font-bold text-teal-800 disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  選択
                </button>
              </div>
              <div className="relative">
              <input
                id="categoryName"
                value={input.categoryName}
                onChange={(event) =>
                  updateField("categoryName", event.target.value)
                }
                className="h-12 w-full rounded-lg border border-gray-300 px-4 text-base outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                placeholder="調味料"
              />
                {isCategoryMenuOpen ? (
                  <div
                    id="categoryOptions"
                    className="absolute left-0 right-0 top-full z-20 mt-2 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
                  >
                    {categoryOptions.map((category) => {
                      const isSelected = category === input.categoryName;

                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            updateField("categoryName", category);
                            setIsCategoryMenuOpen(false);
                          }}
                          className={`min-h-11 w-full rounded-md px-3 text-left text-base font-semibold ${
                            isSelected
                              ? "bg-teal-800 text-white"
                              : "text-gray-800 hover:bg-teal-50"
                          }`}
                        >
                          {category}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>

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
