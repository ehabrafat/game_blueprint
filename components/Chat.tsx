"use client";

import { ChatContent } from "./ChatContent";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";

export const Chat = () => {
  return (
    <div className="px-2 py-3 flex flex-col gap-y-2 dark:bg-[#252525] bg-secondary">
      <ChatHeader />
      <ChatContent />
      <ChatInput />
    </div>
  );
};
