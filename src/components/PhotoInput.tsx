import { useState } from "react";

type PhotoInputProps = {
  value: string;
  onChange: (value: string) => void;
};

const maxSourceBytes = 12 * 1024 * 1024;
const maxImageSide = 1280;
const imageQuality = 0.82;

const resizeImageFile = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Image file is required."));
      return;
    }

    if (file.size > maxSourceBytes) {
      reject(new Error("Image file is too large."));
      return;
    }

    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.addEventListener("load", () => {
      const scale = Math.min(
        1,
        maxImageSide / Math.max(image.naturalWidth, image.naturalHeight)
      );
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      URL.revokeObjectURL(objectUrl);

      if (!context) {
        reject(new Error("Canvas is unavailable."));
        return;
      }

      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", imageQuality));
    });

    image.addEventListener("error", () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image file could not be loaded."));
    });

    image.src = objectUrl;
  });
};

export default function PhotoInput({ value, onChange }: PhotoInputProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isReading, setIsReading] = useState(false);

  const handleFileChange = async (file: File | undefined) => {
    if (!file) {
      return;
    }

    setErrorMessage("");
    setIsReading(true);

    try {
      const resizedDataUrl = await resizeImageFile(file);
      onChange(resizedDataUrl);
    } catch (error) {
      setErrorMessage("12MB以下の画像ファイルを選択してください。");
      console.error(error);
    } finally {
      setIsReading(false);
    }
  };

  return (
    <div className="space-y-3">
      <span className="block text-sm font-bold text-gray-800">写真</span>
      <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-teal-300 bg-teal-50 text-sm font-bold text-teal-800">
        {value ? (
          <img
            src={value}
            alt="選択した商品の写真"
            className="h-full w-full object-cover"
          />
        ) : (
          <span>写真未登録</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <label className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-teal-800 px-4 text-sm font-bold text-white">
          {isReading ? "処理中" : "写真を選択"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={isReading}
            onChange={(event) => {
              void handleFileChange(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="min-h-11 rounded-full border border-gray-300 bg-white px-4 text-sm font-bold text-gray-700"
          >
            写真を外す
          </button>
        ) : null}
      </div>
      {errorMessage ? (
        <p className="text-sm font-semibold text-red-700">{errorMessage}</p>
      ) : null}
    </div>
  );
}
