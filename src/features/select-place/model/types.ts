import type { Location } from "@/entities/location";

export type SelectPlaceState = {
  selectedPlace: Location | null;
  selectPlace: (place: Location) => void;
  clearPlace: () => void;
};
