import type { OpenMeteoCurrent } from "./types";

export type CompareCurrentWeatherResult = {
  tmpDiff: number; // selected - current (current 기준 차이)
  currentCode: number;
  selectedCode: number;
  hasShowerDiff: boolean; //둘 중 한 곳이라도 눈/비(강수)가 오면
  isShowerCurrent: boolean; //눈/비 내리는 쪽이 current면
};

export function isPrecipitation(code: number): boolean {
  //openMeteo 날씨 코드 기준
  // Fog(45,48)은 제외
  // Drizzle: 51,53,55 / Freezing drizzle: 56,57
  // Rain: 61,63,65 / Freezing rain: 66,67
  // Snow: 71,73,75,77
  // Showers: 80,81,82 / Snow showers: 85,86
  // Thunderstorm: 95,96,99
  return (
    (code >= 51 && code <= 67) ||
    (code >= 71 && code <= 77) ||
    (code >= 80 && code <= 86) ||
    (code >= 95 && code <= 99)
  );
}

export function compareCurrentWeather(
  currentLocation: OpenMeteoCurrent,
  selectedLocation: OpenMeteoCurrent,
): CompareCurrentWeatherResult {
  const curTemp = currentLocation.temperature_2m;
  const selTemp = selectedLocation.temperature_2m;

  const curCode = currentLocation.weather_code;
  const selCode = selectedLocation.weather_code;

  const tmpDiff = selTemp - curTemp;

  const isShowerCur = isPrecipitation(curCode);
  const isShowerSel = isPrecipitation(selCode);

  const hasShowerDiff = isShowerCur || isShowerSel;
  const isShowerCurrent = isShowerCur && !isShowerSel;

  return {
    tmpDiff,
    currentCode: curCode,
    selectedCode: selCode,
    hasShowerDiff,
    isShowerCurrent,
  };
}
