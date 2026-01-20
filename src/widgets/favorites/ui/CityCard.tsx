import type { City } from "@/entities/city";
import { useSelectLocationStore } from "@/features/select-location";
import { useFavoriteCityStore } from "@/features/favorite-city";
import { useQuery } from "@tanstack/react-query";
import { weatherQueries, convertWeatherCodeToEmoji } from "@/entities/weather";

export function CityCard(city: City) {
  const selectLocation = useSelectLocationStore(
    (state) => state.selectLocation,
  );
  const removeFavorite = useFavoriteCityStore((state) => state.removeFavorite);
  const clearLocation = useSelectLocationStore((state) => state.clearLocation);

  const handleFavoriteClick = (e: MouseEvent) => {
    e.stopPropagation(); //즐겨찾기 버튼 클릭시 카드 클릭 이벤트가 발생하는 것을 방지
    removeFavorite(city.id);
    clearLocation();
  };

  const {
    data: weatherData,
    isLoading,
    isError,
  } = useQuery({
    ...weatherQueries.nowByLatLng({ lat: city.lat, lng: city.lng }),
    enabled: Number.isFinite(city.lat) && Number.isFinite(city.lng),
  });

  if (isError) {
    return (
      <div className="h-30 cursor-pointer text-xs basis-1/3 lg:basis-1/6 p-2 bg-white rounded-sm flex items-center justify-center text-background">
        <span>일시적인 에러</span>
      </div>
    );
  }

  return (
    <div
      key={city.id}
      onClick={() => selectLocation(city)}
      className="h-30 cursor-pointer basis-1/3 lg:basis-1/6 p-2 bg-white rounded-sm flex flex-col items-center justify-between"
    >
      <button
        className="star-icon selected ml-auto p-2"
        onClick={handleFavoriteClick}
        aria-label={`즐겨찾기 ${city.sido} ${city.sigungu ?? ""} ${city.dong ?? ""} 토글`}
      ></button>
      <span
        id="weather-emoji"
        className={`text-md h-8 w-8 flex items-center justify-center rounded-sm ${isLoading ? " bg-background animate-[pulse_1.6s_ease-in-out_infinite] transition-colors duration-300" : ""}`}
        aria-hidden="true"
      >
        {weatherData && convertWeatherCodeToEmoji(weatherData.code)}
      </span>
      <div className="flex flex-col items-center justify-between w-full h-fit gap-0.5 truncate">
        <div className="flex flex-row items-center justify-between w-full gap-1 text-xs">
          <h3>{city.sido}</h3>
          <p
            id="temperature"
            className={`text-xxs text-orange-500 min-w-4 h-4 rounded-sm ${isLoading ? " bg-background animate-[pulse_1.6s_ease-in-out_infinite] transition-colors duration-300" : ""}`}
          >
            {weatherData && weatherData.temp != null
              ? `${Math.round(weatherData.temp)}°C`
              : "N/A"}
          </p>
        </div>
        <span
          id="city-secondary"
          className="text-xxs truncate w-full text-secondary text-start"
        >
          {city.sigungu ?? ""} {city.dong ?? ""}
        </span>
      </div>
    </div>
  );
}
