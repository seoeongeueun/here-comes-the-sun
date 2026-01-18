import type { Location } from "@/entities/location";

export type SelectPlaceState = {
  selectedPlace: Location | null;
  tmpSelectedPlace: string | null;
  selectPlace: (place: Location) => void;
  clearPlace: () => void;
  tmpSelectPlace: (address: string) => void;
};
