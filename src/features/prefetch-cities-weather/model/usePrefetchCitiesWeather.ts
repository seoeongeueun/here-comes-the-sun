import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MAJOR_CITIES } from "@/entities/city";
import { weatherQueries, weatherKeys } from "@/entities/weather";
import { WEATHER_STALE_TIME } from "@/entities/weather/model/constants";
import { fetchWithConcurrency } from "@/shared/lib";

export function usePrefetchCitiesWeather(opts?: { concurrency?: number }) {
  const queryClient = useQueryClient();
  const concurrency = opts?.concurrency ?? 4;

  useEffect(() => {
    let cancelled = false;

    fetchWithConcurrency(MAJOR_CITIES, concurrency, async (city) => {
      if (cancelled) return;

      // 아직 캐시가 있으면 스킵 (staleTime 기준)
      const key = weatherKeys.nowByLatLng(city.lat, city.lng);
      const state = queryClient.getQueryState(key);
      const fresh =
        !!state?.dataUpdatedAt &&
        Date.now() - state.dataUpdatedAt < WEATHER_STALE_TIME;

      if (fresh) return;

      await queryClient.prefetchQuery(
        weatherQueries.nowByLatLng({ lat: city.lat, lng: city.lng })
      );
    }).catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [queryClient, concurrency]);
}
