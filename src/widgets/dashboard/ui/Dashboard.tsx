import { SearchBar } from "@/shared/ui";
import { WeatherSection } from "@/widgets/weather";
import { FavoritesSection } from "@/widgets/favorites";

export function Dashboard() {
  return (
    <div className="w-full h-full flex flex-col gap-4 md:overflow-y-auto">
      <SearchBar />
      <WeatherSection />
      <FavoritesSection />
    </div>
  );
}
