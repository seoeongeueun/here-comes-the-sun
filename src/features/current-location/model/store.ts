import { create } from "zustand";
import type { CurrentLocationState } from "./types";
import { roundToThreeDecimals } from "@/shared/lib";

export const useCurrentLocationStore = create<CurrentLocationState>((set) => ({
  currentLocation: null,
  setCurrentLocation: (location) =>
    set({
      currentLocation: {
        ...location,
        lat: roundToThreeDecimals(location.lat),
        lng: roundToThreeDecimals(location.lng),
      },
    }),
  clearCurrentLocation: () => set({ currentLocation: null }),
}));
