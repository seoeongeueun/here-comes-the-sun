import { KakaoMap } from "@/widgets/kakao-maps";
import { Dashboard } from "@/widgets/dashboard";
import { usePrefetchCitiesWeather } from "@/features/prefetch-cities-weather";
import { Header } from "@/widgets/dashboard/ui/Header";

export function MainPage() {
  //usePrefetchCitiesWeather();

  return (
    <div className="max-w-[1800px] h-full w-full flex flex-col justify-self-center">
      <Header />
      <div className="flex flex-col md:flex-row w-full h-full md:h-[calc(100%-80px)]">
        <section className="p-4 md:p-6 lg:p-10 md:pt-2 lg:pt-4 w-full md:w-1/2 h-1/2 shrink-0 md:h-full">
          <KakaoMap />
        </section>
        <section className="w-full md:w-1/2 h-full px-4 md:px-0">
          <Dashboard />
        </section>
      </div>
    </div>
  );
}
