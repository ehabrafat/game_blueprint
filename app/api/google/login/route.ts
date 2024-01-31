import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  if (error) return new NextResponse("Invalid Credentials", { status: 400 });

  return new NextResponse("OK", { status: 200 });
}
