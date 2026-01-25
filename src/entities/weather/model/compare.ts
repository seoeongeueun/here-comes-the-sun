import type { OpenMeteoCurrent } from "./types";
import { isPrecipitation } from "./percipitation";

export type CompareCurrentWeatherResult = {
  tmpDiff: number; // selected - current (current 기준 차이)
  currentCode: number;
  selectedCode: number;
  hasShowerDiff: boolean; //둘 중 한 곳이라도 눈/비(강수)가 오면
  isShowerCurrent: boolean; //눈/비 내리는 쪽이 current면
};

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
