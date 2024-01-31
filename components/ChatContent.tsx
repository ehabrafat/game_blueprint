"use client";

import { useMessagesInf, useProfile } from "@/queries/hooks";
import { useChatScroll } from "@/store/useChatScroll";
import { useEffect, useRef } from "react";
import { FaSpinner } from "react-icons/fa6";
import { Skeleton } from "./ui/skeleton";

import { ChatMessage } from "./ChatMessage";
import { BATCH_SIZE } from "@/constants";

export const ChatContent = () => {
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const {
    data: messages,
    isLoading: loadingMessages,
    isValidating: validatingMessages,
    size,
    setSize,
  } = useMessagesInf(profile?.current_team ?? null);

  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  useChatScroll({
    chatRef,
    bottomRef,
    count: messages?.[0]?.length ?? 0,
    loadMore: () => setSize(size + 1),
    shouldLoadMore: !loadingMessages,
  });

  if (loadingProfile || loadingMessages || !messages)
    return (
      <div className="flex flex-col gap-y-4">
        {Array(6)
          .fill(0)
          .map((_, idx) => (
            <div className="flex items-center space-x-4" key={idx}>
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
      </div>
    );

  return (
    <div className="h-80 overflow-y-auto" ref={chatRef}>
      <div className="w-full h-full flex-col gap-y-2">
        {validatingMessages &&
          messages[messages.length - 1].length >= BATCH_SIZE && (
            <div className="mx-auto py-2">
              <FaSpinner className="animate-spin w-4 h-4" />
            </div>
          )}
        {messages
          .flat()
          .toReversed()
          .map((message: any) => (
            <ChatMessage message={message} key={message.id} />
          ))}
      </div>
    </div>
  );
};
