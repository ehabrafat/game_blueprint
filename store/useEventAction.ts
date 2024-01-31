"use client";
import { MAX_TEAM_SIZE } from "@/constants";
import { useProfile, useTeamMembers } from "@/queries/hooks";
import { getTeamSize, syncMe } from "@/queries/services";
import { useEventStore } from "@/store/useEventStore";
import { useNotify } from "@/store/useNotify";
import { UserProfile } from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

export const useEventAction = () => {
  const { mutate } = useSWRConfig();
  const { data: profile } = useProfile();

  const { data: teamMembers } = useTeamMembers(profile?.current_team ?? null);

  const { event, payload, setEvent } = useEventStore();

  const [toastId, setToastId] = useState<string | number>("");

  const supabase = createClientComponentClient();

  const { emitTeamUpdate } = useNotify();
  const acceptTeamInvite = async (sender: UserProfile) => {
    if (!profile || !teamMembers) return;
    try {
      const myTeamSize = await getTeamSize(profile.current_team);
      const senderTeamSize = await getTeamSize(sender.current_team);
      if (
        sender.current_team === profile.current_team ||
        myTeamSize! > 1 ||
        senderTeamSize === MAX_TEAM_SIZE
      )
        return;

      let { data: joined } = await supabase.rpc("join_team", {
        arg_team_id: sender.current_team,
        arg_profile_id: profile.id,
      });

      if (!joined) return;
      syncMe();
      console.log("notify ", [...teamMembers, sender]);

      emitTeamUpdate([...teamMembers, sender]);
    } catch (error) {
      console.error(error);
    }
  };

  const acceptTeamJoin = async (sender: UserProfile) => {
    if (!profile || !teamMembers) return;
    try {
      const myTeamSize = await getTeamSize(profile.current_team);
      const senderTeamSize = await getTeamSize(sender.current_team);
      if (
        sender.current_team === profile.current_team ||
        myTeamSize === MAX_TEAM_SIZE ||
        senderTeamSize !== 1
      )
        return;

      let { data: joined } = await supabase.rpc("join_team", {
        arg_team_id: profile.current_team,
        arg_profile_id: sender.id,
      });

      if (!joined) return;

      syncMe();

      console.log("notify ", [...teamMembers, sender]);

      emitTeamUpdate([...teamMembers, sender]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!event) return;
    if (event === "team_invite" && payload) {
      if (toastId) toast.dismiss(toastId);
      const currentToastId = toast(
        `${payload.sender.username} has invited you to join his team`,
        {
          action: {
            label: "Accept",
            onClick: () => {
              acceptTeamInvite(payload.sender);
              setToastId("");
            },
          },
          cancel: {
            label: "Refuse",
            onClick: () => setToastId(""),
          },
          onAutoClose: () => setToastId(""),
          onDismiss: () => setToastId(""),
        }
      );
      setToastId(currentToastId);
    } else if (event === "team_join" && payload) {
      if (toastId) toast.dismiss(toastId);
      const currentToastId = toast.message(
        `${payload.sender.username} wants to join your team`,
        {
          action: {
            label: "Accept",
            onClick: () => {
              acceptTeamJoin(payload.sender);
              setToastId("");
            },
          },
          cancel: {
            label: "Refuse",
            onClick: () => setToastId(""),
          },
          onAutoClose: () => setToastId(""),
          onDismiss: () => setToastId(""),
        }
      );
      setToastId(currentToastId);
    } else if (event === "team_update") {
      console.log("got a team update");
      syncMe();
    } else if (event === "friends_update") {
      console.log("got a friends_update");
      mutate("friends");
    }
    setEvent("");
  }, [event, toastId]);
};
