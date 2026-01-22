import { WeatherImage } from "@/shared/ui";

export function Header() {
  return (
    <header className="text-md md:text-lg h-fit md:h-[80px] px-4 mt-2 md:mt-0 md:px-6 lg:px-10 text-white ml-auto font-bold flex flex-row items-center gap-1">
      Here Comes the Sun
      <WeatherImage weather="partly_cloudy" size="medium" />
    </header>
  );
}
