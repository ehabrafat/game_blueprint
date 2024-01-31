"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();
  const handleSignout = async () => {
    const supabase = createClientComponentClient();
    await supabase.auth.signOut();
    router.push('/');
  };
  return (
    <Button variant={"link"} size={"sm"} onClick={handleSignout}>
      <span className="font-normal text-lg">Logout</span>
    </Button>
  );
};
