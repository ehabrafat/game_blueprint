import { LoginForm } from "@/components/forms/LoginForm";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Login() {
  const user = await currentUser();
  if (user) return redirect("/");
  return <LoginForm />;
}
