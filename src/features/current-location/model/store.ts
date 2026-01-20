import { create } from "zustand";
import type { CurrentLocationState } from "./types";

export const useCurrentLocationStore = create<CurrentLocationState>((set) => ({
  currentLocation: null,
  setCurrentLocation: (location) =>
    set({
      currentLocation: {
        ...location,
        lat: location.lat,
        lng: location.lng,
      },
    }),
  clearCurrentLocation: () => set({ currentLocation: null }),
}));
