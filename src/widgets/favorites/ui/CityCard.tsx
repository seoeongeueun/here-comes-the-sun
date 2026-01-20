import type { Favorite } from "@/entities/favorite";
import { useMemo } from "react";
import { useSelectLocationStore } from "@/features/select-location";
import { useFavoriteCityStore } from "@/features/favorite-city";
import { useQuery } from "@tanstack/react-query";
import { weatherQueries, convertWeatherCodeToEmoji } from "@/entities/weather";
import { parseDailyMinMax } from "@/entities/weather";
import { createSearchParams, useNavigate } from "react-router-dom";
import { routes } from "@/shared/config/routes";

export function CityCard(city: Favorite) {
  const selectLocation = useSelectLocationStore(
    (state) => state.selectLocation,
  );
  const removeFavorite = useFavoriteCityStore((state) => state.removeFavorite);
  const clearLocation = useSelectLocationStore((state) => state.clearLocation);

  const handleFavoriteClick = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation(); //즐겨찾기 버튼 클릭시 카드 클릭 이벤트가 발생하는 것을 방지
    removeFavorite(city.id);
    clearLocation();
  };

  const navigate = useNavigate();

  const {
    data: weatherData,
    isLoading,
    isError,
  } = useQuery({
    ...weatherQueries.byLatLng({ lat: city.lat, lng: city.lng }),
    enabled: Number.isFinite(city.lat) && Number.isFinite(city.lng),
  });

  const dailyData = weatherData?.daily;
  const currentTime = weatherData?.current?.time;

  const dailyMinMax = useMemo(() => {
    if (!dailyData) return { min: null, max: null };

    const todayDate = currentTime?.slice(0, 10);
    if (!todayDate) return { min: null, max: null };
    return parseDailyMinMax(dailyData, todayDate);
  }, [dailyData, currentTime]);

  const handleCardClick = () => {
    selectLocation(city);

    navigate({
      pathname: routes.info,
      search: createSearchParams({
        lat: String(city.lat),
        lng: String(city.lng),
        sido: city.sido,
        sigungu: city.sigungu ?? "",
        dong: city.dong ?? "",
      }).toString(),
    });
  };

  if (isError) {
    return (
      <div className="h-30 cursor-pointer text-xs p-2 bg-white rounded-sm flex items-center justify-center text-background">
        <span>일시적인 에러</span>
      </div>
    );
  }

  return (
    <div
      key={city.id}
      onClick={handleCardClick}
      className="h-30 cursor-zoom-in p-2 bg-white rounded-sm flex flex-col items-center justify-between"
    >
      <button
        className="star-icon selected ml-auto p-2 cursor-pointer"
        onClick={handleFavoriteClick}
        aria-label={`즐겨찾기 ${city.sido} ${city.sigungu ?? ""} ${city.dong ?? ""} 토글`}
      ></button>
      <span
        id="weather-emoji"
        className={`text-lg h-10 min-w-10 flex items-center justify-center rounded-sm ${isLoading ? "bg-background animate-[pulse_1.6s_ease-in-out_infinite] transition-colors duration-300" : ""}`}
        aria-hidden="true"
      >
        {weatherData?.current &&
          convertWeatherCodeToEmoji(weatherData.current.weather_code)}
      </span>
      <div className="flex flex-col items-center justify-between w-full h-fit gap-0.5 truncate">
        <div className="flex flex-row items-center justify-between w-full gap-1 text-xs">
          <h3 className="w-full truncate">{city.nickname || city.sido}</h3>
          <div
            id="temperature"
            className={`w-full whitespace-nowrap flex flex-row justify-end gap-1 text-xxs text-error min-w-4 h-4 rounded-sm ${isLoading ? " bg-background animate-[pulse_1.6s_ease-in-out_infinite] transition-colors duration-300" : ""}`}
          >
            <p>
              {dailyMinMax.min != null
                ? `${Math.round(dailyMinMax.min)}°C`
                : ""}
            </p>
            {!isLoading && <p className="text-secondary">/</p>}
            <p>
              {dailyMinMax.max != null
                ? `${Math.round(dailyMinMax.max)}°C`
                : ""}
            </p>
          </div>
        </div>
        <span
          id="city-secondary"
          className="text-xxs truncate w-full text-secondary text-start"
        >
          {city.nickname
            ? `${city.sido} ${city.sigungu ?? ""} ${city.dong ?? ""}`.trim()
            : `${city.sigungu ?? ""} ${city.dong ?? ""}`.trim()}
        </span>
      </div>
    </div>
  );
}
