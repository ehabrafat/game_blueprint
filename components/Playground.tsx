"use client";

import { useEventAction } from "@/store/useEventAction";
import { Separator } from "@radix-ui/react-separator";
import { LobbyTeam } from "./LobbyTeam";
import { Button } from "./ui/button";
import { useProfile } from "@/queries/hooks";

export const Playground = () => {
  const { data: profile } = useProfile();
  useEventAction();
  if (!profile) return <h2>Loading...</h2>;
  return (
    <div className="col-span-2 flex flex-col">
      <LobbyTeam />
      <Separator className="dark:bg-[#313131] bg-neutral-300/95 h-[1px] w-full" />
      <div className="dark:bg-[#252525] bg-secondary p-4 flex-1 rounded-md"></div>
    </div>
  );
};
