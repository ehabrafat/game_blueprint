import { UserProfile } from "@/types";
import { create } from "zustand";

export type RealtimeEvent =
  | "team_invite"
  | "team_join"
  | "team_update"
  | "friends_update"
  | MatchmakingEventType
  | "";


interface EventStore {
  event: RealtimeEvent;
  payload?: any;
  setEvent: (event: RealtimeEvent) => void;
  setPayload: (payload: any) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  event: "",
  setEvent: (event: RealtimeEvent) => set({ event: event }),
  setPayload: (payload: any) => set({ payload: payload }),
}));
