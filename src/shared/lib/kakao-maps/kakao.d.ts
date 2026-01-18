export {};

declare global {
  namespace kakao {
    namespace maps {
      function load(callback: () => void): void;

      class LatLng {
        constructor(lat: number, lng: number);
        getLat(): number;
        getLng(): number;
      }

      class Map {
        constructor(
          container: HTMLElement,
          options: { center: LatLng; level?: number },
        );
      }

      class Marker {
        constructor(options: { map: Map; position: LatLng; title?: string });
      }

      class CustomOverlay {
        constructor(options: {
          position: LatLng;
          content: string | HTMLElement;
          yAnchor?: number;
          zIndex?: number;
        });
        setMap(map: Map | null): void;
        getContent(): string | HTMLElement;
        setZIndex(zIndex: number): void;
      }

      namespace event {
        function addListener(
          target: Map,
          type: string,
          callback: (mouseEvent: MouseEvent) => void,
        ): void;
      }

      namespace services {
        class Geocoder {
          constructor();
          coord2Address(
            lng: number,
            lat: number,
            callback: (result: GeocoderResult[], status: string) => void,
          ): void;
          address2coord(
            address: string,
            callback: (result: GeocoderResult[], status: string) => void,
          ): void;
          addressSearch(
            address: string,
            callback: (result: AddressSearchResult[], status: string) => void,
          ): void;
        }

        enum Status {
          OK = "OK",
          ZERO_RESULT = "ZERO_RESULT",
          ERROR = "ERROR",
        }

        interface GeocoderResult {
          address: {
            address_name: string;
            region_1depth_name: string;
            region_2depth_name: string;
            region_3depth_name: string;
            x: number;
            y: number;
          };
        }

        interface AddressSearchResult {
          address_name: string;
          address_type: string;
          x: string;
          y: string;
          road_address?: {
            address_name: string;
            region_1depth_name: string;
            region_2depth_name: string;
            region_3depth_name: string;
            road_name: string;
            underground_yn: string;
            main_building_no: string;
            sub_building_no: string;
            building_name: string;
            zone_no: string;
          };
          address?: {
            address_name: string;
            region_1depth_name: string;
            region_2depth_name: string;
            region_3depth_name: string;
            mountain_yn: string;
            main_building_no: string;
            sub_building_no: string;
          };
        }
      }

      interface MouseEvent {
        latLng: LatLng;
      }
    }
  }
}

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}
