type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-gray-800">検索</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="商品名・メーカー・サイズ"
        className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-base text-gray-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
      />
    </label>
  );
}
