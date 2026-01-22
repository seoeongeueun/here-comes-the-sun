export { weatherQueries, weatherKeys } from "./queries/useWeatherQuery";
export type { WeatherFetchParams } from "./model/types";
export { convertWeatherCodeToEmoji } from "./model/emoji";
export { fetchWeatherData } from "./api/fetchWeatherData";
export { parseHourlyByDate, parseDailyMinMax } from "./model/parse";
export type { OpenMeteoHourly } from "./model/types";
export { compareCurrentWeather } from "./model/compare";
export type { WeatherEmoji } from "./model/emoji";

// 옷 추천 관련
export { getClothingAdvice, convertClothingToKorean } from "./model/clothing";
