import { queryOptions } from "@tanstack/react-query";
import { fetchWeatherByLatLng } from "../api/openMeteo";
import type { WeatherFetchParams } from "../model/types";
import { WEATHER_STALE_TIME, WEATHER_CACHE_TIME } from "../model/constants";
import { roundToThreeDecimals } from "@/shared/lib";

//어떤 것을 기준으로 쿼리를 요청했는지 명확히 하기 위해 키 분리
//openmeteo에서는 위치 검색은 지원하는 않는데, 향후 다른 API를 쓸 경우를 대비해 byLocation과 byLatLng로 구분
export const weatherKeys = {
  all: ["weather"] as const,
  byLocation: (lat: number, lng: number) =>
    [
      "weather",
      "location",
      roundToThreeDecimals(lat),
      roundToThreeDecimals(lng),
    ] as const,
  byLatLng: (lat: number, lng: number) =>
    [
      "weather",
      "forecast",
      "latlng",
      roundToThreeDecimals(lat),
      roundToThreeDecimals(lng),
    ] as const,
  nowByLatLng: (lat: number, lng: number) =>
    [
      "weather",
      "now",
      "latlng",
      roundToThreeDecimals(lat),
      roundToThreeDecimals(lng),
    ] as const,
};

export const weatherQueries = {
  // 좌표 기반 전체 날씨 데이터 쿼리
  byLatLng: (p: WeatherFetchParams) =>
    queryOptions({
      queryKey: weatherKeys.byLatLng(p.lat, p.lng),
      queryFn: ({ signal }) => fetchWeatherByLatLng(p, signal),
      staleTime: WEATHER_STALE_TIME,
      gcTime: WEATHER_CACHE_TIME,
      enabled: Number.isFinite(p.lat) && Number.isFinite(p.lng),
    }),

  // 현재 날씨 온도와 코드만 추출하는 쿼리
  nowByLatLng: (p: WeatherFetchParams) =>
    queryOptions({
      queryKey: weatherKeys.nowByLatLng(p.lat, p.lng),
      queryFn: ({ signal }) => fetchWeatherByLatLng(p, signal),
      select: (res) =>
        ({
          temp: res.current?.temperature_2m ?? null,
          code: res.current?.weather_code ?? null,
        }) satisfies { temp: number | null; code: number | null },
      staleTime: WEATHER_STALE_TIME,
      gcTime: WEATHER_CACHE_TIME,
      enabled: Number.isFinite(p.lat) && Number.isFinite(p.lng),
    }),
};
