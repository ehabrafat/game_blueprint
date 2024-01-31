import { currentUser } from "@/lib/currentUser";
import { Database } from "@/types/database.types";
import { zodUsername } from "@/validations/zod";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface SignupProfilePayload {
  username: string;
  imgUrl: string;
}

type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

export async function POST(req: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const user = await currentUser();
  if (!user) return new NextResponse("Access Denied", { status: 401 });
  const body: SignupProfilePayload = await req.json();
  console.log(body);
  
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
    return new NextResponse(`Something went wrong`, { status: 400 });
  const { error: profileError } = await supabase
    .from("profiles")
    .insert<ProfileInsert>({
      user_id: user.id,
      username: body.username.toLocaleLowerCase(),
      email: user.email!,
      current_team: team.id,
      default_team: team.id,
      img_url: body.imgUrl,
    });
    
  if (profileError?.code === '23505')
    return new NextResponse(`Username already exisits`, { status: 409 });
  return new NextResponse(`OK`, { status: 200 });
}
