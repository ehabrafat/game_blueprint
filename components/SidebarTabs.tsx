"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendsList } from "./FriendsList";
import { FriendRequestsList } from "./FriendRequestsList";

export const SidebarTabs = () => {
  return (
    <div className="w-full">
      <Tabs defaultValue="friends">
        <TabsList className="w-full">
          <TabsTrigger value="friends" className="w-1/2">
            Friends
          </TabsTrigger>
          <TabsTrigger value="requests" className="w-1/2">
            Requests
          </TabsTrigger>
        </TabsList>
        <TabsContent value="friends" className="h-96 pt-2">
          <FriendsList />
        </TabsContent>
        <TabsContent value="requests" className="h-96 pt-2">
          <FriendRequestsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};
