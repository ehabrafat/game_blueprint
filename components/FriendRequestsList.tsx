"use client";
import { useProfile, useReceivedFriendRequests } from "@/queries/hooks";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { addFriend, deleteFriendRequest } from "@/queries/services";
import { useSWRConfig } from "swr";
import { useState } from "react";

export const FriendRequestsList = () => {
  const { mutate } = useSWRConfig();
  const { isLoading: loadingProfile, data: profile } = useProfile();
  const { isLoading: loadingFriendRequests, data: friendRequests } =
    useReceivedFriendRequests(profile?.id ?? null);

  const [processingFriendRequest, setProcessingFriendRequest] = useState(false);

  if (loadingProfile || loadingFriendRequests || !profile) {
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

  if (friendRequests?.length === 0) {
    return (
      <div className="h-full flex justify-center items-center dark:bg-[#252525] bg-secondary">
        <p>No friend requests</p>
      </div>
    );
  }

  const handleRefuseFriendRequest = async (senderId: string) => {
    setProcessingFriendRequest(true);
    await deleteFriendRequest(senderId, profile.id!);
    await mutate("received_friend_requests");
    setProcessingFriendRequest(false);
  };

  const handleAcceptFriendRequest = async (senderId: string) => {
    setProcessingFriendRequest(true);
    await addFriend(senderId, profile.id);
    await deleteFriendRequest(senderId, profile.id!);
    await mutate("received_friend_requests");
    setProcessingFriendRequest(false);
    mutate("friends");
  };

  return (
    <ScrollArea className="h-full w-full p-2  dark:bg-[#252525] bg-secondary">
      <div className="flex flex-col gap-y-4 items-center">
        {(
          friendRequests as Pick<Profile, "id" | "username" | "img_url">[]
        )?.map((friendRequestProfile) => (
          <div key={friendRequestProfile.id} className="w-full">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-x-4">
                <div className="relative w-10 h-10">
                  {friendRequestProfile.img_url ? (
                    <Image
                      fill
                      src={friendRequestProfile.img_url}
                      alt="avatar"
                      className="rounded-md"
                    />
                  ) : (
                    <Skeleton className="w-10 h-10" />
                  )}
                </div>
                <h2>{friendRequestProfile.username}</h2>
              </div>
              <div className="flex items-center gap-x-2">
                <Button
                  size={"sm"}
                  variant={"destructive"}
                  disabled={processingFriendRequest}
                  onClick={() =>
                    handleRefuseFriendRequest(friendRequestProfile.id)
                  }
                >
                  <FaTimes className="w-4 h-4" />
                </Button>
                <Button
                  size={"sm"}
                  variant={"outline"}
                  disabled={processingFriendRequest}
                  onClick={() =>
                    handleAcceptFriendRequest(friendRequestProfile.id)
                  }
                >
                  <FaCheck className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Separator className="dark:bg-[#313131] bg-neutral-300/95 h-[1px]" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
