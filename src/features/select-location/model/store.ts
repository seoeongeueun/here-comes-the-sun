//유저가 지도에서 선택한 장소를 전역 상태로 관리
import { create } from "zustand";
import { simplifySido } from "@/shared/lib/kakao-maps/simplifySido";
import type { SelectLocationState } from "./types";
import { roundToThreeDecimals } from "@/shared/lib";

//저장 단계에서 시도명 축약 + 좌표 반올림
// 좌표는 소수점 세자리(대략 100m 이내 오차)로 반올림
export const useSelectLocationStore = create<SelectLocationState>((set) => ({
  selectedLocation: null,
  tmpSelectedLocation: null,
  isSearchInProgress: false,
  selectLocation: (location) =>
    set({
      selectedLocation: {
        ...location,
        lat: roundToThreeDecimals(location.lat),
        lng: roundToThreeDecimals(location.lng),
        sido: location.sido ? simplifySido(location.sido) : location.sido,
      },
    }),
  clearLocation: () =>
    set({
      selectedLocation: null,
      tmpSelectedLocation: null,
      isSearchInProgress: false,
    }),
  setSearchInProgress: (inProgress) =>
    set({
      isSearchInProgress: inProgress,
    }),
  tmpSelectLocation: (address) =>
    set({
      tmpSelectedLocation: address,
    }), // 임시로 주소만 저장하는 함수
}));
