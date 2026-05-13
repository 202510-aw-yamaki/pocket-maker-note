import { useEffect, useState } from "react";
import CategoryIcon from "../components/CategoryIcon";
import { resolveCategoryIconKey } from "../data/categoryIconTemplates";
import { getPocketItem } from "../db/pocketItemsDb";
import type { PocketItem } from "../types/PocketItem";

type ItemDetailPageProps = {
  itemId: string;
  onBack: () => void;
  onEdit: (item: PocketItem) => void;
  onDelete: (itemId: string) => Promise<void>;
};

const formatDate = (date: string) => {
  if (!date) {
    return "未登録";
  }

  return date;
};

export default function ItemDetailPage({
  itemId,
  onBack,
  onEdit,
  onDelete
}: ItemDetailPageProps) {
  const [item, setItem] = useState<PocketItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const categoryIconKey = item
    ? resolveCategoryIconKey(item.categoryName, item.categoryIconKey)
    : undefined;

  useEffect(() => {
    const loadItem = async () => {
      try {
        const storedItem = await getPocketItem(itemId);

        if (!storedItem) {
          setErrorMessage("商品が見つかりませんでした。");
          return;
        }

        setItem(storedItem);
      } catch (error) {
        setErrorMessage("商品データを読み込めませんでした。");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadItem();
  }, [itemId]);

  const handleDelete = async () => {
    if (!item) {
      return;
    }

    const confirmed = window.confirm(
      `${item.makerName} ${item.itemName}を削除しますか？`
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete(item.id);
    } catch (error) {
      setErrorMessage("削除できませんでした。");
      console.error(error);
    } finally {
      setIsDeleting(false);
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

        {item ? (
          <article className="space-y-5">
            <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg bg-teal-50 text-sm font-bold text-teal-800">
              {item.photoDataUrl ? (
                <img
                  src={item.photoDataUrl}
                  alt={`${item.itemName}の写真`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>写真未登録</span>
              )}
            </div>

            <section className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div>
                <p className="text-3xl font-bold leading-tight text-teal-900">
                  {item.makerName}
                </p>
                <h1 className="mt-2 text-2xl font-bold leading-tight">
                  {item.itemName}
                </h1>
              </div>

              <p className="text-lg font-semibold leading-7 text-gray-800">
                {item.productDetail}
              </p>

              <dl className="space-y-3 text-base leading-7">
                <div>
                  <dt className="text-sm font-bold text-gray-500">
                    カテゴリー
                  </dt>
                  <dd className="mt-1 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-800">
                    <CategoryIcon
                      iconKey={categoryIconKey}
                      className="h-5 w-5"
                    />
                    <span>{item.categoryName}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-bold text-gray-500">
                    最後に買った日
                  </dt>
                  <dd className="font-semibold">
                    {formatDate(item.lastPurchasedAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-bold text-gray-500">メモ</dt>
                  <dd className="whitespace-pre-wrap font-semibold">
                    {item.memo || "未登録"}
                  </dd>
                </div>
              </dl>
            </section>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="min-h-12 rounded-lg bg-teal-800 px-4 text-base font-bold text-white"
              >
                編集
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="min-h-12 rounded-lg border border-red-200 bg-white px-4 text-base font-bold text-red-700 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
              >
                {isDeleting ? "削除中" : "削除"}
              </button>
            </div>
          </article>
        ) : null}
      </div>
    </main>
  );
}
