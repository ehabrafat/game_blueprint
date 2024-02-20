"use client";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  useFriends,
  useGetProfilesLike,
  useProfile,
  useSentFriendRequests,
} from "@/queries/hooks";
import {
  deleteFriend,
  deleteFriendRequest,
  sendFriendRequest,
} from "@/queries/services";
import { useModalStore } from "@/store/useModalStore";
import { UserProfile } from "@/types";
import Image from "next/image";
import { ChangeEvent, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import { MdPersonAdd } from "react-icons/md";
import { useSWRConfig } from "swr";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

export const SearchProfilesModal = () => {
  const { mutate } = useSWRConfig();
  const { isOpen, variant, onClose } = useModalStore();
  const openModal = isOpen && variant === "profiles";

  const { isLoading: loadingProfile, data: profile } = useProfile();
  const { isLoading: loadingFriends, data: friends } = useFriends(
    profile?.id ?? null
  );
  const { isLoading: loadingFriendRequests, data: friendRequests } =
    useSentFriendRequests(profile?.id ?? null);

  const { data: globProfiles, trigger } = useGetProfilesLike();

  useEffect(() => {
    if (!profile) return;
    trigger({ usernamePrefix: "" });
  }, [profile, isOpen]);

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    const val = e.target.value;
    trigger(
      { usernamePrefix: val },
      {
        optimisticData: (globProfiles as UserProfile[]).filter((profile) =>
          profile.username.startsWith(val)
        ),
        rollbackOnError: true,
      }
    );
  };

  const handleDeleteFriend = async (
    profileOneId: string,
    profileTwoId: string
  ) => {
    await deleteFriend(profileOneId, profileTwoId);
    mutate("friends");
  };

  const handleDeleteFriendRequest = async (
    senderId: string,
    receiverId: string
  ) => {
    await deleteFriendRequest(senderId, receiverId);
    mutate("sent_friend_requests");
  };

  const handleSendFriendRequest = async (receiverId: string) => {
    if (!profile) return;
    await sendFriendRequest(profile.id, receiverId);
    mutate("sent_friend_requests");
  };

  return (
    <Dialog open={openModal} onOpenChange={onClose}>
      <DialogContent className="w-[460px]">
        <DialogHeader className="w-[90%]">
          <Input
            placeholder="Search by username"
            onChange={handleInputChange}
          />
        </DialogHeader>
        {loadingProfile || loadingFriendRequests ? (
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
        ) : (
          globProfiles?.map((globProfile, idx) => (
            <div key={globProfile.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-x-3">
                  <div className="relative w-12 h-12 rounded-md">
                    <Image
                      fill
                      src={globProfile.img_url!}
                      alt="avatar"
                      className="rounded-md"
                    />
                  </div>
                  <span className="text-md">{globProfile.username}</span>
                </div>
                <div>
                  {friends?.findIndex(
                    (friend) => friend.id === globProfile.id
                  ) !== -1 ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-x-2">
                        <span className="text-sm">Friends</span>
                        <IoChevronDown size={14} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="p-0">
                          <Button
                            size={"sm"}
                            onClick={() => {
                              handleDeleteFriend(profile!.id, globProfile.id);
                            }}
                            variant={"ghost"}
                            className="w-full h-full flex justify-start items-center p-2"
                          >
                            Delete
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : friendRequests?.findIndex(
                      (friend) => friend?.id === globProfile.id
                    ) !== -1 ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-x-2">
                        <span className="text-sm">Request sent</span>
                        <IoChevronDown size={14} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-zinc-300 dark:bg-zinc-800" />
                        <DropdownMenuItem className="p-0">
                          <Button
                            size={"sm"}
                            onClick={() => {
                              handleDeleteFriendRequest(
                                profile!.id,
                                globProfile.id
                              );
                            }}
                            className="w-full h-full flex justify-start items-center p-2"
                            variant={"ghost"}
                          >
                            Delete
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button
                      size={"sm"}
                      onClick={() => handleSendFriendRequest(globProfile.id)}
                      className="flex items-center gap-x-2 p-0 px-2"
                      variant={"ghost"}
                    >
                      <span className="text-sm">Add friend</span>
                      <MdPersonAdd size={18} />
                    </Button>
                  )}
                </div>
              </div>
              {idx !== globProfiles.length - 1 && (
                <Separator className="dark:bg-[#313131] bg-neutral-300/95 h-[1px]" />
              )}
            </div>
          ))
        )}
      </DialogContent>
    </Dialog>
  );
};
