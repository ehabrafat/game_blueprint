import { UserProfile } from "@/types";
import { create } from "zustand";

export type RealtimeEvent =
  | "team_invite"
  | "team_join"
  | "team_update"
  | "friends_update"
  | "";


export interface EventPayload {
  sender: UserProfile;
}

interface EventStore {
  event: RealtimeEvent;
  payload?: EventPayload;
  setEvent: (event: RealtimeEvent) => void;
  setPayload: (payload: EventPayload) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  event: "",
  setEvent: (event: RealtimeEvent) => set({ event: event }),
  setPayload: (payload: EventPayload) => set({ payload: payload }),
}));
