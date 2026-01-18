export type WeatherFetchParams = {
  lat: number;
  lng: number;
};

export type OpenMeteoForecastResponse = {
  latitude: number;
  longitude: number;
  timezone: string;

  current?: {
    time: string;
    interval: number;
    temperature_2m: number;
    weather_code: number;
    precipitation: number;
    snowfall: number;
  };

  hourly?: {
    time: string[];
    temperature_2m?: number[];
    weather_code?: number[];
    precipitation?: number[];
    snowfall?: number[];
  };

  daily?: {
    time: string[];
    temperature_2m_min?: number[];
    temperature_2m_max?: number[];
    precipitation_probability_max?: number[];
    precipitation_hours?: number[];
    precipitation_sum?: number[];
    snowfall_sum?: number[];
  };
};
