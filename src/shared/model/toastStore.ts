import { create } from "zustand";

interface ToastState {
  message: string | null;
  type: "success" | "error" | "info";
  show: (message: string, type?: "success" | "error" | "info") => void;
  hide: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message:
    "Open Meteo가 한국 날씨 모델을 마이그레이션 완료할 때까지 일기 예보 서비스를 제공하지 않습니다 (2026 3월 ~ 진행 중)",
  type: "info",
  show: (message, type = "info") => set({ message, type }),
  hide: () => set({ message: null }),
}));
