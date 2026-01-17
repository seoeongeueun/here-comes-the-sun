//시도 / 시군구 / 동 자동완성 모델
// 여러가지 케이스를 고려해서 추천을 제공한다

/* 
    1) 시도 입력시 -> 시군구 추천
    2) 시도 + 시군구 입력시 -> 동 추천
    3) 반대로 시군구 입력시 -> 시도 추천
    4) 동 입력시 -> 시도 + 시군구 추천
*/

// 아직 많은 테스트가 필요하다 (동이 아니라 읍면리 경우 등)
// TODO: 테스트 코드 작성 필요

export type DistrictIndex = {
  sidos: string[];
  sigunguBySido: Map<string, string[]>; // 케이스1) 시도 -> 시군구 목록
  dongBySidoSigungu: Map<string, string[]>; // 케이스2) "시도+시군구" -> 동 목록
  sigunguToSidos: Map<string, string[]>; // 케이스3) 시군구 -> 시도 목록
  dongToSidoSigunguKeys: Map<string, string[]>; // 케이스4) 동 -> "시도+시군구" 목록
};
