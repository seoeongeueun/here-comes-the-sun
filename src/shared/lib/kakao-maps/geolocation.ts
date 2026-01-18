import type { KakaoRegionAddress, GeocoderResult } from "./types";

// geocoder를 이용해 좌표를 주소로 변환하는 함수
export function coord2AddressAsync(
  geocoder: kakao.maps.services.Geocoder,
  lng: number,
  lat: number,
): Promise<GeocoderResult> {
  return new Promise((resolve) => {
    geocoder.coord2Address(lng, lat, (result, status) => {
      if (status !== kakao.maps.services.Status.OK || !result?.length) {
        // 주소를 찾지 못하면 기본값 반환
        resolve({ lat, lng, sido: "" });
        return;
      }

      const address = result[0].address as KakaoRegionAddress;
      resolve({
        lat,
        lng,
        sido: address.region_1depth_name,
        sigungu: address.region_2depth_name,
        dong: address.region_3depth_name,
      });
    });
  });
}

// geocoder를 이용해 주소를 좌표로 변환하는 함수
export function addressToCoord(
  geocoder: kakao.maps.services.Geocoder,
  address: string,
): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    geocoder.addressSearch(address, (result, status) => {
      if (status !== kakao.maps.services.Status.OK || !result?.[0]) {
        reject(new Error(`addressSearch failed: ${status}`));
        return;
      }
      const { x, y } = result[0];
      resolve({ lat: Number(y), lng: Number(x) });
    });
  });
}

//브라우저 geocoder API를 이용해 현재 위치 좌표를 가져오는 함수
export function getCurrentPositionAsync(): Promise<{
  lat: number;
  lng: number;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("위치 정보가 지원되지 않는 브라우저입니다."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
    );
  });
}
