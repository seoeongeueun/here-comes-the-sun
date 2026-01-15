import { REGION_MAP } from "./constants";

//긴 시도 명을 축약된 명으로 변환 (예: "서울특별시" -> "서울")
export function simplifySido(region: string): string {
  return REGION_MAP[region] ?? region;
}
