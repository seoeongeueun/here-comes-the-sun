import { useNavigate, useSearchParams } from "react-router-dom";
import { WeatherSection } from "@/widgets/weather";
import { useEffect, useMemo, useState } from "react";
import { useSelectLocationStore } from "@/features/select-location";
import { CompareSection } from "@/widgets/compare";
import { useFavoriteCityStore } from "@/features/favorite-city";
import { makeUniqueCityId } from "@/entities/city";
import type { Favorite } from "@/entities/favorite";

export function InfoPage() {
  const navigate = useNavigate();
  const getFavorite = useFavoriteCityStore((s) => s.getFavorite);
  const updateNickname = useFavoriteCityStore((s) => s.updateNickname);
  const favorites = useFavoriteCityStore((s) => s.favorites);
  const isFavorite = useFavoriteCityStore((s) => s.isFavorite);
  const selectLocation = useSelectLocationStore((s) => s.selectLocation);
  const clearLocation = useSelectLocationStore((s) => s.clearLocation);
  const [sp] = useSearchParams();

  const lat = Number(sp.get("lat"));
  const lng = Number(sp.get("lng"));
  const sido = sp.get("sido") ?? "";
  const sigungu = sp.get("sigungu") ?? "";
  const dong = sp.get("dong") ?? "";

  const [isEditMode, setIsEditMode] = useState(false);
  const [input, setInput] = useState("");

  const location = useMemo(
    () => ({ lat, lng, sido, sigungu, dong }),
    [lat, lng, sido, sigungu, dong],
  );

  const favorite: Favorite | null = useMemo(
    () => getFavorite(makeUniqueCityId(location)),
    [location, getFavorite, favorites],
  );

  const cityId = useMemo(() => makeUniqueCityId(location), [location]);

  useEffect(() => {
    // 주소로 바로 진입한 경우엔 선택 위치가 비어있기 때문에 날씨 정보 섹션을 위해 값을 추가해줌
    selectLocation(location);
  }, [location, selectLocation]);

  const handleEditClick = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsEditMode(true);
    setInput(favorite?.nickname ?? "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedInput = input.trim();

    if (trimmedInput) {
      updateNickname(cityId, trimmedInput);
    }

    setIsEditMode(false);
    setInput("");
  };

  const handleGoBack = () => {
    clearLocation();
    navigate("/");
  };

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return <div>유효하지 않은 좌표입니다.</div>;
  }

  return (
    <div className="flex flex-col w-full h-full">
      <header className="w-full flex flex-row gap-4">
        <button
          type="button"
          className="text-md cursor-pointer whitespace-nowrap flex items-center"
          onClick={handleGoBack}
        >
          {"<"}
        </button>
        {isFavorite(makeUniqueCityId(location)) && (
          <form
            id="nickname-form"
            onSubmit={handleSubmit}
            className="flex flex-row w-full items-center justify-between gap-2"
          >
            <input
              type="text"
              className={`${isEditMode ? "border-secondary" : "border-none focus:outline-none!"} border px-2 w-full focus:border-black rounded-sm text-md lg:text-lg placeholder:text-secondary`}
              placeholder="이 장소의 별명을 지어주세요"
              readOnly={!isEditMode}
              onChange={(e) => setInput(e.target.value)}
              value={isEditMode ? input : (favorite?.nickname ?? "")}
            />
            {!isEditMode ? (
              <button
                type="button"
                onClick={handleEditClick}
                className="text-xs underline underline-offset-2 cursor-pointer text-black whitespace-nowrap"
              >
                닉네임 변경하기
              </button>
            ) : (
              <button
                type="submit"
                form="nickname-form"
                className="text-xs underline underline-offset-2 cursor-pointer text-black whitespace-nowrap"
              >
                저장하기
              </button>
            )}
          </form>
        )}
      </header>
      <div className="h-full md:overflow-y-auto w-full">
        <WeatherSection mode="selected" />
        <CompareSection />
      </div>
    </div>
  );
}
