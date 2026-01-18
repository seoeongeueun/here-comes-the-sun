import { KakaoMap } from "@/widgets/kakao-maps";
import { Dashboard } from "@/widgets/dashboard";
import { usePrefetchCitiesWeather } from "@/features/prefetch-cities-weather";

export function MainPage() {
  //usePrefetchCitiesWeather();

  return (
    <div className="h-full w-full flex flex-row">
      <section className="p-10 w-1/2 h-full ">
        <KakaoMap />
      </section>
      <section className="w-1/2 h-full">
        <Dashboard />
      </section>
    </div>
  );
}
