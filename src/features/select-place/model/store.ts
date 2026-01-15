//유저가 지도에서 선택한 장소를 전역 상태로 관리
import { create } from "zustand";
import { simplifySido } from "@/shared/lib/kakao-maps/simplifySido";
import type { SelectedPlace } from "./types";

type SelectPlaceState = {
  selectedPlace: SelectedPlace | null;
  selectPlace: (place: SelectedPlace) => void;
  clearPlace: () => void;
};

export const useSelectPlaceStore = create<SelectPlaceState>((set) => ({
  selectedPlace: null,
  selectPlace: (place) =>
    set({
      selectedPlace: {
        ...place,
        sido: place.sido ? simplifySido(place.sido) : place.sido,
      }, //저장 단계에서 시도명 축약
    }),
  clearPlace: () => set({ selectedPlace: null }),
}));
