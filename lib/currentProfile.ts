import { Database } from "@/types/database.types";
import {
  User,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const currentProfile = async (userId: string) => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data } = await supabase
    .from("profiles")
    .select("id, username, img_url, current_team, default_team")
    .eq("user_id", userId)
    .single();
  return data;
};
