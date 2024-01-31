import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

export async function POST(req: Request) {
 const cookieStore = cookies();
 const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const body: LoginPayload = await req.json();

  if (!body.usernameOrEmail || !body.password)
    return new NextResponse("Missing values", { status: 400 });

  const { data } = await supabase
    .from("profiles")
    .select("email")
    .eq("username", body.usernameOrEmail)
    .single();

  const { error } = await supabase.auth.signInWithPassword({
    email: data?.email || body.usernameOrEmail,
    password: body.password,
  });
  if (error) return new NextResponse("Invalid Credentials", { status: 400 });

  return new NextResponse("OK", { status: 200 });
}
