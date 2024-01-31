"use client";

import { formatDate } from "@/lib/helpers";
import { MessageWithSender } from "@/types";
import Image from "next/image";

interface ChatMessageProbs {
  message: MessageWithSender;
}

export const ChatMessage = ({ message }: ChatMessageProbs) => {
  return (
    <div
      className="w-full flex gap-x-2 rounded-md p-2"
      key={message.id}
    >
      <div className="relative w-9 h-9 flex-shrink-0">
        <Image
          fill
          src={message.sender.img_url}
          alt="sender_img"
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-x-1">
          <h2 className="font-semibold text-[15px]">
            {message.sender.username}
          </h2>
          <span className="text-xs text-gray-500">
            {formatDate(message.created_at)}
          </span>
        </div>
        <p className="text-[14px]">{message.content}</p>
      </div>
    </div>
  );
};
