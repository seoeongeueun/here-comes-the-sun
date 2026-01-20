//카카오톡 로더
let loadPromise: Promise<void> | null = null;

export function loadKakaoMaps() {
  if (window.kakao?.maps) return Promise.resolve(); //이미 로드된 경우
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_MAP_KEY
    }&autoload=false&libraries=services`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => resolve());
    };

    script.onerror = (e) => {
      loadPromise = null; // 다음 호출에서 재시도 가능
      reject(e);
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}
