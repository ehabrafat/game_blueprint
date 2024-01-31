"use client";

import useSWR from "swr";

import {
  fetchFriends,
  fetchMessages,
  fetchProfile,
  fetchProfilesLike,
  fetchReceivedFriendRequests,
  fetchSentFriendRequests,
  fetchTeamMembers,
  getConversationId,
  getTeamSize,
} from "./services";
import useSWRMutation from "swr/mutation";
import useSWRInfinite from "swr/infinite";

export const useProfile = () => {
  return useSWR("profile", fetchProfile);
};

export const useTeamSize = (teamId: string | null) => {
  return useSWR(teamId ? "team_size" : null, () => getTeamSize(teamId!));
};

export const useFriends = (profileId: string | null) => {
  return useSWR(profileId ? "friends" : null, () => fetchFriends(profileId!));
};

export const getMessagesInfKey = (pageIndex: number, prevData: any) => {
  if (prevData && !prevData.length) return null;
  return pageIndex.toString();
};

export const useMessagesInf = (teamId: string | null) => {
  return useSWRInfinite(
    teamId ? getMessagesInfKey : (pageIndex: number, prevData: any) => null,
    (pageIndex) => fetchMessages(teamId!, parseInt(pageIndex))
  );
};

export const useTeamMembers = (teamId: string | null) => {
  return useSWR(teamId ? "team_members" : null, () =>
    fetchTeamMembers(teamId!)
  );
};

export const useConversationId = (teamId: string | null) => {
  return useSWR(teamId ? "conversation_id" : null, () =>
    getConversationId(teamId!)
  );
};

export const useReceivedFriendRequests = (profileId: string | null) => {
  return useSWR(profileId ? "received_friend_requests" : null, () =>
    fetchReceivedFriendRequests(profileId!)
  );
};

export const useSentFriendRequests = (profileId: string | null) => {
  return useSWR(profileId ? "sent_friend_requests" : null, () =>
    fetchSentFriendRequests(profileId!)
  );
};

export const useGetProfilesLike = () => {
  const { data: profile } = useProfile();
  return useSWRMutation(
    profile ? "global_profiles" : null,
    async (url, { arg }: { arg: { usernamePrefix: string } }) => {
      return await fetchProfilesLike(arg.usernamePrefix, profile!.id);
    }
  );
};
