import type { City } from "@/entities/city";

//주소 기반으로 고유 ID 생성
export function makeUniqueCityId(city: City) {
  return (
    city.sido +
    city?.sigungu +
    city?.dong +
    `${city.lat.toFixed(5)},${city.lng.toFixed(5)}`
  );
}
