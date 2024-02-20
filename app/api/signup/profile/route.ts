import { Database } from "@/types/database.types";
import { zodUsername } from "@/validations/zod";
import { auth, currentUser } from "@clerk/nextjs";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface SignupProfilePayload {
  username: string;
  imgUrl: string;
}

type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

export async function POST(req: Request, res: Response) {
  const cookieStore = cookies();
  const { getToken } = auth();
  const user = await currentUser();
  if (!user) return new NextResponse("Access Denied", { status: 401 });
  const supabaseAccessToken = await getToken({ template: "supabase" });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const body: SignupProfilePayload = await req.json();

  if (!zodUsername.safeParse(body.username).success)
    return new NextResponse(
      "Username must be 3~25 chars and can contains only characters, numbers or underscores(_)",
      { status: 400 }
    );
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .insert({})
    .select("id")
    .single();

  if (teamError)
    return new NextResponse(`Something went wrong ${JSON.stringify(teamError)}`, { status: 400 });
  const { error: profileError } = await supabase
    .from("profiles")
    .insert<ProfileInsert>({
      user_id: user.id,
      username: body.username.toLocaleLowerCase(),
      email: user.emailAddresses[0].emailAddress!,
      current_team: team.id,
      default_team: team.id,
      img_url: body.imgUrl,
    });

  if (profileError?.code === "23505")
    return new NextResponse(`Username already exisits`, { status: 409 });
  return new NextResponse(`OK`, { status: 200 });
}
