"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRealTime } from "./useRealTime";
import { UserProfile } from "@/types";
import { useProfile } from "@/queries/hooks";

export const useNotify = () => {
  const { broadcast } = useRealTime();
  const { data: profile } = useProfile();
  const supabase = createClientComponentClient();

  const emitTeamUpdate = async (newMembers: UserProfile[]) => {
    try {
      const membersChannelsSet = new Set(
        newMembers
          .filter((member) => member.id !== profile?.id)
          .map((member) => `user_${member.id}`)
      );

      broadcast({
        event: "team_update",
        channelsNames: [...membersChannelsSet],
      });

      for (const member of newMembers) {
        const { data: memberFriends } = await supabase
          .from("friends")
          .select("profile_two_id")
          .eq("profile_one_id", member.id);

        if (!memberFriends) continue;

        const friendChannels = memberFriends
          .map((friend) => `user_${friend.profile_two_id}`)
          .filter(
            (friendChannel) =>
              !membersChannelsSet.has(friendChannel) &&
              friendChannel != `user_${profile?.id}`
          );

        broadcast({
          event: "friends_update",
          channelsNames: friendChannels,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { emitTeamUpdate };
};
