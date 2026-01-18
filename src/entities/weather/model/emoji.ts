export type WeatherEmoji = "☀️" | "⛅" | "☁️" | "☔" | "☃️" | "⛈️" | "❔";

export type WeatherEmojiInput = {
  weatherCode?: number | null;
  precipitation?: number | null; // mm
  snowfall?: number | null; // cm
};

export function convertWeatherCodeToEmoji(code: number | null): WeatherEmoji {
  if (code === null) return "❔";

  if (code === 0) return "☀️"; // 맑음
  if (code === 1) return "⛅"; // 구름 조금
  if (code === 2 || code === 3) return "☁️"; // 구름 많음/흐림
  if (code === 45 || code === 48) return "☁️"; // 안개

  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "☃️"; // 눈
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "☔"; // 비/소나기
  if (code >= 95 && code <= 99) return "⛈️"; // 뇌우

  return "☁️";
}
