import type { City } from "@/entities/city";
import { fillCityMarkerContent } from "./fillCityMarkerContent";

interface OverlayItem {
  overlay: kakao.maps.CustomOverlay;
  content: HTMLElement;
  city: City;
}

export class OverlayManager {
  private overlays: Map<string, OverlayItem> = new Map();
  private activeOverlay: OverlayItem | null = null;
  private currentLocationDot: kakao.maps.CustomOverlay | null = null;
  private map: kakao.maps.Map;

  constructor(map: kakao.maps.Map) {
    this.map = map;
  }

  //마커 생성 및 오버레이 추가
  createOverlay(city: City): kakao.maps.CustomOverlay {
    const htmlString = fillCityMarkerContent(city);
    const wrapper = document.createElement("div");
    wrapper.innerHTML = htmlString;
    const content = wrapper.firstElementChild as HTMLElement;

    // 마커 클릭 이벤트 -> 클릭된 마커를 가장 위로 올린다
    content.addEventListener("click", () => {
      this.setActive(city.id);
    });

    const overlay = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(city.lat, city.lng),
      content: content,
      yAnchor: 1,
      zIndex: 10,
    });

    overlay.setMap(this.map);

    const item: OverlayItem = { overlay, content, city };
    this.overlays.set(city.id, item);

    return overlay;
  }

  // 특정 마커를 활성 상태 (높은 z-index) 로 설정
  setActive(cityId: string): void {
    const currentItem = this.overlays.get(cityId);
    if (!currentItem) return;

    // 이미 활성화된 마커를 다시 클릭하면 비활성화
    if (this.activeOverlay === currentItem) {
      currentItem.overlay.setZIndex(10);
      this.activeOverlay = null;
      return;
    }

    // 이전 활성 마커 비활성화
    if (this.activeOverlay) {
      this.activeOverlay.overlay.setZIndex(10);
    }

    currentItem.overlay.setZIndex(50);
    this.activeOverlay = currentItem;

    console.log(currentItem.content.classList);
  }

  // 특정 마커 하나만 숨기기
  hide(cityId: string): void {
    const item = this.overlays.get(cityId);
    if (item) {
      item.overlay.setMap(null);
    }
  }

  // 특정 마커 하나만 완전히 삭제
  deleteOverlay(cityId: string): void {
    const item = this.overlays.get(cityId);
    if (item) {
      item.overlay.setMap(null);
      this.overlays.delete(cityId);
    }
  }

  //특정 마커 하나만 보이기
  show(cityId: string): void {
    const item = this.overlays.get(cityId);
    if (item) {
      item.overlay.setMap(this.map);
    }
  }

  // 모든 마커를 숨기기
  hideAll(): void {
    this.overlays.forEach((item) => {
      item.overlay.setMap(null);
    });
  }

  // 모든 마커를 다시 노출
  showAll(): void {
    this.overlays.forEach((item) => {
      item.overlay.setMap(this.map);
    });
  }

  //모든 마커를 제거
  clearAll(): void {
    this.hideAll();
    this.overlays.clear();
  }

  setCurrentLocationDot(lat: number, lng: number) {
    const position = new kakao.maps.LatLng(lat, lng);

    // 기존 점 제거
    if (this.currentLocationDot) {
      this.currentLocationDot.setMap(null);
      this.currentLocationDot = null;
    }

    const dot = document.createElement("div");
    dot.className = "location-dot";

    const overlay = new kakao.maps.CustomOverlay({
      position,
      content: dot,
      yAnchor: 0.5,
      zIndex: 999,
    });

    overlay.setMap(this.map);
    this.currentLocationDot = overlay;
  }

  clearCurrentLocationDot() {
    if (!this.currentLocationDot) return;
    this.currentLocationDot.setMap(null);
    this.currentLocationDot = null;
  }
}
