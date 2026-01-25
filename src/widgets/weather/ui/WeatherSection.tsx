import { useQuery } from "@tanstack/react-query";
import {
  getPrecipitationInHourlyData,
  weatherQueries,
  needsUmbrella,
} from "@/entities/weather";
import { useCurrentLocationStore } from "@/features/current-location";
import { useSelectLocationStore } from "@/features/select-location";
import { useEffect, useMemo } from "react";
import { WeatherImage } from "@/shared/ui";
import {
  parseHourlyByDate,
  convertWeatherCodeToEmoji,
  parseDailyMinMax,
  getClothingAdvice,
  convertClothingToKorean,
} from "@/entities/weather";

interface WeatherSectionProps {
  mode?: "current" | "selected";
}

export function WeatherSection({ mode = "current" }: WeatherSectionProps) {
  // 현재 위치의 날씨 데이터
  const currentLocation = useCurrentLocationStore((s) => s.currentLocation);
  const selectedLocation = useSelectLocationStore((s) => s.selectedLocation);

  // mode에 따라 사용할 location 결정
  const location = mode === "selected" ? selectedLocation : currentLocation;

  const {
    data: locationWeather,
    isLoading,
    isError,
  } = useQuery({
    ...weatherQueries.byLatLng({
      lat: location?.lat ?? NaN,
      lng: location?.lng ?? NaN,
    }),
    enabled: !!location?.lat && !!location?.lng,
  });

  const hourlyData = locationWeather?.hourly;
  const dailyData = locationWeather?.daily;
  const currentTime = locationWeather?.current?.time;

  const hourlyToday = useMemo(() => {
    if (!hourlyData) return [];

    const todayDate = currentTime?.slice(0, 10);
    if (!todayDate) return [];

    console.log(parseHourlyByDate(hourlyData, todayDate));
    return parseHourlyByDate(hourlyData, todayDate);
  }, [hourlyData, currentTime]);

  const dailyMinMax = useMemo(() => {
    if (!dailyData) return { min: null, max: null };

    const todayDate = currentTime?.slice(0, 10);
    if (!todayDate) return { min: null, max: null };
    return parseDailyMinMax(dailyData, todayDate);
  }, [dailyData, currentTime]);

  const precipitationData = useMemo(() => {
    if (!hourlyData) return [];
    const todayDate = currentTime?.slice(0, 10);
    if (!todayDate) return [];

    return getPrecipitationInHourlyData(hourlyData, todayDate);
  }, [hourlyData, currentTime]);

  const umbrellaResult = needsUmbrella(precipitationData);

  const clothingAdvice = useMemo(() => {
    const { min, max } = dailyMinMax;
    if (min === null || max === null) {
      return { options: [], rainExtras: [], hasTempDiff: false };
    }

    return getClothingAdvice(
      min,
      max,
      umbrellaResult.needed,
      umbrellaResult.isHeavyRain,
    );
  }, [dailyMinMax, umbrellaResult]);

  useEffect(() => {
    //현재 시간은 어느 hourly 데이터와 매칭되는지 확인
    if (hourlyToday.length === 0) return;
    const now = new Date();
    const nowHour = now.getHours();
    const nowPoint = hourlyToday.find((point) => point.hour === nowHour);

    if (nowPoint) {
      requestAnimationFrame(() => {
        const element = document.getElementById(
          `hourly-weather-${nowPoint.time}`,
        );
        if (element) {
          element.classList.add("border-2");
          element.scrollIntoView({ behavior: "smooth", inline: "center" });
        }
      });
    }
  }, [hourlyToday]);

  return (
    <div className="flex flex-col w-full">
      <section className="flex w-full h-fit flex-col">
        <header className="flex-wrap gap-0! md:gap-3">
          <h2>
            {location && location.sido?.length > 0
              ? `${location.sido} ${location.sigungu} ${location.dong}`
              : "현 위치"}
            의 시간별 날씨
          </h2>
          {!isLoading && !isError && (
            <div className="flex flex-row items-center justify-between md:py-2 text-xs text-white gap-2">
              <p>
                최저{" "}
                {dailyMinMax.min != null
                  ? `${Math.round(dailyMinMax.min)}°C`
                  : "N/A"}
              </p>
              <p>/</p>
              <p>
                최고{" "}
                {dailyMinMax.max != null
                  ? `${Math.round(dailyMinMax.max)}°C`
                  : "N/A"}
              </p>
            </div>
          )}
        </header>
        <article
          id="hourly-chart"
          className="w-full h-fit text-center overflow-x-auto flex flex-row gap-3"
        >
          {isLoading && (
            <div className="h-30 rounded-sm bg-gray-300 animate-[pulse_1.6s_ease-in-out_infinite] text-sm w-full"></div>
          )}
          {isError && !isLoading && (
            <div className="h-30 flex flex-col justify-center items-center text-secondary text-sm w-full text-center">
              <span>날씨 정보를 불러올 수 없습니다 </span>
              <span className="text-s">잠시 후 다시 시도해주세요</span>
            </div>
          )}
          {!isLoading && !isError && (
            <>
              {hourlyToday.length !== 0 ? (
                hourlyToday.map((point) => (
                  <figure
                    key={point.time}
                    id={`hourly-weather-${point.time}`}
                    className="bg-white border-theme rounded-sm flex flex-col items-center justify-center p-2 gap-2 aspect-square min-w-20 h-30"
                  >
                    <time className="text-black text-xxs" dateTime={point.time}>
                      {point.time.slice(11, 16)}
                    </time>
                    <WeatherImage
                      weather={convertWeatherCodeToEmoji(point.weatherCode)}
                      size="medium"
                    />
                    <span className="text-xs md:text-s text-error">
                      {point.temperature != null
                        ? `${Math.round(point.temperature)}°C`
                        : "N/A"}
                    </span>
                  </figure>
                ))
              ) : (
                <p className="w-full h-30 text-secondary text-center flex items-center justify-center">
                  해당 장소의 정보가 제공되지 않습니다
                </p>
              )}
            </>
          )}
        </article>
      </section>

      <section className="flex flex-col">
        <header className="flex flex-row items-center gap-3">
          <h2 className="text-sm">날씨에 맞는 옷</h2>
          {clothingAdvice.hasTempDiff && (
            <span className="text-xs">
              일교차가 큰 날이에요. 옷차림에 유의하세요.
            </span>
          )}
        </header>
        {isLoading && (
          <div className="h-30 rounded-sm bg-gray-300 animate-[pulse_1.6s_ease-in-out_infinite] text-sm w-full"></div>
        )}
        {!isLoading && clothingAdvice.options.length > 0 && (
          <ul className="bg-white rounded-sm flex flex-row items-center justify-start w-full flex-wrap ">
            {clothingAdvice.options.map((advice, index) => (
              <li
                key={index}
                className="h-30 text-xs flex flex-col items-center justify-evenly basis-1/3 md:basis-1/4 lg:basis-1/6"
              >
                <img
                  src={`/icon/${advice}.png`}
                  alt={convertClothingToKorean([advice])[0] + " 아이콘"}
                  width={56}
                  height={56}
                  className="w-14 h-14 object-contain"
                />
                <span>{convertClothingToKorean([advice])[0]}</span>
              </li>
            ))}
            {umbrellaResult.needed && (
              <li className="h-30 text-xs flex flex-col items-center justify-center gap-1 basis-1/3 md:basis-1/4 lg:basis-1/6">
                <span className="text-md">+</span>
                <span>눈/비 예보</span>
              </li>
            )}
            {clothingAdvice.rainExtras.map((advice, index) => (
              <li
                key={index}
                className="h-30 text-xs flex flex-col items-center justify-evenly basis-1/3 md:basis-1/4 lg:basis-1/6"
              >
                <img
                  src={`/icon/${advice}.png`}
                  alt={convertClothingToKorean([advice])[0] + " 아이콘"}
                  width={56}
                  height={56}
                  className="w-14 h-14 object-contain"
                />
                <span>{convertClothingToKorean([advice])[0]}</span>
              </li>
            ))}
          </ul>
        )}
        {((!isLoading && clothingAdvice.options.length === 0) || isError) && (
          <div className="h-30 text-secondary text-center w-full flex items-center justify-center">
            해당 장소의 옷차림 정보를 제공할 수 없습니다
          </div>
        )}
      </section>
    </div>
  );
}
