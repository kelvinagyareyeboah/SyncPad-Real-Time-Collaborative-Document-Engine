import { create } from "zustand";

interface ZenState {
  isZenMode: boolean;
  setZenMode: (enabled: boolean) => void;
  toggleZenMode: () => void;
}

export const useZenStore = create<ZenState>((set) => ({
  isZenMode: false,
  setZenMode: (isZenMode) => set({ isZenMode }),
  toggleZenMode: () => set((state) => ({ isZenMode: !state.isZenMode })),
}));
