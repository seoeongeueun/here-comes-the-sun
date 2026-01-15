// entities/city/model/types.ts
// 날씨를 기본으로 보여줄 주요 도시 타입 정의
export interface City {
  id: string;
  lat: number;
  lng: number;
  sido: string;
  sigungu?: string;
  dong?: string;
}
