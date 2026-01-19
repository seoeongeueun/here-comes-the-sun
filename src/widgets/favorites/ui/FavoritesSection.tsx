import { useFavoriteCityStore } from "@/features/favorite-city";
import { useSelectLocationStore } from "@/features/select-location";
import type { City } from "@/entities/city";

export function FavoritesSection() {
  const favoriteCities = useFavoriteCityStore((state) => state.favorites);
  const removeFavorite = useFavoriteCityStore((state) => state.removeFavorite);
  const clearLocation = useSelectLocationStore((state) => state.clearLocation);
  const selectLocation = useSelectLocationStore(
    (state) => state.selectLocation,
  );

  const handleFavoriteClick = (city: City) => {
    removeFavorite(city.id); // 즐겨찾기를 해제하면 리스트에서 사라지기 때문에 removeFavorite만 호출
    clearLocation();
  };

  return (
    <section className="w-full">
      <header>
        <h2>내 장소</h2>
        <span className="text-xs">{favoriteCities.length}/6</span>
      </header>
      <div className="flex flex-row gap-4 w-full">
        {favoriteCities.length === 0 ? (
          <div className="h-30 flex flex-col justify-center items-center text-black text-sm w-full text-center">
            <span>즐겨찾기한 주소가 없습니다.</span>
            <span className="text-s">
              주소를 검색해서 즐겨찾기에 추가해보세요.
            </span>
          </div>
        ) : (
          favoriteCities.map((city: City) => (
            <button
              key={city.id}
              onClick={() => selectLocation(city)}
              className="h-30  basis-1/3 lg:basis-1/6 p-2 bg-white rounded-sm flex flex-col items-center justify-between"
            >
              <button
                className="star-icon selected ml-auto p-2"
                onClick={() => handleFavoriteClick(city)}
                aria-label={`즐겨찾기 ${city.sido} ${city.sigungu ?? ""} ${city.dong ?? ""} 토글`}
              ></button>
              <span
                id="weather-emoji"
                className="text-md h-8 w-8 flex items-center justify-center bg-background rounded-sm animate-[pulse_1.6s_ease-in-out_infinite] transition-colors duration-300"
                aria-hidden="true"
              ></span>
              <div className="flex flex-col items-center justify-between w-full h-fit gap-0.5 truncate">
                <div className="flex flex-row items-center justify-between w-full gap-1 text-xs">
                  <h3>{city.sido}</h3>
                  <p
                    id="temperature"
                    className="text-xxs text-orange-500 min-w-4 h-4 bg-background rounded-sm animate-[pulse_1.6s_ease-in-out_infinite] transition-colors duration-300"
                  ></p>
                </div>
                <span
                  id="city-secondary"
                  className="text-xxs truncate w-full text-secondary text-start"
                >
                  {city.sigungu ?? ""} {city.dong ?? ""}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
}
