"use client";
import { MAX_TEAM_SIZE } from "@/constants";
import { useProfile, useTeamMembers } from "@/queries/hooks";
import Image from "next/image";
import { IoClose, IoStar } from "react-icons/io5";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { UserProfile } from "@/types";
import { useState } from "react";
import { fetchTeamMembers, leaveTeam, syncMe } from "@/queries/services";
import { useNotify } from "@/store/useNotify";

export const LobbyTeam = () => {
  const { data: profile, isLoading: loadingProfile } = useProfile();

  const { data: teamMembers, isLoading: loadingTeamMembers } = useTeamMembers(
    profile?.current_team ?? null
  );

  const [leavingTeam, setLeavingTeam] = useState<boolean>(false);

  const { emitTeamUpdate } = useNotify();

  const handleLeavingTeam = async (member: UserProfile) => {
    setLeavingTeam(true);
    const teamMembers = await fetchTeamMembers(member.current_team);
    await leaveTeam(member);
    syncMe();
    emitTeamUpdate(teamMembers ?? []);
    setLeavingTeam(false);
  };

  return (
    <div className="dark:bg-[#252525] bg-secondary p-4 flex flex-col gap-y-2 rounded-md ">
      <h2 className="font-bold">Your Team</h2>
      <div className="flex items-center gap-x-2">
        {loadingProfile || loadingTeamMembers
          ? Array(MAX_TEAM_SIZE)
              .fill(0)
              .map((_, idx) => (
                <div className="relative w-24 h-24 rounded-md" key={idx}>
                  <Skeleton className="w-full h-full" />
                </div>
              ))
          : teamMembers?.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center gap-y-4"
              >
                <div className="relative w-24 h-24 rounded-md">
                  <Image fill src={member.img_url!} alt="avatar" />
                  {(member.current_team === profile?.default_team &&
                    member.id !== profile?.id) ||
                  (member.current_team !== profile?.default_team &&
                    member.id === profile?.id) ? (
                    <Button
                      className="text-sm bg-rose-500 hover:bg-rose-600 text-white p-1 h-5 w-5 rounded-full absolute top-[-6px] right-[-6px] shadow-sm"
                      size={"sm"}
                      onClick={() => handleLeavingTeam(member)}
                      disabled={leavingTeam}
                    >
                      <IoClose />
                    </Button>
                  ) : null}
                </div>
                <div className="flex items-center gap-x-1">
                  {member.current_team === member.default_team && (
                    <IoStar className=" w-2.5 h-2.5" />
                  )}
                  <p className="text-sm">{member.username}</p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};
