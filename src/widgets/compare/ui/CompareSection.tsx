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

  // 주소 포맷팅
  const formatAddress = useMemo(
    () =>
      (
        location: typeof currentLocation | typeof selectedLocation,
        suffix = "",
      ) => {
        if (!location?.sido) return suffix ? `현 위치 ${suffix}` : "현 위치";
        return `${location.sido} ${location.sigungu} ${location.dong} ${suffix}`.trim();
      },
    [],
  );

  const selectedCityAddress = useMemo(
    () => formatAddress(selectedLocation, "(선택된 위치)"),
    [selectedLocation, formatAddress],
  );

  const currentLocationAddress = useMemo(
    () => formatAddress(currentLocation, "(현 위치)"),
    [currentLocation, formatAddress],
  );

  const currentWeatherData = currentLocationWeather.data?.current;
  const selectedWeatherData = selectedLocationWeather.data?.current;

  const comparisonResult = useMemo(() => {
    if (!currentWeatherData || !selectedWeatherData) {
      return null;
    }
    return compareCurrentWeather(currentWeatherData, selectedWeatherData);
  }, [currentWeatherData, selectedWeatherData]);

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

  const tempMessage = useMemo(() => {
    if (!comparisonResult) return "";
    const roundedDiff = Math.round(comparisonResult.tmpDiff);
    const diff = Math.abs(roundedDiff);
    return roundedDiff > 0
      ? `🔥 선택된 위치의 기온이 ${diff}° 더 높아요`
      : roundedDiff === 0
        ? `🌡️ 두 장소의 현재 기온이 동일해요`
        : `🧊 선택된 위치의 기온이 ${diff}° 더 낮아요`;
  }, [comparisonResult]);

  const precipitationMessage = useMemo(() => {
    if (!comparisonResult) return "";
    if (!comparisonResult.hasShowerDiff) {
      return "🌂 두 장소 모두 비/눈이 내리지 않고 있어요";
    }
    return comparisonResult.isShowerCurrent
      ? `☂️ 선택된 위치는 비/눈이 내리지 않고 있어요`
      : `☂️ 선택된 위치는 비/눈이 내리고 있어요. 우산을 챙겨주세요.`;
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
        <div className="w-full bg-white rounded-sm h-fit flex flex-row justify-evenly items-center px-4 py-4 md:px-6">
          {canCompare && (
            <div className="flex flex-col gap-2 w-full">
              {/* 날씨 이모지 & 주소 */}
              <div className="flex flex-row py-4 w-full justify-around items-start">
                <div className="flex flex-col items-center gap-2 w-1/2">
                  <span className="text-lg ">
                    {convertWeatherCodeToEmoji(comparisonResult.selectedCode)}
                  </span>
                  <span className="text-s md:text-sm text-error">
                    {selectedCityAddress}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 w-1/2">
                  <span className="text-lg">
                    {convertWeatherCodeToEmoji(comparisonResult.currentCode)}
                  </span>
                  <span className="text-s md:text-sm text-error">
                    {currentLocationAddress}
                  </span>
                </div>
              </div>
              <p className="text-xs md:text-s">{tempMessage}</p>
              <p className="text-xs md:text-s">{precipitationMessage}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
