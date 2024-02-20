"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SupabaseClient,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Skeleton } from "../ui/skeleton";
import { FormError } from "./FormError";
import { supabaseClient } from "@/utils/supabase/client";
import { useAuth } from "@clerk/nextjs";

export const ProfileForm = () => {
  const { userId, getToken } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const router = useRouter();
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      username: "",
      avatar: "",
    },
  });

  const handleChangeAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) {
      setImgUrl("");
      return;
    }
    setLoadingAvatar(true);
    const supabaseAccessToken = await getToken({ template: "supabase" });

    const supabase = await supabaseClient(supabaseAccessToken!);
    const { error, data } = await supabase.storage
      .from("avatars")
      .upload(`avatar_${Date.now()}.png`, file);
      
    if (error) {
      console.error(error);
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(data?.path!);
    setLoadingAvatar(false);
    setImgUrl(publicUrl);
  };

  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    try {
      await axios.post("/api/signup/profile", { ...values, imgUrl });
      setErrorMessage("");
      form.reset();
      router.refresh();
    } catch (err) {
      if (err instanceof AxiosError) {
        setErrorMessage(err.response?.data);
      }
    }
  }

  return (
    <div className="flex justify-center translate-y-8">
      <Card className="w-[420px] bg-secondary dark:bg-[#252525] text-gray-600 dark:text-gray-300/90">
        <CardHeader>
          <div className="flex flex-col items-center gap-y-2">
            <h2 className="uppercase text-2xl ">Get ready !</h2>
            <span className="text-sm text-md capitalize">
              The party is about to start
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormError message={errorMessage} />
              {loadingAvatar && (
                <Skeleton className="h-24 w-24 rounded-md mx-auto" />
              )}
              {imgUrl && (
                <div className="relative h-24 w-24 rounded-md mx-auto">
                  <Image fill src={imgUrl} alt="avatar" />
                </div>
              )}
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload your avatar</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={form.formState.isSubmitting}
                        type="file"
                        onChange={(e) => {
                          handleChangeAvatar(e);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pick a username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Joo"
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white "
                disabled={form.formState.isSubmitting}
              >
                Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
