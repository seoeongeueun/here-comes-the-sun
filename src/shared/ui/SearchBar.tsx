import { useMemo, useState } from "react";
import { useDistrictsIndex } from "@/features/search-address/model";
import { suggestAddress } from "@/features/suggest-address/model";
import { useSelectPlaceStore } from "@/features/select-place";

export function SearchBar() {
  const tmpSelectPlace = useSelectPlaceStore((s) => s.tmpSelectPlace);
  const index = useDistrictsIndex();
  const [input, setInput] = useState("");

  // 유저가 입력한 주소에 대한 주소 제안
  const suggestions = useMemo(() => {
    if (!index) return [];
    if (!input.trim()) return [];
    return suggestAddress(input, index);
  }, [input, index]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    tmpSelectPlace(input.trim()); // 입력한 주소를 임시 선택 장소로 설정
  };

  return (
    <div className="flex flex-col">
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center gap-2 rounded-sm bg-white text-black text-xs p-1"
      >
        <label htmlFor="address-search" className="sr-only">
          주소 검색
        </label>
        <input
          id="address-search"
          type="search"
          name="address"
          placeholder="주소를 입력하세요"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className="placeholder:text-background flex-1 focus:outline-theme p-1"
        />
        <button
          type="submit"
          className="text-background w-fit cursor-pointer hover:text-black transition-colors px-2"
        >
          검색
        </button>
      </form>
      {suggestions.length > 0 && (
        <div className="bg-white text-xxs rounded-b-sm opacity-90 w-full max-h-40 overflow-auto">
          {suggestions.map((s) => (
            <button
              key={s.label}
              type="button"
              className="w-full text-left px-2 hover:bg-gray-100 cursor-pointer h-8 flex items-center hover:rounded-sm"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setInput(s.label);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
