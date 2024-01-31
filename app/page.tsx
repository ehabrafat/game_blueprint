import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export default async function Index() {
  const user = await currentUser();
  if (user) return redirect("/lobby");
  return <h2>Hello Index</h2>;
}
