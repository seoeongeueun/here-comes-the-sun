import { parseHourlyByDate } from "./parse";
import type { OpenMeteoHourly } from "./types";

export const PRECIP_MEANINGFUL_MM_PER_HOUR = 0.1; // 유의미한 강수량의 기준 (0.1mm/hr 이상)
export const PRECIP_UMBRELLA_MM_PER_HOUR = 0.5; // 우산 권장 강수량
export const PRECIP_UMBRELLA_MIN_HOURS = 2; // 약해도 2시간 이상이면 권장

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

function isHeavyPrecipitation(code: number): boolean {
  // Thunderstorm: 95,96,99
  return (
    (code >= 61 && code <= 65) ||
    (code >= 95 && code <= 99) ||
    (code >= 85 && code <= 86)
  );
}

// 강수가 확인된 시간 데이터만 반환
export function getPrecipitationInHourlyData(
  hourly: OpenMeteoHourly,
  date: string, // "YYYY-MM-DD"
): ReturnType<typeof parseHourlyByDate> {
  const hourlyData = parseHourlyByDate(hourly, date);
  const precipData = hourlyData.filter(
    (point) => (point.precipitation ?? 0) >= PRECIP_MEANINGFUL_MM_PER_HOUR,
  );

  return precipData;
}

/*
우산이 필요한지 기준
- weather code가 강수가 있는 경우
- 약한 비라도 2시간 이상 지속되면 우산 권장
*/

interface NeedsUmbrellaResult {
  needed: boolean;
  isHeavyRain: boolean;
}

export function needsUmbrella(
  precipData: ReturnType<typeof parseHourlyByDate>,
): NeedsUmbrellaResult {
  const result = { needed: false, isHeavyRain: false };

  //강수 코드가 있는지 확인
  if (precipData.some((point) => isPrecipitation(point.weatherCode ?? -1))) {
    result.needed = true;
  }

  if (
    precipData.some((point) => isHeavyPrecipitation(point.weatherCode ?? -1))
  ) {
    result.isHeavyRain = true;
  }

  //강수 코드가 확인되었다면 연속 시간은 확인할 필요 없음
  if (result.needed) {
    return result;
  }

  let consecutiveHours = 0;
  //percipdata에서 hour가 연속적인지 확인
  for (let i = 0; i < precipData.length; i++) {
    if (i === 0) {
      consecutiveHours = 1;
      continue;
    }
    if (precipData[i].hour === precipData[i - 1].hour + 1) {
      consecutiveHours++;
    } else {
      consecutiveHours = 1;
    }

    if (consecutiveHours >= PRECIP_UMBRELLA_MIN_HOURS) {
      result.needed = true;
    }
  }
  return result;
}
