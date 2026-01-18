import { Header } from "./Header";
import { SearchBar } from "@/shared/ui";
import { WeatherSection } from "@/widgets/weather";

export function Dashboard() {
  return (
    <div className="w-full h-full flex flex-col p-10 gap-4">
      <Header />

      <SearchBar />
      <WeatherSection />
    </div>
  );
}
