import { SignInButton, SignOutButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Index() {
  const { userId } = auth();
  console.log(userId);
  if (!userId) return <SignInButton />;
  else return <SignOutButton />;
  return <h2>Hello Index</h2>;
}
