import type { Location } from "@/entities/location";

export type CurrentLocationState = {
  currentLocation: Location | null;
  setCurrentLocation: (location: Location) => void;
  clearCurrentLocation: () => void;
};
