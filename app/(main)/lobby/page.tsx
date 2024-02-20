import { redirect } from "next/navigation";

import { Chat } from "@/components/Chat";
import { Playground } from "@/components/Playground";
import { SidebarTabs } from "@/components/SidebarTabs";
import { Nav } from "@/components/Nav";
import { auth, currentUser } from "@clerk/nextjs";
import { currentProfile } from "@/lib/currentProfile";
import { ProfileForm } from "@/components/forms/ProfileForm";

const Lobby = async () => {
  return (
    <>
      <Nav />
      <div className="flex items-center gap-x-2">
        <SidebarTabs />
        <Playground />
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
