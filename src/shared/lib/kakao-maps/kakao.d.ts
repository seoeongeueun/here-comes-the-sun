export {};

declare global {
  namespace kakao {
    namespace maps {
      function load(callback: () => void): void;

      class LatLng {
        constructor(lat: number, lng: number);
      }

      class Map {
        constructor(
          container: HTMLElement,
          options: { center: LatLng; level?: number }
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
    }
  }
}

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}
