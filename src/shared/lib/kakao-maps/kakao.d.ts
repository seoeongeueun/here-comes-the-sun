export {};

declare global {
  interface Window {
    kakao: any; // 임시 타입이고 https://github.com/JaeSeoKim/kakao.maps.d.ts 에서 제공하는 타입 고려 중
  }
}
