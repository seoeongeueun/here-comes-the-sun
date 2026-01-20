import { Header } from "./Header";
import { SearchBar } from "@/shared/ui";
import { WeatherSection } from "@/widgets/weather";
import { FavoritesSection } from "@/widgets/favorites";

export function Dashboard() {
  return (
    <div className="w-full h-full flex flex-col p-10 gap-4 overflow-y-auto">
      <Header />
      <SearchBar />
      <WeatherSection />
      <FavoritesSection />
    </div>
  );
}
