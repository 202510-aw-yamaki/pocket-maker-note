import { useState } from "react";
import type { PocketItem } from "../types/PocketItem";
import { sharePocketItem } from "../utils/sharePocketItem";

type ItemCardProps = {
  item: PocketItem;
  onSelect: (itemId: string) => void;
};

const formatDate = (date: string) => {
  if (!date) {
    return "未登録";
  }

  return date.replaceAll("-", "/");
};

export default function ItemCard({ item, onSelect }: ItemCardProps) {
  const [shareLabel, setShareLabel] = useState("共有");
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);

    try {
      const result = await sharePocketItem(item);

      if (result === "shared") {
        setShareLabel("共有済み");
      }

      if (result === "copied") {
        setShareLabel("コピー済み");
      }

      if (result !== "cancelled") {
        window.setTimeout(() => setShareLabel("共有"), 2000);
      }
    } catch (error) {
      setShareLabel("失敗");
      window.setTimeout(() => setShareLabel("共有"), 2000);
      console.error(error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <article className="relative rounded-lg border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={handleShare}
        disabled={isSharing}
        className="absolute right-3 top-3 z-10 min-h-11 min-w-14 rounded-full border border-teal-200 bg-teal-50 px-3 text-sm font-bold text-teal-800 shadow-sm disabled:cursor-wait disabled:bg-gray-100 disabled:text-gray-400"
      >
        {isSharing ? "準備中" : shareLabel}
      </button>

      <button
        type="button"
        onClick={() => onSelect(item.id)}
        className="grid w-full grid-cols-[88px_1fr] gap-4 p-3 text-left transition active:scale-[0.99]"
        aria-label={`${item.makerName} ${item.itemName}の詳細を開く`}
      >
        <div className="flex h-24 w-[88px] items-center justify-center overflow-hidden rounded-md bg-teal-50 text-xs font-semibold text-teal-800">
          {item.photoDataUrl ? (
            <img
              src={item.photoDataUrl}
              alt={`${item.itemName}の写真`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="px-2 text-center leading-5">写真未登録</span>
          )}
        </div>

        <div className="min-w-0 space-y-1 pr-16">
          <p className="text-xl font-bold leading-snug text-teal-900">
            {item.makerName}
          </p>
          <h2 className="text-lg font-semibold leading-snug text-gray-950">
            {item.itemName}
          </h2>
          <p className="line-clamp-2 text-sm leading-5 text-gray-700">
            {item.productDetail}
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold">
            <span className="rounded-full bg-indigo-50 px-2 py-1 text-indigo-800">
              {item.categoryName || "未分類"}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">
              最後: {formatDate(item.lastPurchasedAt)}
            </span>
          </div>
        </div>
      </button>
    </article>
  );
}
