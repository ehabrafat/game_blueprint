import { create } from "zustand";

export type MatchStatus = "SEARCHING" | "COMPLETED" | "";

interface MatchStatusState {
  matchStatus: MatchStatus;
  setMatchStatus: (MatchStatus: MatchStatus) => void;
}

export const useMatchStatus = create<MatchStatusState>((set) => ({
  matchStatus: "",
  setMatchStatus: (newMatchStatus: MatchStatus) =>
    set({ matchStatus: newMatchStatus }),
}));
