import { create } from "zustand";

interface ToastState {
  message: string | null;
  show: (message: string) => void;
  hide: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: "info",
  show: (message) => set({ message }),
  hide: () => set({ message: null }),
}));
