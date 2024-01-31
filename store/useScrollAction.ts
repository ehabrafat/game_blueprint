import { create } from "zustand";

export type Variant = "profiles" | "";

interface ScrollState {
  scrollChatDown: boolean;
  setScrollChatDown: (scrollDown: boolean) => void;
}

export const useScrollAction = create<ScrollState>((set) => ({
  scrollChatDown: true,
  setScrollChatDown: (scrollDown: boolean) =>
    set({ scrollChatDown: scrollDown }),
}));
