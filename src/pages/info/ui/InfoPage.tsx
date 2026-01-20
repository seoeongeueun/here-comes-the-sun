import { useSearchParams } from "react-router-dom";
import { WeatherSection } from "@/widgets/weather";
import { useEffect, useMemo } from "react";
import { useSelectLocationStore } from "@/features/select-location";

export function InfoPage() {
  const selectLocation = useSelectLocationStore((s) => s.selectLocation);
  const [sp] = useSearchParams();

  const lat = Number(sp.get("lat"));
  const lng = Number(sp.get("lng"));
  const sido = sp.get("sido") ?? "";
  const sigungu = sp.get("sigungu") ?? "";
  const dong = sp.get("dong") ?? "";

  const location = useMemo(
    () => ({ lat, lng, sido, sigungu, dong }),
    [lat, lng, sido, sigungu, dong],
  );

  useEffect(() => {
    selectLocation(location);
  }, [location, selectLocation]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return <div>유효하지 않은 좌표입니다.</div>;
  }

  return (
    <div className="p-4 flex flex-col gap-6 w-full max-w-[1000px] justify-self-center">
      <WeatherSection mode="selected" />
    </div>
  );
}
