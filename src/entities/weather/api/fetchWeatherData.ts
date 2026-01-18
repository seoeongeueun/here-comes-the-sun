export async function fetchWeatherData(): Promise<string[]> {
  const res = await fetch("/data/tmp_weather_data.json");
  if (!res.ok) throw new Error("Failed to load tmp_weather_data.json");
  return res.json(); // string[]
}
