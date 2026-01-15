import { useEffect, useRef } from "react";
import { loadKakaoMaps, DEFAULT_CENTER, DEFAULT_LEVEL } from "@/shared/lib";
import {} from "@/shared/lib";

export function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);

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
    });
  }, []);

  return <div id="map" ref={mapRef} className="w-full h-full"></div>;
}
