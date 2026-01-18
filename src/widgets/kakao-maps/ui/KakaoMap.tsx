import { useEffect, useRef, useState } from "react";
import {
  loadKakaoMaps,
  DEFAULT_CENTER,
  DEFAULT_LEVEL,
  coord2AddressAsync,
  getCurrentPositionAsync,
  addressToCoordAsync,
} from "@/shared/lib";
import { MAJOR_CITIES } from "@/entities/city";
import { OverlayManager } from "../lib/overlayManager";
import { useSelectLocationStore } from "@/features/select-location";
import { useCurrentLocationStore } from "@/features/current-location";
import { useQuery, useQueries } from "@tanstack/react-query";
import { weatherQueries, convertWeatherCodeToEmoji } from "@/entities/weather";
import { useToastStore } from "@/shared/ui";
import "../styles.css";

export function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<OverlayManager | null>(null);
  const geocoderRef = useRef<kakao.maps.services.Geocoder | null>(null);
  const selectedLocation = useSelectLocationStore((s) => s.selectedLocation);
  const selectLocation = useSelectLocationStore((s) => s.selectLocation);
  const tmpSelectedLocation = useSelectLocationStore(
    (s) => s.tmpSelectedLocation,
  );
  const clearLocation = useSelectLocationStore((s) => s.clearLocation);
  const setCurrentLocation = useCurrentLocationStore(
    (s) => s.setCurrentLocation,
  );
  const currentLocation = useCurrentLocationStore((s) => s.currentLocation);
  const show = useToastStore((s) => s.show);

  const [showMapError, setShowMapError] = useState(false); // 지도 로드 오류 상태

  // 주요 도시들의 날씨 데이터
  const majorCitiesWeather = useQueries({
    queries: MAJOR_CITIES.map((city) =>
      weatherQueries.nowByLatLng({ lat: city.lat, lng: city.lng }),
    ),
  });

  // 선택된 장소의 날씨 데이터
  const selectedLocationWeather = useQuery({
    ...weatherQueries.nowByLatLng({
      lat: selectedLocation?.lat ?? NaN,
      lng: selectedLocation?.lng ?? NaN,
    }),
    enabled: !!selectedLocation?.lat && !!selectedLocation?.lng,
  });

  const citiesEmojiAndTemp = MAJOR_CITIES.map((city, index) => {
    const data = majorCitiesWeather[index].data;
    const code = data?.code ?? null;

    return {
      id: city.id,
      sido: city.sido,
      temp: data?.temp ?? null,
      emoji: code == null ? "…" : convertWeatherCodeToEmoji(code),
    };
  });

  useEffect(() => {
    const manager = managerRef.current;
    if (!manager) return;

    citiesEmojiAndTemp.forEach((c) => {
      if (!c.id) return;
      if (c.emoji === "…") return;

      manager.updateCityWeather(c.id, c.emoji, c.temp ?? undefined);
    });
  }, [citiesEmojiAndTemp]);

  useEffect(() => {
    // 브라우저에서 현재 위치 가져오기
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
        if (error.code === 1) {
          show(
            "현재 위치를 가져올 수 없습니다.\n위치 정보 제공을 허용해주세요.",
          );
        } else {
          show("현재 위치를 가져오는 중 오류가 발생했습니다.");
        }
      });
  }, []);

  useEffect(() => {
    loadKakaoMaps()
      .then(() => {
        const map = new kakao.maps.Map(mapRef.current!, {
          center: new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
          level: DEFAULT_LEVEL,
        });

        console.log("Kakao Map initialized", map);

        setShowMapError(false);

        // 지도 클릭 이벤트 설정
        kakao.maps.event.addListener(
          map,
          "click",
          async (mouseEvent: kakao.maps.MouseEvent) => {
            const latlng = mouseEvent.latLng;
            const lng = latlng.getLng();
            const lat = latlng.getLat();

            const addressInfo = await coord2AddressAsync(
              geocoderRef.current!,
              lng,
              lat,
            );
            selectLocation(addressInfo);
          },
        );

        // 마커 관리를 위한 overlayManager 생성
        const manager = new OverlayManager(map);
        managerRef.current = manager;

        // 모든 마커 생성
        MAJOR_CITIES.forEach((city) => {
          manager.createOverlay(city);
        });

        // 장소 분석을 위한 geocoder
        geocoderRef.current = new kakao.maps.services.Geocoder();
      })
      .catch((e) => {
        console.error("Failed to load Kakao Maps:", e);
        setShowMapError(true);
      });

    return () => {
      managerRef.current?.clearAll();
    };
  }, []);

  useEffect(() => {
    //현재 좌표는 가져왔지만 아직 주소 정보가 없는 경우에만 변환을 시도
    if (
      currentLocation?.lng &&
      currentLocation?.lat &&
      currentLocation.sido.length === 0
    ) {
      if (!geocoderRef.current) return;

      coord2AddressAsync(
        geocoderRef.current,
        currentLocation.lng,
        currentLocation.lat,
      ).then((addressInfo) => {
        setCurrentLocation(addressInfo);

        //지도가 로드된 상태면 현재 위치 마커를 추가
        if (managerRef.current) {
          const { lat, lng } = addressInfo;
          managerRef.current.setCurrentLocationDot(lat, lng);
        }
      });
    }
  }, [currentLocation, setCurrentLocation]);

  useEffect(() => {
    if (!tmpSelectedLocation || !geocoderRef.current) return;

    const geocoder = geocoderRef.current;

    //임시 주소의 좌표를 검색해서 선택된 장소로 확정
    addressToCoordAsync(geocoder, tmpSelectedLocation)
      .then((location) => {
        clearLocation();

        selectLocation(location);
      })
      .catch((error) => {
        console.error("주소를 좌표로 변환하는 중 오류 발생:", error);
        show(
          "입력한 주소의 위치를 찾을 수 없습니다. 주소를 다시 확인해주세요.",
        );
      });
  }, [tmpSelectedLocation]);

  // 장소가 선택되면 디폴트 도시 마커는 전체 숨김 처리
  useEffect(() => {
    if (!managerRef.current) return;

    const manager = managerRef.current;

    if (
      selectedLocation &&
      selectedLocation.sido &&
      selectedLocation.sido.length > 0
    ) {
      // 주소가 있으면 기본 마커 숨기고 선택된 장소만 표시
      manager.hideAll();
      manager.createOverlay({
        id: "selected-location",
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        sido: selectedLocation.sido,
        sigungu: selectedLocation.sigungu,
        dong: selectedLocation.dong,
      });

      // 선택된 장소의 날씨 데이터가 있으면 마커 업데이트
      if (selectedLocationWeather.data?.code != null) {
        const emoji = convertWeatherCodeToEmoji(
          selectedLocationWeather.data.code,
        );
        manager.updateCityWeather(
          "selected-location",
          emoji,
          selectedLocationWeather.data.temp ?? undefined,
        );
      }
    } else {
      // 주소가 없으면 선택된 장소 완전히 삭제하고 기본 마커 표시
      manager.deleteOverlay("selected-location");
      manager.showAll();
    }
  }, [selectedLocation, selectedLocationWeather.data]);

  return (
    <div id="map" ref={mapRef} className="w-full h-full bg-white rounded-md">
      {showMapError && (
        <div className="text-background text-s flex flex-col justify-self-center items-center justify-center w-fit h-full pointer-events-none">
          <h3>⚡ 카카오 지도를 불러올 수 없습니다.</h3>
          <span>인터넷 연결 또는 남은 사용량을 확인해주세요.</span>
        </div>
      )}
    </div>
  );
}
