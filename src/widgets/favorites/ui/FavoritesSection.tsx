import { useFavoriteCityStore } from "@/features/favorite-city";
import type { City } from "@/entities/city";
import { CityCard } from "./CityCard";

export function FavoritesSection() {
  const favoriteCities = useFavoriteCityStore((state) => state.favorites);

  return (
    <section className="w-full">
      <header>
        <h2>내 장소</h2>
        <span className="text-xs">{favoriteCities.length}/6</span>
      </header>
      <div className="grid grid-cols-3 gap-3 w-full">
        {favoriteCities.length === 0 ? (
          <div className="h-30 flex flex-col justify-center items-center text-secondary text-sm w-full text-center">
            <span>즐겨찾기한 주소가 없습니다</span>
            <span className="text-s">
              주소를 검색해서 즐겨찾기에 추가해보세요
            </span>
          </div>
        ) : (
          favoriteCities.map((city: City) => (
            <CityCard key={city.id} {...city} />
          ))
        )}
      </div>
    </section>
  );
}
