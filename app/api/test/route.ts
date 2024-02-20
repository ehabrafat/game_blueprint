import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  const channel = supabase.channel(`user_94240eb4-0f9c-43fd-b983-26168b1e765b`);
  channel.send({
    type: "broadcast",
    event: "team_invite",
    payload: { sender: { username: "HOBAA" } },
  });
}

// 94240eb4-0f9c-43fd-b983-26168b1e765b
