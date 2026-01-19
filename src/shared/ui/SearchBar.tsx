import { useEffect, useMemo, useState } from "react";
import { useDistrictsIndex } from "@/features/search-address/model";
import { suggestAddress } from "@/features/suggest-address/model";
import { useSelectLocationStore } from "@/features/select-location";

export function SearchBar() {
  const tmpSelectLocation = useSelectLocationStore((s) => s.tmpSelectLocation);
  const isSearchInProgress = useSelectLocationStore(
    (s) => s.isSearchInProgress,
  );
  const setSearchInProgress = useSelectLocationStore(
    (s) => s.setSearchInProgress,
  );

  const index = useDistrictsIndex();
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // 유저가 입력한 주소에 대한 주소 제안
  const suggestions = useMemo(() => {
    if (!index) return [];
    if (!input.trim()) return [];
    return suggestAddress(input, index);
  }, [input, index]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;
    tmpSelectLocation(input.trim()); // 입력한 주소를 임시 선택 장소로 설정
    setSearchInProgress(true); // 검색 중 상태로 설정
    setIsFocused(false);
    setInput("");
  };

  return (
    <div className="flex flex-col relative">
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button
          type="submit"
          disabled={isSearchInProgress}
          className="text-background w-fit cursor-pointer hover:text-black transition-colors px-2"
        >
          {!isSearchInProgress ? (
            "검색"
          ) : (
            <img
              src="/assets/spinner.svg"
              alt="검색"
              className="inline-block w-6 h-6 shrink-0 ml-1 animate-spin"
            />
          )}
        </button>
      </form>
      {suggestions.length > 0 && isFocused && (
        <div
          id="suggestions"
          className="absolute top-8 bg-white text-xxs rounded-b-sm opacity-90 w-full max-h-40 overflow-auto z-30"
        >
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
