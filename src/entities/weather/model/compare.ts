import type { OpenMeteoForecastResponse } from "./types";
import { getPrecipitationInHourlyData, needsUmbrella } from "./percipitation";

export type CompareCurrentWeatherResult = {
  tmpDiff: number; // selected - current (current 기준 차이)
  currentCode: number;
  selectedCode: number;
  hasShowerDiff: boolean; //둘 중 한 곳이라도 눈/비(강수)가 오면
  isShowerCurrent: boolean; //눈/비 내리는 쪽이 current면
  hasShowerLevelDiff: boolean; //둘 중 한 곳이라도 강한 눈/비(강수)가 오면
  isHeavyShowerCurrent: boolean; //강한 눈/비(강수)가 오는 쪽이 current면
};

export function compareCurrentWeather(
  currentLocation: OpenMeteoForecastResponse,
  selectedLocation: OpenMeteoForecastResponse,
): CompareCurrentWeatherResult {
  const current = currentLocation.current;
  const selected = selectedLocation.current;

  if (!current || !selected) {
    throw new Error("현재 날씨 데이터가 없습니다.");
  }

  if (!currentLocation.hourly || !selectedLocation.hourly) {
    throw new Error("시간별 날씨 데이터가 없습니다.");
  }

  const date = current.time.slice(0, 10); // "YYYY-MM-DD"

  const currentUmbrella = needsUmbrella(
    getPrecipitationInHourlyData(currentLocation.hourly, date),
  );
  const selectedUmbrella = needsUmbrella(
    getPrecipitationInHourlyData(selectedLocation.hourly, date),
  );

  console.log("currentUmbrella:", currentUmbrella);
  console.log("selectedUmbrella:", selectedUmbrella);

  const tmpDiff = selected.temperature_2m - current.temperature_2m;

  return {
    tmpDiff,
    currentCode: current.weather_code,
    selectedCode: selected.weather_code,
    hasShowerDiff: currentUmbrella.needed !== selectedUmbrella.needed,
    isShowerCurrent: currentUmbrella.needed,
    hasShowerLevelDiff:
      currentUmbrella.isHeavyRain !== selectedUmbrella.isHeavyRain,
    isHeavyShowerCurrent: currentUmbrella.isHeavyRain,
  };
}
