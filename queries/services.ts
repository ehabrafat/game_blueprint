import { BATCH_SIZE } from "@/constants";
import { UserProfile, UserProfileWithTeamSize } from "@/types";
import { Database } from "@/types/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { mutate } from "swr";
import { unstable_serialize } from "swr/infinite";
import { getMessagesInfKey } from "./hooks";

const supabase = createClientComponentClient<Database>();

export const syncMe = async () => {
  await mutate("profile");
  mutate("team_size");
  mutate("conversation_id");
  mutate("team_members");
  mutate("friends");
  mutate(unstable_serialize(getMessagesInfKey));
};

export const getConversationId = async (teamId: string) => {
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("team_id", teamId)
    .single();
  if (!conversation) throw new Error("conversation not found");
  return conversation.id;
};

export const getTeamSize = async (teamId: string) => {
  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("current_team", teamId);
  return count;
};

export const getProfileById = async (id: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, img_url, current_team, default_team")
    .eq("id", id)
    .single();
  if (error) console.error(error);
  return data;
};

export const getProfileByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, img_url, current_team, default_team")
    .eq("user_id", userId)
    .single();
  if (error) console.error(error);
  return data;
};

export const getProfileBy = async (
  key: keyof Profile,
  val: string,
  select: (keyof Profile)[] = [
    "id",
    "username",
    "img_url",
    "current_team",
    "default_team",
  ]
) => {
  const { data, error } = await supabase
    .from("profiles")
    .select(select.join(","))
    .eq(key, val)
    .single();
  if (error) console.error(error);
  return data;
};

export const fetchFriends = async (profileId: string) => {
  const { data } = await supabase
    .from("friends")
    .select("profile_two_id")
    .eq("profile_one_id", profileId);
  if (!data) return [];
  const profiles: UserProfileWithTeamSize[] = [];
  for (const row of data) {
    const profile = await getProfileById(row.profile_two_id);
    if (!profile) throw new Error("Friend not have a profile");
    const { data } = await supabase
      .from("profiles")
      .select("current_team")
      .eq("id", row.profile_two_id)
      .single();
    if (!data?.current_team) throw new Error("No team id found");
    const teamSize = await getTeamSize(data.current_team);
    profiles.push({ ...profile, team_size: teamSize ?? 1 });
  }
  return profiles;
};

export const fetchProfile = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await getProfileByUserId(user.id);
  return profile;
};

export const fetchMessages = async (teamId: string, offset: number) => {
  const conversationId = await getConversationId(teamId);
  const currentDate = new Date();
  const twentyFourHoursAgo = new Date(
    currentDate.getTime() - 24 * 60 * 60 * 1000
  );
  const { data: messages, error } = await supabase
    .from("messages")
    .select("id, content, sender_id, created_at")
    .eq("conversation_id", conversationId)
    .gt("created_at", twentyFourHoursAgo.toISOString())
    .order("created_at", { ascending: false })
    .range(offset * BATCH_SIZE, offset * BATCH_SIZE + BATCH_SIZE - 1);

  if (error) console.error(error);
  if (!messages) return [];
  const messagesWithSenders = await Promise.all(
    messages.map(async (message) => {
      const sender = await getProfileBy("id", message.sender_id, [
        "id",
        "username",
        "img_url",
      ]);
      if (!sender) throw new Error("message without a sender");
      return { ...message, sender };
    })
  );
  return messagesWithSenders;
};

export const insertMessage = async ({
  content,
  senderId,
  teamId,
}: {
  content: string;
  senderId: string;
  teamId: string;
}) => {
  const conversationId = await getConversationId(teamId);
  const { error } = await supabase.from("messages").insert({
    content: content,
    conversation_id: conversationId,
    sender_id: senderId,
  });
  if (error) console.error(error);
};

export const fetchTeamMembers = async (teamId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, img_url, current_team, default_team")
    .eq("current_team", teamId);
  if (error) console.error(error);
  return data;
};

export const fetchReceivedFriendRequests = async (profileId: string) => {
  const { data } = await supabase
    .from("friend_requests")
    .select("sender_id")
    .eq("receiver_id", profileId);
  if (!data) return [];
  const senderProfiles = [];
  for (const row of data) {
    const { data: senderProfile } = await supabase
      .from("profiles")
      .select("id, username, img_url")
      .eq("id", row.sender_id)
      .single();
    senderProfiles.push(senderProfile);
  }
  return senderProfiles;
};

export const fetchSentFriendRequests = async (profileId: string) => {
  const { data } = await supabase
    .from("friend_requests")
    .select("sender_id, receiver_id")
    .eq("sender_id", profileId);
  if (!data) return [];
  const senderProfiles = [];
  for (const row of data) {
    const { data: senderProfile } = await supabase
      .from("profiles")
      .select("id, username, img_url")
      .eq("id", row.receiver_id)
      .single();
    senderProfiles.push(senderProfile);
  }
  return senderProfiles;
};

export const deleteFriendRequest = async (
  senderId: string,
  receiverId: string
) => {
  const { error } = await supabase
    .from("friend_requests")
    .delete()
    .match({ sender_id: senderId, receiver_id: receiverId });
  if (error) console.error(error);
};

export const deleteFriend = async (
  profileOneId: string,
  profileTwoId: string
) => {
  console.log("profile one ", profileOneId);
  console.log("profile two ", profileTwoId);

  return Promise.all([
    supabase
      .from("friends")
      .delete()
      .match({ profile_one_id: profileOneId, profile_two_id: profileTwoId }),
    supabase
      .from("friends")
      .delete()
      .match({ profile_one_id: profileTwoId, profile_two_id: profileOneId }),
  ]);
};

export const addFriend = async (profileOneId: string, profileTwoId: string) => {
  return Promise.all([
    supabase
      .from("friends")
      .insert({ profile_one_id: profileOneId, profile_two_id: profileTwoId }),
    supabase
      .from("friends")
      .insert({ profile_one_id: profileTwoId, profile_two_id: profileOneId }),
  ]);
};

export const leaveTeam = async (member: UserProfile) => {
  const { error } = await supabase
    .from("profiles")
    .update({ current_team: member.default_team })
    .eq("id", member.id);
  if (error) console.error(error);
};

export const sendFriendRequest = async (
  senderId: string,
  receiverId: string
) => {
  return supabase.from("friend_requests").insert({
    sender_id: senderId,
    receiver_id: receiverId,
  });
};

export const fetchProfilesLike = async (
  usernamePrefix: string,
  profileId: string
) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, img_url, current_team, default_team")
    .like("username", `${usernamePrefix}%`)
    .neq("id", profileId)
    .limit(10);
  if (error) console.error(error);
  return data;
};

export const fetchMatchedPlayers = async (teamId: string) => {
  const { data: match } = await supabase
    .from("teams")
    .select("match_id")
    .eq("id", teamId)
    .single();
  if (!match?.match_id) return [];
  const { data: teams } = await supabase
    .from("teams")
    .select("id")
    .eq("match_id", match.match_id);
  if (!teams) return [];
  const players: (UserProfile & { player_session_id: string | null })[] = [];
  for (const team of teams) {
    const { data: teamPlayers } = await supabase
      .from("profiles")
      .select(
        "id, username, current_team, default_team, img_url, player_session_id"
      )
      .eq("current_team", team.id);
    if (!teamPlayers) continue;
    players.push(...teamPlayers);
  }
  return players;
};
