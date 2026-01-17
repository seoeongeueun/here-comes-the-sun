import type { DistrictIndex } from "../model";
import { convertAndSort } from "@/shared/lib";

//json 데이터로 검색용 인덱스 맵 생성
// 인덱스 단계에서는 simplify를 하지 않고 원본 그대로 인덱싱
export function buildDistrictsIndex(lines: string[]): DistrictIndex {
  const sigunguBySido = new Map<string, Set<string>>();
  const dongBySidoSigungu = new Map<string, Set<string>>();
  const sigunguToSidos = new Map<string, Set<string>>();
  const dongToSidoSigunguKeys = new Map<string, Set<string>>();

  for (const raw of lines) {
    const line = (raw ?? "").trim();
    if (!line) continue;

    const parts = line
      .split("-")
      .map((p) => p.trim())
      .filter(Boolean);
    const [sido, sigungu, dong] = parts;

    if (!sido) continue;

    // sido 등록
    if (!sigunguBySido.has(sido)) sigunguBySido.set(sido, new Set());

    // sigungu 등록
    if (sigungu) {
      sigunguBySido.get(sido)!.add(sigungu); // sido -> sigungu

      if (!sigunguToSidos.has(sigungu)) sigunguToSidos.set(sigungu, new Set());
      sigunguToSidos.get(sigungu)!.add(sido); // sigungu -> sido

      // dong 등록
      if (dong) {
        const key = `${sido}+${sigungu}`;
        if (!dongBySidoSigungu.has(key)) dongBySidoSigungu.set(key, new Set());
        dongBySidoSigungu.get(key)!.add(dong); // "sido+sigungu" -> dong

        if (!dongToSidoSigunguKeys.has(dong))
          dongToSidoSigunguKeys.set(dong, new Set());
        dongToSidoSigunguKeys.get(dong)!.add(key); // dong -> "sido+sigungu"
      }
    }
  }

  return {
    sidos: Array.from(sigunguBySido.keys()).sort(),
    sigunguBySido: convertAndSort(sigunguBySido),
    dongBySidoSigungu: convertAndSort(dongBySidoSigungu),
    sigunguToSidos: convertAndSort(sigunguToSidos),
    dongToSidoSigunguKeys: convertAndSort(dongToSidoSigunguKeys),
  };
}
