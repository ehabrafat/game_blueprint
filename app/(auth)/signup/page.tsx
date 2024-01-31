import { SignupForm } from "@/components/forms/SignupForm";
import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export default async function Signup() {
  const user = await currentUser();
  if (user) return redirect("/");
  return <SignupForm />;
}
