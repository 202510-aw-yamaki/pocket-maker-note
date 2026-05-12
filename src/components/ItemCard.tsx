import type { PocketItem } from "../types/PocketItem";

type ItemCardProps = {
  item: PocketItem;
};

const formatDate = (date: string) => {
  if (!date) {
    return "未登録";
  }

  return date.replaceAll("-", "/");
};

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <article className="grid grid-cols-[88px_1fr] gap-4 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
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

      <div className="min-w-0 space-y-1">
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
    </article>
  );
}
