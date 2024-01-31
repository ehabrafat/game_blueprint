import { create } from "zustand";

interface onlineUsersState {
  onlineUsersIds: Set<string>;
  setOnlineUsersIds: (usersIds: Set<string>) => void;
}

export const useOnlineUsers = create<onlineUsersState>((set) => ({
  onlineUsersIds: new Set<string>(),
  setOnlineUsersIds: (usersIds: Set<string>) =>
    set(() => ({ onlineUsersIds: usersIds })),
}));
