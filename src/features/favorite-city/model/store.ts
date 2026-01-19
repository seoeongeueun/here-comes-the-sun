import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { City } from "@/entities/city";
import { makeUniqueCityId } from "@/entities/city";

const MAX_FAVORITES = 6;
const STORAGE_KEY = "favorites:cities:v1";

type FavoriteCityStore = {
  favorites: City[];
  isFavorite: (cityId: string) => boolean;
  addFavorite: (city: City) => void;
  removeFavorite: (cityId: string) => void;
  toggleFavorite: (city: City) => void;
  clearFavorites: () => void;
};

// 로컬스토리지 저장소에 즐겨찾기 도시 목록 관리
export const useFavoriteCityStore = create<FavoriteCityStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      isFavorite: (cityId) => get().favorites.some((c) => c.id === cityId),

      addFavorite: (city) => {
        const id = makeUniqueCityId(city); //주소 기반으로 고유 ID 생성
        const nextCity: City = { ...city, id };

        set((state) => {
          // 중복 방지: 이미 있으면 맨 앞으로 끌어올리기
          const without = state.favorites.filter((c) => c.id !== id);
          const next = [...without, nextCity].slice(-MAX_FAVORITES);
          return { favorites: next };
        });
      },

      removeFavorite: (cityId) => {
        set((state) => ({
          favorites: state.favorites.filter((c) => c.id !== cityId),
        }));
      },

      toggleFavorite: (city) => {
        console.log("Toggling favorite for city:", city);
        const id = makeUniqueCityId(city);
        if (get().isFavorite(id)) get().removeFavorite(id);
        else get().addFavorite(city);
      },

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
