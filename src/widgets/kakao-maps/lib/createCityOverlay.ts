import type { City } from "@/entities/city";
import { fillCityMarkerContent } from "./fillCityMarkerContent";

export function createCityOverlay(map: kakao.maps.Map, city: City) {
  const htmlString = fillCityMarkerContent(city);
  const wrapper = document.createElement("div");
  wrapper.innerHTML = htmlString;
  const content = wrapper.firstElementChild as HTMLElement;

  const overlay = new window.kakao.maps.CustomOverlay({
    position: new window.kakao.maps.LatLng(city.lat, city.lng),
    content: content,
    yAnchor: 1,
  });

  overlay.setMap(map);
  return overlay;
}
