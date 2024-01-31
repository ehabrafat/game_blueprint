import { createClient } from "@/utils/supabase/server";
import { zodEmail, zodPassword } from "@/validations/zod";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

interface SignupPayload {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const body: SignupPayload = await req.json();
  if (!zodEmail.safeParse(body.email).success)
    return new NextResponse("Email not valid", { status: 400 });
  if (!zodPassword.safeParse(body.email).success)
    return new NextResponse("Password must be 8~50 characters", {
      status: 400,
    });
  const origin = headers().get("origin");
  const { error, data } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error)
    return new NextResponse("Something went wrong, try again later.", {
      status: 400,
    });

  return new NextResponse(`OK`, { status: 200 });
}
