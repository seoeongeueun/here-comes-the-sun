import { useEffect, useRef } from "react";
import { loadKakaoMaps, DEFAULT_CENTER, DEFAULT_LEVEL } from "@/shared/lib";
import { MAJOR_CITIES } from "@/entities/city";
import { OverlayManager } from "../lib/overlayManager";
import "../styles.css";
import { useSelectPlaceStore } from "@/features/select-place/model/store";
import type { KakaoRegionAddress } from "../lib/types";

export function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<OverlayManager | null>(null);
  const selectedPlace = useSelectPlaceStore((s) => s.selectedPlace);
  const selectPlace = useSelectPlaceStore((s) => s.selectPlace);

  useEffect(() => {
    loadKakaoMaps().then(() => {
      const map = new window.kakao.maps.Map(mapRef.current!, {
        center: new window.kakao.maps.LatLng(
          DEFAULT_CENTER.lat,
          DEFAULT_CENTER.lng
        ),
        level: DEFAULT_LEVEL,
      });

      console.log("Kakao Map initialized", map);

      // 마커 관리를 위한 overlayManager 생성
      const manager = new OverlayManager(map);
      managerRef.current = manager;

      // 모든 마커 생성
      MAJOR_CITIES.forEach((city) => {
        manager.createOverlay(city);
      });

      // 장소 분석을 위한 geocoder 생성
      const geocoder = new kakao.maps.services.Geocoder();

      // 지도 클릭 이벤트 설정
      kakao.maps.event.addListener(
        map,
        "click",
        (mouseEvent: kakao.maps.MouseEvent) => {
          const latlng = mouseEvent.latLng;
          const lng = latlng.getLng();
          const lat = latlng.getLat();

          geocoder.coord2Address(lng, lat, (result, status) => {
            // 주소 정보가 없으면 굳이 처리하지 않는다
            if (status !== kakao.maps.services.Status.OK || !result?.length) {
              selectPlace({ lat, lng, sido: "" });
              return;
            }

            const address = result[0].address as KakaoRegionAddress;

            selectPlace({
              lat,
              lng,
              sido: address.region_1depth_name,
              sigungu: address.region_2depth_name,
              dong: address.region_3depth_name,
            });
          });
        }
      );
    });

    return () => {
      managerRef.current?.clearAll();
    };
  }, [selectPlace]);

  // 장소가 선택되면 디폴트 도시 마커는 전체 숨김 처리
  useEffect(() => {
    if (!managerRef.current) return;

    const manager = managerRef.current;

    if (selectedPlace && selectedPlace.sido && selectedPlace.sido.length > 0) {
      // 주소가 있으면 기본 마커 숨기고 선택된 장소만 표시
      manager.hideAll();
      manager.createOverlay({
        id: "selected-place",
        lat: selectedPlace.lat,
        lng: selectedPlace.lng,
        sido: selectedPlace.sido,
        sigungu: selectedPlace.sigungu,
        dong: selectedPlace.dong,
      });
    } else {
      // 주소가 없으면 선택된 장소 완전히 삭제하고 기본 마커 표시
      manager.deleteOverlay("selected-place");
      manager.showAll();
    }
  }, [selectedPlace]);

  return (
    <div
      id="map"
      ref={mapRef}
      className="w-full h-full rounded-xl border-4 border-white"
    ></div>
  );
}
