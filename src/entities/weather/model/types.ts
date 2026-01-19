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

//open meteo에서 받은 hourly 데이터를 파싱할 것이기 때문에
export type OpenMeteoHourly = NonNullable<OpenMeteoForecastResponse["hourly"]>;
export type OpenMeteoDaily = NonNullable<OpenMeteoForecastResponse["daily"]>;
