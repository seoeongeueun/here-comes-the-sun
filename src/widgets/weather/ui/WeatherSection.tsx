import { useQuery } from "@tanstack/react-query";
import { weatherQueries } from "@/entities/weather";
import { useCurrentLocationStore } from "@/features/current-location";
import { useEffect, useMemo } from "react";
import {
  parseHourlyByDate,
  convertWeatherCodeToEmoji,
} from "@/entities/weather";

export function WeatherSection() {
  // 현재 위치의 날씨 데이터
  const currentLocation = useCurrentLocationStore((s) => s.currentLocation);

  const currentLocationWeather = useQuery({
    ...weatherQueries.byLatLng({
      lat: currentLocation?.lat ?? NaN,
      lng: currentLocation?.lng ?? NaN,
    }),
    enabled: !!currentLocation?.lat && !!currentLocation?.lng,
  });

  const hourlyToday = useMemo(() => {
    const hourly = currentLocationWeather.data?.hourly;
    if (!hourly) return [];

    const todayDate = currentLocationWeather.data?.current?.time.slice(0, 10);
    if (!todayDate) return [];

    return parseHourlyByDate(hourly, todayDate);
  }, [
    currentLocationWeather.data?.current?.time,
    currentLocationWeather.data?.hourly,
  ]);

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
    <section className="flex w-full h-fit flex-col gap-4">
      <header className="flex flex-row justify-between items-center gap-3">
        <h2 className="text-white text-sm">오늘의 시간별 날씨</h2>
        <address className="flex flex-row items-center text-white text-xs not-italic">
          <span className="mr-1.5">🧭 현 위치:</span>
          <span className="text-white">
            {currentLocation && currentLocation.sido?.length > 0
              ? `${currentLocation.sido} ${currentLocation.sigungu} ${currentLocation.dong}`
              : "Unknown"}
          </span>
        </address>
      </header>
      <article
        id="hourly-chart"
        className="w-full h-fit text-center overflow-x-auto flex flex-row gap-3"
      >
        {hourlyToday.length !== 0 ? (
          hourlyToday.map((point) => (
            <figure
              key={point.time}
              id={`hourly-weather-${point.time}`}
              className="bg-white rounded-sm flex flex-col items-center justify-center p-2 gap-2 aspect-square min-w-20"
            >
              <time className="text-background text-xxs" dateTime={point.time}>
                {point.time.slice(11, 16)}
              </time>
              <span className="text-xl" role="img" aria-label="날씨 상태">
                {convertWeatherCodeToEmoji(point.weatherCode)}
              </span>
              <data
                className="text-s text-error"
                value={point.temperature ?? 0}
              >
                {point.temperature != null
                  ? `${Math.round(point.temperature)}°C`
                  : "N/A"}
              </data>
            </figure>
          ))
        ) : (
          <p className="w-full">날씨 정보가 없습니다</p>
        )}
      </article>
    </section>
  );
}
