import { KakaoMap } from "@/widgets/kakao-maps";

export function MainPage() {
  return (
    <div className="h-full w-full flex flex-row">
      <div className="h-full w-full">
        <KakaoMap />
      </div>
      <div className="h-full w-full"></div>
    </div>
  );
}
