import { useQuery } from "@tanstack/react-query";
import { weatherQueries } from "@/entities/weather";
import { useCurrentLocationStore } from "@/features/current-location";
import { useEffect, useMemo } from "react";
import {
  parseHourlyByDate,
  convertWeatherCodeToEmoji,
  parseDailyMinMax,
  getClothingAdvice,
  convertClothingToKorean,
} from "@/entities/weather";

export function WeatherSection() {
  // 현재 위치의 날씨 데이터
  const currentLocation = useCurrentLocationStore((s) => s.currentLocation);

  const {
    data: currentLocationWeather,
    isLoading,
    isError,
  } = useQuery({
    ...weatherQueries.byLatLng({
      lat: currentLocation?.lat ?? NaN,
      lng: currentLocation?.lng ?? NaN,
    }),
    enabled: !!currentLocation?.lat && !!currentLocation?.lng,
  });

  const hourlyData = currentLocationWeather?.hourly;
  const dailyData = currentLocationWeather?.daily;
  const currentTime = currentLocationWeather?.current?.time;

  const hourlyToday = useMemo(() => {
    if (!hourlyData) return [];

    const todayDate = currentTime?.slice(0, 10);
    if (!todayDate) return [];

    return parseHourlyByDate(hourlyData, todayDate);
  }, [hourlyData, currentTime]);

  const dailyMinMax = useMemo(() => {
    if (!dailyData) return { min: null, max: null };

    const todayDate = currentTime?.slice(0, 10);
    if (!todayDate) return { min: null, max: null };
    return parseDailyMinMax(dailyData, todayDate);
  }, [dailyData, currentTime]);

  // 서버 파생 데이터라 usememo로 캐싱
  const clothingAdvice = useMemo(() => {
    const { min, max } = dailyMinMax;
    if (min === null || max === null) {
      return { options: [], hasTempDiff: false };
    }

    return getClothingAdvice(min, max);
  }, [dailyMinMax]);

  useEffect(() => {
    //현재 시간은 어느 hourly 데이터와 매칭되는지 확인
    if (hourlyToday.length === 0) return;
    const now = new Date();
    const nowHour = now.getHours();
    const nowPoint = hourlyToday.find((point) => point.hour === nowHour);

    if (nowPoint) {
      requestAnimationFrame(() => {
        const element = document.getElementById(
          `hourly-weather-${nowPoint.time}`,
        );
        element?.scrollIntoView({ behavior: "smooth", inline: "center" });
      });
    }
  }, [hourlyToday]);

  return (
    <div className="flex flex-col">
      <section className="flex w-full h-fit flex-col">
        <header>
          <h2 className="text-white text-sm">
            {currentLocation && currentLocation.sido?.length > 0
              ? `${currentLocation.sido} ${currentLocation.sigungu} ${currentLocation.dong}`
              : "Unknown"}{" "}
            의 시간별 날씨
          </h2>
          {!isLoading && !isError && (
            <div className="flex flex-row items-center justify-between py-2 text-xs text-white gap-2">
              <p>
                🌡️ 최저{" "}
                {dailyMinMax.min != null
                  ? `${Math.round(dailyMinMax.min)}°C`
                  : "N/A"}
              </p>
              <p>/</p>
              <p>
                최고{" "}
                {dailyMinMax.max != null
                  ? `${Math.round(dailyMinMax.max)}°C`
                  : "N/A"}
              </p>
            </div>
          )}
        </header>
        <article
          id="hourly-chart"
          className="w-full h-fit text-center overflow-x-auto flex flex-row gap-3"
        >
          {isLoading && (
            <p className="text-black text-sm w-full py-4">
              날씨 정보를 불러오는 중...
            </p>
          )}
          {isError && (
            <p className="text-black text-sm w-full py-4">
              날씨 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
            </p>
          )}
          {!isLoading && !isError && (
            <>
              {hourlyToday.length !== 0 ? (
                hourlyToday.map((point) => (
                  <figure
                    key={point.time}
                    id={`hourly-weather-${point.time}`}
                    className="bg-white rounded-sm flex flex-col items-center justify-center p-2 gap-2 aspect-square min-w-20 h-30"
                  >
                    <time className="text-black text-xxs" dateTime={point.time}>
                      {point.time.slice(11, 16)}
                    </time>
                    <span className="text-xl">
                      {convertWeatherCodeToEmoji(point.weatherCode)}
                    </span>
                    <span className="text-s text-error">
                      {point.temperature != null
                        ? `${Math.round(point.temperature)}°C`
                        : "N/A"}
                    </span>
                  </figure>
                ))
              ) : (
                <p className="w-full">해당 장소의 정보가 제공되지 않습니다.</p>
              )}
            </>
          )}
        </article>
      </section>

      <section className="flex flex-col">
        <header className="flex flex-row items-center gap-3">
          <h2 className="text-white">날씨에 맞는 옷</h2>
          {clothingAdvice.hasTempDiff && (
            <span className="text-xs">
              👖 일교차가 큰 날이에요. 옷차림에 유의하세요.
            </span>
          )}
        </header>
        {clothingAdvice.options.length > 0 && (
          <ul className="bg-white rounded-sm flex flex-row items-center justify-start w-full flex-wrap ">
            {clothingAdvice.options.map((advice, index) => (
              <li
                key={index}
                className="h-30 text-xs flex flex-col items-center justify-evenly basis-1/3 md:basis-1/4 lg:basis-1/6"
              >
                <img
                  src={`/icon/${advice}.png`}
                  alt={convertClothingToKorean([advice])[0] + " 아이콘"}
                  className="w-14 h-14 object-contain"
                />
                <span>{convertClothingToKorean([advice])[0]}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
