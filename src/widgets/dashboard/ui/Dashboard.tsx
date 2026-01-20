import { SearchBar } from "@/shared/ui";
import { WeatherSection } from "@/widgets/weather";
import { FavoritesSection } from "@/widgets/favorites";

export function Dashboard() {
  return (
    <div className="w-full h-full flex flex-col gap-4 md:overflow-y-auto pb-4 md:p-6 lg:p-10 md:pt-2 lg:pt-4">
      <SearchBar />
      <WeatherSection />
      <FavoritesSection />
    </div>
  );
}
