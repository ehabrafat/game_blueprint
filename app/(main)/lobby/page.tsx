import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

import { Chat } from "@/components/Chat";
import { Playground } from "@/components/Playground";
import { SidebarTabs } from "@/components/SidebarTabs";
import { Nav } from "@/components/Nav";

const Lobby = async () => {
  const user = await currentUser();
  if (!user) return redirect("/");
  // const profile = await currentProfile(user.id);
  // if (!profile) return <ProfileForm />;
  return (
    <>
      <Nav />
      <div className="grid grid-cols-4 gap-4">
        <SidebarTabs />
        <Playground />
        <Chat />
      </div>
    </>
  );
};

export default Lobby;

/*
  <>
      <div className="w-80 fixed hidden md:flex flex-col gap-y-4 pl-2">
        <Searchbar />
        <NavigationSidebar />
      </div>
      <div className="md:pl-80">
        <div className="container flex gap-x-2">
          <LobbyTeam />
          <Chat />
        </div>
      </div>
    </>*/
