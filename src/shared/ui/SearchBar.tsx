export function SearchBar() {
  return (
    <form className="flex items-center justify-center gap-2 rounded-sm bg-white text-black text-xs p-1">
      <label htmlFor="address-search" className="sr-only">
        주소 검색
      </label>
      <input
        id="address-search"
        type="search"
        name="address"
        placeholder="주소를 입력하세요"
        className="placeholder:text-background flex-1 focus:outline-theme p-1"
      />
      <button
        type="submit"
        className="ml-4 text-background w-fit cursor-pointer hover:text-black transition-colors px-2"
      >
        검색
      </button>
    </form>
  );
}
