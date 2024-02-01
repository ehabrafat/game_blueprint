"use client";

import {
  useConversationId,
  useMatchedPlayers,
  useMessagesInf,
  useProfile,
} from "@/queries/hooks";
import { getProfileBy } from "@/queries/services";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { RealtimeEvent, useEventStore } from "./useEventStore";
import { useScrollAction } from "./useScrollAction";
import { UserState } from "@/types";
import { useOnlineUsers } from "./useOnlineUsers";
import { Database } from "@/types/database.types";

const supabase = createClientComponentClient<Database>();

export const useRealTime = () => {
  const { mutate } = useSWRConfig();
  const { data: profile } = useProfile();
  const { data: messages, mutate: mutateMessages } = useMessagesInf(
    profile?.current_team ?? null
  );
  const { data: conversationId } = useConversationId(
    profile?.current_team ?? null
  );

  const { data: matchedPLayers } = useMatchedPlayers();

  const { setEvent, setPayload } = useEventStore();

  const { setScrollChatDown } = useScrollAction();

  const setOnlineUsersIds = useOnlineUsers((state) => state.setOnlineUsersIds);

  // presence channel
  useEffect(() => {
    if (!profile) return;

    const channel = supabase.channel("presence");
    channel
      .on("presence", { event: "sync" }, () => {
        const presenceState = channel.presenceState();
        const usersIds: Set<string> = new Set<string>();
        for (const id in presenceState) {
          const userState = presenceState[id][0] as UserState & {
            presence_ref: string;
          };
          usersIds.add(userState.userId);
        }
        setOnlineUsersIds(usersIds);
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") {
          return;
        }
        await channel.track({
          userId: profile.id,
        });
      });

    return () => {
      channel.unsubscribe();
    };
  }, [profile]);

  // user & teams channels
  useEffect(() => {
    if (!profile) return;
    const myChannel = supabase.channel(`user_${profile.id}`);
    myChannel
      .on(
        "broadcast",
        { event: "MatchmakingSucceeded" as RealtimeEvent },
        async ({ payload }) => {
          console.log("got team matching event", payload);

          const players = payload.players;
          for (const player of players) {
            const playerId = player.playerId;
            const { data: team } = await supabase
              .from("profiles")
              .select("current_team")
              .eq("id", playerId)
              .single();

            if (!team) throw new Error("team not found");
            await supabase
              .from("teams")
              .update({
                match_id: payload.matchId,
              })
              .eq("id", team.current_team);
            mutate("matched_players");
          }
        }
      )
      .on(
        "broadcast",
        { event: "team_invite" as RealtimeEvent },
        ({ payload }) => {
          setEvent("team_invite");
          setPayload(payload);
        }
      )
      .on(
        "broadcast",
        { event: "team_join" as RealtimeEvent },
        ({ payload }) => {
          setEvent("team_join");
          setPayload(payload);
        }
      )
      .on("broadcast", { event: "team_update" as RealtimeEvent }, () => {
        setEvent("team_update");
      })
      .on("broadcast", { event: "friends_update" as RealtimeEvent }, () => {
        setEvent("friends_update");
      })
      .subscribe();
    return () => {
      myChannel.unsubscribe();
    };
  }, [profile]);

  // database channel
  useEffect(() => {
    if (!conversationId || !profile || !messages) return;
    const dbChannel = supabase
      .channel("db_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          console.log("got a new msg");
          const newMessage = payload.new as Message;
          const sender = await getProfileBy("id", newMessage.sender_id, [
            "id",
            "username",
            "img_url",
          ]);
          if (!sender) throw new Error("sender not found");

          const messageWithSender = { ...newMessage, sender };
          const optimisticMessages = [
            [messageWithSender, ...messages[0]],
            ...messages.slice(1),
          ];

          mutateMessages(optimisticMessages, {
            optimisticData: optimisticMessages,
            rollbackOnError: true,
            revalidate: false,
          });

          setScrollChatDown(true);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "friend_requests",
          filter: `receiver_id=eq.${profile.id}`,
        },
        (payload) => {
          console.log("got a friend request", payload);
          mutate("received_friend_requests");
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "friends",
          filter: `profile_two_id=eq.${profile.id}`,
        },
        (payload) => {
          console.log("new friend", payload);

          mutate("friends");
        }
      )
      .subscribe();

    return () => {
      dbChannel.unsubscribe();
    };
  }, [profile, conversationId, messages]);

  const broadcast = ({
    event,
    payload,
    channelsNames,
  }: {
    event: RealtimeEvent;
    payload?: any;
    channelsNames: string[];
  }) => {
    for (const channelName of channelsNames) {
      console.log("channel in invite ", channelName);
      console.log(supabase.getChannels());

      const channel = supabase.channel(channelName);
      if (!channel) continue;
      channel.subscribe((status, error) => {
        if (error) {
          console.log("channel err ", error);
        }
        if (status != "SUBSCRIBED") return;
        console.log("broadcase ", channelName, " event ", event);
        channel.send({
          type: "broadcast",
          event,
          payload,
        });
      });
    }
  };

  return { broadcast };
};
