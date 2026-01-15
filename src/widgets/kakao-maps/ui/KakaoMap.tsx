import { useEffect, useRef } from "react";
import { loadKakaoMaps, DEFAULT_CENTER, DEFAULT_LEVEL } from "@/shared/lib";
import { MAJOR_CITIES } from "@/entities/city";
import { OverlayManager } from "../lib/overlayManager";
import "../styles.css";

export function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<OverlayManager | null>(null);

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

      // OverlayManager 생성
      const manager = new OverlayManager(map);
      managerRef.current = manager;

      // 모든 마커 생성
      MAJOR_CITIES.forEach((city) => {
        manager.createOverlay(city);
      });
    });

    return () => {
      managerRef.current?.clearAll();
    };
  }, []);

  return <div id="map" ref={mapRef} className="w-full h-full"></div>;
}
