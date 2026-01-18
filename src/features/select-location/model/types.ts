import type { Location } from "@/entities/location";

export type SelectLocationState = {
  selectedLocation: Location | null;
  tmpSelectedLocation: string | null;
  isSearchInProgress: boolean;
  setSearchInProgress: (inProgress: boolean) => void;
  selectLocation: (location: Location) => void;
  clearLocation: () => void;
  tmpSelectLocation: (address: string) => void;
};
