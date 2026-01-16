//유저가 지도에서 선택한 장소를 전역 상태로 관리
import { create } from "zustand";
import { simplifySido } from "@/shared/lib/kakao-maps/simplifySido";
import type { SelectPlaceState } from "./types";
import { roundToThreeDecimals } from "@/shared/lib";

//저장 단계에서 시도명 축약 + 좌표 반올림
// 좌표는 소수점 세자리(대략 100m 이내 오차)로 반올림
export const useSelectPlaceStore = create<SelectPlaceState>((set) => ({
  selectedPlace: null,
  selectPlace: (place) =>
    set({
      selectedPlace: {
        ...place,
        lat: roundToThreeDecimals(place.lat),
        lng: roundToThreeDecimals(place.lng),
        sido: place.sido ? simplifySido(place.sido) : place.sido,
      },
    }),
  clearPlace: () => set({ selectedPlace: null }),
}));
