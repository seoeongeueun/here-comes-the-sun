//카카오 주소 타입 중 사용할 부분만 정의
export type KakaoRegionAddress = {
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_3depth_h_name?: string; // 법정동명이 없을 때 사용하는 행정동명
};

// geocoder 반환 결과 중 사용할 타입만 정의
export type GeocoderResult = {
  lat: number;
  lng: number;
  sido: string;
  sigungu?: string;
  dong?: string;
};
