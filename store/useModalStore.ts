import { create } from "zustand";

export type Variant = "profiles" | "";

interface ModalStore {
  isOpen: boolean;
  variant: Variant;
  setVariant: (variant: Variant) => void;
  onOpen: () => void;
  onClose: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  variant: "",
  setVariant: (variant: Variant) => set({ variant: variant }),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
