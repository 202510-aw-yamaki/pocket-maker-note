type PhotoInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function PhotoInput({ value, onChange }: PhotoInputProps) {
  const handleFileChange = (file: File | undefined) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    });

    reader.readAsDataURL(file);
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
          写真を選択
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => handleFileChange(event.target.files?.[0])}
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
    </div>
  );
}
