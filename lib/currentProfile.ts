import { supabaseClient } from "@/utils/supabase/client";
import { auth } from "@clerk/nextjs";

export const currentProfile = async () => {
  const { userId, getToken } = auth();
  const supabaseAccessToken = await getToken({ template: "supabase" });
  if (!supabaseAccessToken) return null;
  const supabase = await supabaseClient(supabaseAccessToken);
  const { data } = await supabase
    .from("profiles")
    .select("id, username, img_url, current_team, default_team")
    .eq("user_id", userId)
    .single();
  return data;
};
