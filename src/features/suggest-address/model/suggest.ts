// entities/address/model/suggest.ts
import type { DistrictIndex } from "@/entities/district/model";
import { simplifySido } from "@/shared/lib";
import {
  normalizeQuery,
  joinLabel,
  uniqueByLabel,
  makeKey,
  splitKey,
} from "./normalize";

export type SuggestAddress = {
  level: "sido" | "sigungu" | "dong";
  label: string; // 화면에 표시할 simplify를 거친 주소

  sido?: string; // 원본 (예시: "서울특별시")
  sigungu?: string;
  dong?: string;
};

/**
 * 규칙 요약
 * - 1토큰 입력: 시도 > 시군구 > 동 우선순위
 *   - 시도 EXACT면: 해당 시도의 시군구 전체를 추천
 *   - 시군구 EXACT면:
 *     - 여러 시도에 존재: "서울 중구", "부산 중구" 등 구 선택 먼저
 *     - 유일 시도: 해당 구의 동 전체
 *   - 동 후보면: "시도 시군구 동" 풀 경로
 *
 * - 2토큰 이상(시도+시군구...):
 *   - 시도 찾고, 시군구가 해당 시도에 EXACT면: 그 구의 동 전체 (동prefix 없어도)
 *   - EXACT가 아니면: 해당 시도 내 시군구 후보
 *   - 3토큰(동prefix) 있으면: 그 구의 동을 prefix 필터
 *
 *  key 구분자는 buildDistrictIndex에서 쓰는 것과 반드시 동일해야 함
 *    현재는 `${sido}+${sigungu}` 기준
 */
export function suggestAddress(
  query: string,
  index: DistrictIndex,
): SuggestAddress[] {
  const tokens = normalizeQuery(query);
  if (tokens.length === 0) return [];

  // 키 배열은 입력 1회당 1번만 생성 (불필요 반복 제거)
  const sigunguKeys = Array.from(index.sigunguToSidos.keys());
  const dongKeys = Array.from(index.dongToSidoSigunguKeys.keys());

  // -------------------------
  // 1) 단일 토큰: 시도 > 시군구 > 동
  // -------------------------
  if (tokens.length === 1) {
    const q = tokens[0];

    // 1-1) 시도 EXACT면: 해당 시도의 시군구 전체
    const exactSido = findExactSido(q, index.sidos);
    if (exactSido) {
      const sigungus = index.sigunguBySido.get(exactSido) ?? [];
      return uniqueByLabel(
        sigungus.map((sigungu) => ({
          level: "sigungu",
          label: joinLabel([simplifySido(exactSido), sigungu]),
          sido: exactSido,
          sigungu,
        })),
      );
    }

    // 1-2) 시도 후보가 있으면: 시도 후보만
    const sidoCandidates = matchSidoAll(q, index.sidos);
    if (sidoCandidates.length > 0) {
      return uniqueByLabel(
        sidoCandidates.map((sido) => ({
          level: "sido",
          label: simplifySido(sido),
          sido,
        })),
      );
    }

    // 1-3) 시군구 EXACT면:
    // - 여러 시도에 있으면 구 선택(동 펼치지 않음)
    // - 유일 시도면 동 전체
    const exactSigungu = sigunguKeys.find((k) => k === q) ?? null;
    if (exactSigungu) {
      return uniqueByLabel(suggestFromExactSigungu(exactSigungu, index));
    }

    // 1-4) 시군구 후보 (강남 -> 강남구)
    const sigunguCandidates = matchKeysByPrefix(q, sigunguKeys);
    if (sigunguCandidates.length > 0) {
      return uniqueByLabel(
        suggestFromSigunguCandidates(sigunguCandidates, index),
      );
    }

    // 1-5) 동 후보 (도곡 -> 도곡동)
    const dongCandidates = matchKeysByPrefix(q, dongKeys);
    if (dongCandidates.length > 0) {
      return uniqueByLabel(suggestFromDongCandidates(dongCandidates, index));
    }

    return [];
  }

  // -------------------------
  // 2) 두 토큰 이상: 시도 + 시군구 (+ 동prefix)
  // -------------------------
  const sido = findBestSido(tokens[0], index.sidos);
  if (!sido) return [];

  const sigunguToken = tokens[1];
  const sigungus = index.sigunguBySido.get(sido) ?? [];

  // 시군구가 해당 시도에 EXACT면, 동prefix 없어도 동 전체를 보여준다
  const exactSigunguInSido = sigungus.find((x) => x === sigunguToken) ?? null;

  // 동prefix가 있으면 exact 구에서 동prefix로 필터링하는 게 우선
  const dongPrefix = tokens[2] ?? "";

  if (exactSigunguInSido) {
    const key = makeKey(sido, exactSigunguInSido);
    const dongs = index.dongBySidoSigungu.get(key) ?? [];

    if (!dongPrefix) {
      // 동prefix 없으면 동 전체
      if (dongs.length > 0) {
        return uniqueByLabel(
          dongs.map((dong) => ({
            level: "dong",
            label: joinLabel([simplifySido(sido), exactSigunguInSido, dong]),
            sido,
            sigungu: exactSigunguInSido,
            dong,
          })),
        );
      }

      // 동이 없으면 구만
      return [
        {
          level: "sigungu",
          label: joinLabel([simplifySido(sido), exactSigunguInSido]),
          sido,
          sigungu: exactSigunguInSido,
        },
      ];
    }

    // 동prefix가 있으면 필터
    const filtered = matchLoose(dongPrefix, dongs);
    return uniqueByLabel(
      filtered.map((dong) => ({
        level: "dong",
        label: joinLabel([simplifySido(sido), exactSigunguInSido, dong]),
        sido,
        sigungu: exactSigunguInSido,
        dong,
      })),
    );
  }

  // 구가 exact가 아니면: 해당 시도 내 구 후보
  const sigunguMatches = matchLoose(sigunguToken, sigungus);
  return uniqueByLabel(
    sigunguMatches.map((sigungu) => ({
      level: "sigungu",
      label: joinLabel([simplifySido(sido), sigungu]),
      sido,
      sigungu,
    })),
  );
}

/** 시도 후보: 원본/축약 모두 startsWith 우선 */
function matchSidoAll(token: string, sidos: string[]): string[] {
  const t = token.trim();
  if (!t) return [];

  const startsExact = sidos.filter((s) => s.startsWith(t));
  if (startsExact.length) return startsExact;

  const startsSimple = sidos.filter((s) => simplifySido(s).startsWith(t));
  if (startsSimple.length) return startsSimple;

  const includesExact = sidos.filter((s) => s.includes(t));
  if (includesExact.length) return includesExact;

  return sidos.filter((s) => simplifySido(s).includes(t));
}

function findBestSido(token: string, sidos: string[]): string | null {
  return matchSidoAll(token, sidos)[0] ?? null;
}

function findExactSido(token: string, sidos: string[]): string | null {
  const t = token.trim();
  if (!t) return null;
  return sidos.find((s) => s === t || simplifySido(s) === t) ?? null;
}

/** startsWith 우선, 없으면 includes */
function matchLoose(token: string, list: string[]): string[] {
  const t = token.trim();
  if (!t) return [];

  const starts = list.filter((x) => x.startsWith(t));
  if (starts.length) return starts;

  return list.filter((x) => x.includes(t));
}

/** keys 리스트에서 startsWith 우선, 없으면 includes */
function matchKeysByPrefix(token: string, keys: string[]): string[] {
  const t = token.trim();
  if (!t) return [];

  const starts = keys.filter((k) => k.startsWith(t));
  if (starts.length) return starts;

  return keys.filter((k) => k.includes(t));
}

/** 시군구 EXACT일 때 결과 생성 */
function suggestFromExactSigungu(
  sigungu: string,
  index: DistrictIndex,
): SuggestAddress[] {
  const sidosForSigungu = index.sigunguToSidos.get(sigungu) ?? [];

  // 여러 시도면 "서울 중구", "부산 중구" 구 선택 먼저
  if (sidosForSigungu.length !== 1) {
    return sidosForSigungu.map((sido) => ({
      level: "sigungu",
      label: joinLabel([simplifySido(sido), sigungu]),
      sido,
      sigungu,
    }));
  }

  // 유일 시도면 동 전체
  const sido = sidosForSigungu[0];
  const key = makeKey(sido, sigungu);
  const dongs = index.dongBySidoSigungu.get(key) ?? [];

  if (dongs.length === 0) {
    return [
      {
        level: "sigungu",
        label: joinLabel([simplifySido(sido), sigungu]),
        sido,
        sigungu,
      },
    ];
  }

  return dongs.map((dong) => ({
    level: "dong",
    label: joinLabel([simplifySido(sido), sigungu, dong]),
    sido,
    sigungu,
    dong,
  }));
}

/** 시군구 후보들에서 결과 생성 (유일 시도면 동 펼치기, 복수 시도면 구 선택) */
function suggestFromSigunguCandidates(
  sigunguCandidates: string[],
  index: DistrictIndex,
): SuggestAddress[] {
  const out: SuggestAddress[] = [];

  for (const sigungu of sigunguCandidates) {
    const sidosForSigungu = index.sigunguToSidos.get(sigungu) ?? [];

    if (sidosForSigungu.length === 1) {
      const sido = sidosForSigungu[0];
      const key = makeKey(sido, sigungu);
      const dongs = index.dongBySidoSigungu.get(key) ?? [];

      if (dongs.length > 0) {
        for (const dong of dongs) {
          out.push({
            level: "dong",
            label: joinLabel([simplifySido(sido), sigungu, dong]),
            sido,
            sigungu,
            dong,
          });
        }
      } else {
        out.push({
          level: "sigungu",
          label: joinLabel([simplifySido(sido), sigungu]),
          sido,
          sigungu,
        });
      }
    } else {
      // 복수 시도면 구 선택 먼저
      for (const sido of sidosForSigungu) {
        out.push({
          level: "sigungu",
          label: joinLabel([simplifySido(sido), sigungu]),
          sido,
          sigungu,
        });
      }
    }
  }

  return out;
}

/** 동 후보들에서 결과 생성: 동은 중복 지역이 많으니 항상 풀 경로로 */
function suggestFromDongCandidates(
  dongCandidates: string[],
  index: DistrictIndex,
): SuggestAddress[] {
  const out: SuggestAddress[] = [];

  for (const dong of dongCandidates) {
    const keys = index.dongToSidoSigunguKeys.get(dong) ?? [];
    for (const key of keys) {
      const [sido, sigungu] = splitKey(key);
      out.push({
        level: "dong",
        label: joinLabel([simplifySido(sido), sigungu, dong]),
        sido,
        sigungu,
        dong,
      });
    }
  }

  return out;
}
