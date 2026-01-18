import { WEATHER_BASE_URL } from "@/shared/config";
import { apiRequest } from "@/shared/api/apiRequest";
import type {
  OpenMeteoForecastResponse,
  WeatherFetchParams,
} from "../model/types";

export function fetchWeatherByLatLng(
  { lat, lng }: WeatherFetchParams,
  signal?: AbortSignal,
) {
  const sp = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    timezone: "Asia/Seoul",
    current: "temperature_2m,weather_code,precipitation,snowfall",
    hourly: "temperature_2m,weather_code,precipitation,snowfall",
    daily:
      "temperature_2m_min,temperature_2m_max,precipitation_sum,snowfall_sum,precipitation_hours,precipitation_probability_max",
    models: "kma_seamless",
  });

  const url = `${WEATHER_BASE_URL}/v1/forecast?${sp.toString()}`;

  return apiRequest<OpenMeteoForecastResponse>(url, {
    method: "GET",
    signal,
  });
}
