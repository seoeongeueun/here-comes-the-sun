import type { OpenMeteoHourly } from "./types";

type HourlyPoint = {
  time: string; // "2026-01-19T13:00"
  hour: number; // 13
  temperature: number | null; // -2.6
  weatherCode: number | null; // 2
  precipitation: number | null;
  snowfall: number | null;
};

//기본 7일간의 시간별 예보 데이터에서 특정 날짜의 시간별 데이터만 파싱
export function parseHourlyByDate(
  hourly: OpenMeteoHourly,
  date: string, // "YYYY-MM-DD"
): HourlyPoint[] {
  const { start, end } = getHourlyRangeByDate(hourly, date);
  if (start < 0 || end <= start) return [];

  const result: HourlyPoint[] = new Array(end - start);
  for (let i = start, j = 0; i < end; i++, j++) {
    const t = hourly.time[i];
    result[j] = {
      time: t,
      hour: Number(t.slice(11, 13)),
      temperature: hourly.temperature_2m?.[i] ?? null,
      weatherCode: hourly.weather_code?.[i] ?? null,
      precipitation: hourly.precipitation?.[i] ?? null,
      snowfall: hourly.snowfall?.[i] ?? null,
    };
  }
  return result;
}

//특정 날짜의 시간별 데이터가 시작하고 끝나는 인덱스 반환
export function getHourlyRangeByDate(
  hourly: OpenMeteoHourly,
  date: string, // "2026-01-19"
): { start: number; end: number } {
  const times = hourly.time ?? [];
  let start = -1;

  for (let i = 0; i < times.length; i++) {
    const d = times[i].slice(0, 10);

    if (start === -1) {
      if (d === date) start = i;
      continue;
    }

    // start를 찾은 이후 날짜가 바뀌면 종료
    if (d !== date) return { start, end: i };
  }

  return { start, end: start === -1 ? 0 : times.length };
}
