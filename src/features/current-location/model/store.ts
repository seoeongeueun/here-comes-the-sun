import { create } from "zustand";
import type { CurrentLocationState } from "./types";

export const useCurrentLocationStore = create<CurrentLocationState>((set) => ({
  currentLocation: null,
  setCurrentLocation: (location) => set({ currentLocation: location }),
  clearCurrentLocation: () => set({ currentLocation: null }),
}));
