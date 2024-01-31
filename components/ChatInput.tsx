"use client";

import { useMessagesInf, useProfile } from "@/queries/hooks";
import { insertMessage } from "@/queries/services";
import { MessageSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoSend } from "react-icons/io5";
import * as z from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import EmojiPicker from "emoji-picker-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsEmojiSmile } from "react-icons/bs";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export const ChatInput = () => {
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const {
    data: messages,
    isLoading: loadingMessages,
    mutate,
    size,
    setSize,
  } = useMessagesInf(profile?.current_team ?? null);

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof MessageSchema>) => {
    if (!profile) return;
    await insertMessage({
      content: values.message,
      senderId: profile!.id,
      teamId: profile!.current_team,
    });
    form.reset();
    form.setFocus("message");
  };

  const handleOnEmojiSelect = (emoji: any) => {
    form.setValue(
      "message",
      form.getValues("message") +
        " " +
        String.fromCodePoint(parseInt(`0x${emoji.unified}`, 16))
    );
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center h-9">
          <FormMessage />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-1 relative">
                <FormControl>
                  <input
                    {...field}
                    placeholder="message"
                    className=" dark:bg-zinc-700/30 bg-neutral-300/95 pr-4 resize-none px-2 py-1 rounded-md"
                  />
                </FormControl>
                <div className="absolute right-2 top-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <BsEmojiSmile />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <Picker data={data} onEmojiSelect={handleOnEmojiSelect} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 dark:text-white"
            disabled={form.formState.isSubmitting}
            size={"sm"}
          >
            <IoSend className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};
