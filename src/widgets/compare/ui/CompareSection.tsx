import { useCurrentLocationStore } from "@/features/current-location";
import { useSelectLocationStore } from "@/features/select-location";
import { getCurrentPositionAsync } from "@/shared/lib";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  weatherQueries,
  compareCurrentWeather,
  convertWeatherCodeToEmoji,
} from "@/entities/weather";
import { WeatherImage } from "@/shared/ui";

export function CompareSection() {
  const currentLocation = useCurrentLocationStore((s) => s.currentLocation);
  const selectedLocation = useSelectLocationStore((s) => s.selectedLocation);
  const setCurrentLocation = useCurrentLocationStore(
    (s) => s.setCurrentLocation,
  );
  const [isError, setIsError] = useState(false);

  const currentLocationWeather = useQuery({
    ...weatherQueries.byLatLng({
      lat: currentLocation?.lat ?? NaN,
      lng: currentLocation?.lng ?? NaN,
    }),
    enabled: !!currentLocation?.lat && !!currentLocation?.lng,
  });

  const selectedLocationWeather = useQuery({
    ...weatherQueries.byLatLng({
      lat: selectedLocation?.lat ?? NaN,
      lng: selectedLocation?.lng ?? NaN,
    }),
    enabled: !!selectedLocation?.lat && !!selectedLocation?.lng,
  });

  const comparisonResult = useMemo(() => {
    if (!currentLocationWeather.data || !selectedLocationWeather.data) {
      return null;
    }
    return compareCurrentWeather(
      currentLocationWeather.data,
      selectedLocationWeather.data,
    );
  }, [currentLocationWeather.data, selectedLocationWeather.data]);

  useEffect(() => {
    if (
      !currentLocation ||
      !Number.isFinite(currentLocation.lat) ||
      !Number.isFinite(currentLocation.lng)
    ) {
      getCurrentPositionAsync()
        .then((position) => {
          setCurrentLocation({
            lat: position.lat,
            lng: position.lng,
            sido: "",
          });
        })
        .catch((error) => {
          console.log("현재 위치 가져오기 실패:", error);
          setIsError(true);
        });
    }
  }, [currentLocation, setCurrentLocation]);

  const precipitationMessage = useMemo(() => {
    const message = { tmp: "", percip: "", isHeavy: "" };

    if (!comparisonResult) return "";

    const roundedDiff = Math.round(comparisonResult.tmpDiff);
    const diff = Math.abs(roundedDiff);
    console.log("roundedDiff:", roundedDiff);

    if (roundedDiff > 0) {
      message.tmp = `🔥 선택된 위치의 현재 기온이 ${diff}° 더 높아요. `;
    } else if (roundedDiff < 0) {
      message.tmp = `🧊 선택된 위치의 현재 기온이 ${diff}° 더 낮아요. `;
    } else {
      message.tmp = `🌡️ 두 장소의 현재 기온이 동일해요. `;
    }

    // 두 곳 다 강수 없음
    if (!comparisonResult.hasShowerDiff) {
      message.percip = comparisonResult.isShowerCurrent
        ? "☂️ 두 장소 모두 비/눈 예보가 있어요."
        : "🌂 두 장소 모두 비/눈 예보가 없어요.";
    } else {
      message.percip = comparisonResult.isShowerCurrent
        ? `🌂 선택된 위치는 비/눈 예보가 없어요. 우산을 챙기지 않으셔도 돼요.`
        : `☂️ 선택된 위치는 비/눈 예보가 있어요. 우산을 챙겨주세요.`;
    }

    if (comparisonResult.hasShowerLevelDiff) {
      message.isHeavy = comparisonResult.isHeavyShowerCurrent
        ? "🌧️ 선택된 위치는 현재 위치보다 약한 비가 내릴 예정이에요."
        : "🌧️ 선택된 위치는 현재 위치보다 강한 비가 내릴 예정이에요.";
    }
    return message;
  }, [comparisonResult]);

  const canCompare =
    !!comparisonResult && !!selectedLocation && !!currentLocation;

  return (
    <section>
      <header>
        <h2>현 위치와 비교</h2>
      </header>
      {!currentLocation || isError ? (
        <p className="h-30 text-secondary text-sm flex items-center justify-center">
          현재 위치 정보를 가져올 수 없습니다
        </p>
      ) : (
        <div className="w-full bg-white rounded-sm h-fit flex flex-row justify-evenly items-center px-4 py-4 lg:px-6">
          {canCompare && (
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row gap-1 py-4 w-full justify-around items-start">
                <div className="flex flex-col items-center gap-2 w-1/2">
                  <WeatherImage
                    size="large"
                    weather={convertWeatherCodeToEmoji(
                      comparisonResult.selectedCode,
                    )}
                  />
                  <div className="flex flex-row items-start gap-3">
                    <span className="lg:mt-1.5 text-xxs text-black whitespace-nowrap">
                      선택 위치
                    </span>
                    <span className="text-xs lg:text-sm text-error">
                      {`${selectedLocation.sido} ${selectedLocation.sigungu} ${selectedLocation.dong}`}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 w-1/2">
                  <WeatherImage
                    size="large"
                    weather={convertWeatherCodeToEmoji(
                      comparisonResult.currentCode,
                    )}
                  />
                  <div className="flex flex-row items-start gap-3">
                    <span className="lg:mt-1.5 text-xxs text-black whitespace-nowrap">
                      현 위치
                    </span>
                    <span className="text-xs lg:text-sm text-error">
                      {`${currentLocation.sido} ${currentLocation.sigungu} ${currentLocation.dong}`}
                    </span>
                  </div>
                </div>
              </div>
              {Object.values(precipitationMessage).map((msg, index) => (
                <p key={index} className="text-xs lg:text-s">
                  {msg}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
