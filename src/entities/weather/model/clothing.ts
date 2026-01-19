export type CLOTHING_OPTIONS =
  | "paddedjacket"
  | "pants"
  | "sweater"
  | "gloves"
  | "hat"
  | "earmuff"
  | "heavyjacket"
  | "coat"
  | "jacket"
  | "cardigan"
  | "hoodie"
  | "shirt"
  | "skirt"
  | "tshirt"
  | "shorts"
  | "dress"
  | "slippers"
  | "sunglasses"
  | "rainboots"
  | "umbrella";

// 최고 기온 기준
export const CLOTHING_ADVICE: Record<number, CLOTHING_OPTIONS[]> = {
  "-1": ["paddedjacket", "pants", "sweater", "gloves", "hat", "earmuff"], // ~-1도
  4: ["paddedjacket", "gloves", "pants"],
  8: ["heavyjacket", "sweater", "pants"],
  11: ["coat", "jacket", "pants"],
  16: ["cardigan", "hoodie", "pants"],
  22: ["shirt", "pants"],
  27: ["skirt", "tshirt", "shorts"],
  999: ["dress", "slippers", "tshirt", "sunglasses", "shorts"], // 27도~
};

export const SPECIAL_CLOTHING: Record<string, CLOTHING_OPTIONS[]> = {
  rain: ["rainboots", "umbrella"],
};

// 한글로 매핑
export const CLOTHING_KR_MAP: Record<CLOTHING_OPTIONS, string> = {
  paddedjacket: "패딩",
  pants: "긴 바지",
  sweater: "스웨터",
  gloves: "장갑",
  hat: "모자",
  earmuff: "귀마개",
  heavyjacket: "두꺼운 자켓",
  coat: "트렌치 코트",
  jacket: "자켓",
  cardigan: "가디건",
  hoodie: "후드티",
  shirt: "긴소매 셔츠",
  skirt: "치마",
  tshirt: "티셔츠",
  shorts: "반바지",
  dress: "원피스",
  slippers: "슬리퍼",
  sunglasses: "선글라스",
  rainboots: "장화",
  umbrella: "우산",
};

const TEMP_KEYS = Object.keys(CLOTHING_ADVICE)
  .map(Number)
  .sort((a, b) => a - b);

// 최저/최고 기온을 바탕으로 옷차림 추천 리스트 반환
// minkey와 maxkey가 두 티어 이상 차이나면 중간을 기준으로한다
export function getClothingAdvice(
  min: number,
  max: number,
): { options: CLOTHING_OPTIONS[]; hasTempDiff: boolean } {
  const minKey = TEMP_KEYS.find((t) => min <= t) ?? 999;
  const maxKey = TEMP_KEYS.find((t) => max <= t) ?? 999;

  const key =
    minKey === maxKey
      ? minKey
      : TEMP_KEYS[
          TEMP_KEYS.indexOf(minKey) +
            Math.floor(
              (TEMP_KEYS.indexOf(maxKey) - TEMP_KEYS.indexOf(minKey)) / 2,
            )
        ];
  return {
    options: CLOTHING_ADVICE[key as keyof typeof CLOTHING_ADVICE],
    hasTempDiff:
      Math.abs(TEMP_KEYS.indexOf(maxKey) - TEMP_KEYS.indexOf(minKey)) >= 2,
  };
}

// 옷 옵션을 한글로 변환
export function convertClothingToKorean(
  clothing: CLOTHING_OPTIONS[],
): string[] {
  return clothing.map((item) => CLOTHING_KR_MAP[item]);
}
