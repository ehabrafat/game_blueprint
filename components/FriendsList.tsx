"use client";
import { MAX_TEAM_SIZE } from "@/constants";
import { fetchFriends, fetchProfile, getTeamSize } from "@/queries/services";
import { useRealTime } from "@/store/useRealTime";
import { UserProfileWithTeamSize } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaPlus, FaSpinner } from "react-icons/fa6";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { useFriends, useProfile, useTeamSize } from "@/queries/hooks";
import { useOnlineUsers } from "@/store/useOnlineUsers";

export const FriendsList = () => {
  const { data: profile, isLoading: loadingProfile } = useProfile();

  const { data: myTeamSize, isLoading: loadingTeamSize } = useTeamSize(
    profile?.current_team ?? null
  );

  const { data: friends, isLoading: loadingFriends } = useFriends(
    profile?.id ?? null
  );

  const [pendingPlayersId, setPendingPlayersId] = useState<Set<string>>(
    new Set<string>()
  );

  const { broadcast } = useRealTime();
  const { onlineUsersIds } = useOnlineUsers();

  const handleSendPlayWith = (friend: UserProfileWithTeamSize) => {
    if (!profile) return;
    setPendingPlayersId((prevState) => {
      const newSet = new Set<string>([...prevState, friend.id!]);
      return newSet;
    });
    if (myTeamSize! < MAX_TEAM_SIZE && friend.team_size === 1) {
      broadcast({
        event: "team_invite",
        payload: { sender: profile },
        channelsNames: [`user_${friend.id}`],
      });
    } else if (myTeamSize === 1 && friend.team_size < MAX_TEAM_SIZE) {
      broadcast({
        event: "team_join",
        payload: { sender: profile },
        channelsNames: [`user_${friend.id}`],
      });
    }
    setTimeout(() => {
      setPendingPlayersId((prevSet) => {
        const updatedSet = new Set<string>(prevSet);
        updatedSet.delete(friend.id!);
        return updatedSet;
      });
    }, 3000);
  };

  const compareUsers = (
    userA: UserProfileWithTeamSize,
    userB: UserProfileWithTeamSize
  ) => {
    const isUserAOnline = onlineUsersIds.has(userA.id);
    const isUserBOnline = onlineUsersIds.has(userB.id);
    if (isUserAOnline && !isUserBOnline) {
      return -1; // userA comes first
    } else if (!isUserAOnline && isUserBOnline) {
      return 1; // userB comes first
    } else {
      return 0; // maintain the existing order
    }
    return 0;
  };

  if (
    loadingProfile ||
    loadingTeamSize ||
    loadingFriends ||
    !profile ||
    !myTeamSize ||
    !friends
  ) {
    return (
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="h-full flex justify-center items-center dark:bg-[#252525] bg-secondary">
        <p>No friends</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full p-2  dark:bg-[#252525] bg-secondary">
      <div className="flex flex-col gap-y-4 items-center">
        {friends?.toSorted(compareUsers).map((friend) => (
          <div key={friend.id} className="w-full">
            {onlineUsersIds.has(friend.id) ? (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-x-3">
                    <div className="relative w-10 h-10">
                      {friend.img_url ? (
                        <Image
                          fill
                          src={friend.img_url}
                          alt="avatar"
                          className="rounded-md"
                        />
                      ) : (
                        <Skeleton className="w-10 h-10" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <h2>{friend.username}</h2>
                      {friend.team_size! > 1 && (
                        <span className="text-xs">
                          ({friend.team_size}/{MAX_TEAM_SIZE})
                        </span>
                      )}
                    </div>
                  </div>
                  {(myTeamSize < MAX_TEAM_SIZE && friend.team_size === 1) ||
                  (myTeamSize === 1 && friend.team_size < MAX_TEAM_SIZE) ? (
                    <>
                      {pendingPlayersId.has(friend.id!) ? (
                        <div className="px-3">
                          <FaSpinner className="animate-spin w-4 h-4" />
                        </div>
                      ) : (
                        <Button
                          size={"sm"}
                          variant={"secondary"}
                          className="bg-transparent dark:bg-transparent"
                          onClick={() => handleSendPlayWith(friend)}
                        >
                          <FaPlus className="w-4 h-4" />
                        </Button>
                      )}
                    </>
                  ) : null}
                </div>
                <Separator className="dark:bg-[#313131] bg-neutral-300/95 h-[1px] mt-1" />
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-x-3">
                    <div className="relative w-10 h-10">
                      {friend.img_url ? (
                        <Image
                          fill
                          src={friend.img_url}
                          alt="avatar"
                          className="rounded-md opacity-30"
                        />
                      ) : (
                        <Skeleton className="w-10 h-10" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-gray-300/90">{friend.username}</h2>
                    </div>
                  </div>
                </div>
                <Separator className="dark:bg-[#313131] bg-neutral-300/95 h-[1px] mt-1" />
              </>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
