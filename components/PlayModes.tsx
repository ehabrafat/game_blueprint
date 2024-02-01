"use client";

import { useMatchedPlayers, useProfile, useTeamMembers } from "@/queries/hooks";
import { Button } from "./ui/button";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useMatchStatus } from "@/store/useMatchStatus";
import { MAX_TEAM_SIZE } from "@/constants";
export const PlayModes = () => {
  const { data: profile } = useProfile();
  const { data: teamMembers } = useTeamMembers(profile?.current_team ?? null);
  const { data: matchedPlayers } = useMatchedPlayers();
  const { matchStatus, setMatchStatus } = useMatchStatus();

  const handleStartMatch = async () => {
    if (!profile) return;
    setMatchStatus("SEARCHING");
    const players = teamMembers?.map((member) => ({
      PlayerId: member.id,
      Team: "cowboys",
    }));

    try {
      const ticketId = uuidv4();
      await axios.post("/api/matchmaking/start", {
        players: players,
        ticketId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnOpenChange = (open: boolean) => {
    if (open) {
      setMatchStatus("SEARCHING");
    } else {
      setMatchStatus("");
      console.log("alert closed");
    }
  };

  if (!profile || !teamMembers) {
    return (
      <div className="flex gap-x-2 items-center">
        <div className="relative w-24 h-24 rounded-md">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="relative w-24 h-24 rounded-md">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-[#252525] bg-secondary p-4 flex-1 flex flex-col gap-y-2 rounded-md">
      <h2 className="font-bold">Play Modes</h2>
      <div className="flex-grow flex justify-around">
        <div className="flex flex-col justify-between items-center gap-y-4 shadow-md rounded-md  dark:bg-zinc-700/30 bg-neutral-300/95 py-4 px-8">
          <p className=" font-semibold uppercase">You vs team</p>
          <div className="relative w-24 h-24">
            <Image src="/box.svg" fill alt="box" />
          </div>
          <Dialog onOpenChange={handleOnOpenChange}>
            <DialogTrigger asChild>
              <Button
                className="dark:bg-rose-500 dark:text-white bg-rose-600 w-full"
                onClick={handleStartMatch}
              >
                {matchStatus === "SEARCHING" ? "Searching..." : "Start"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Match Players</DialogTitle>
              </DialogHeader>
              <div className="flex justify-start items-center gap-x-2">
                {matchedPlayers?.length ? (
                  matchedPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="flex flex-col items-center gap-y-4"
                    >
                      <div className="relative w-24 h-24 rounded-md">
                        <Image fill src={player.img_url!} alt="avatar" />
                      </div>
                      <div className="flex items-center gap-x-1">
                        <p className="text-sm">{player.username}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div
                      key={profile!.id}
                      className="flex flex-col justify-center items-center gap-y-4"
                    >
                      <div className="relative w-24 h-24 rounded-md">
                        <Image fill src={profile!.img_url!} alt="avatar" />
                      </div>
                      <p className="text-sm">{profile!.username}</p>
                    </div>
                    {Array(MAX_TEAM_SIZE - 1)
                      .fill(0)
                      .map((_, idx) => (
                        <div className="flex flex-col items-center gap-y-4">
                          <div
                            className="relative w-24 h-24 rounded-md"
                            key={idx}
                          >
                            <Skeleton className="w-full h-full" />
                          </div>
                          <div className="w-14 h-3 rounded-md">
                            <Skeleton className="w-full h-full" />
                          </div>
                        </div>
                      ))}
                  </>
                )}
              </div>
              <span className="p-2 rounded-md">
                {matchedPlayers?.length ? "COMPLETED" : "SEARCHING..."}
              </span>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
