"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignupSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Header } from "../auth/Header";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { FormError } from "./FormError";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormSuccess } from "./FormSuccess";
import { FcGoogle } from "react-icons/fc";
import { createBrowserClient } from "@supabase/ssr";
import { createSupbaseClient } from "@/utils/supabase/client";

export const SignupForm = () => {
  const supabase = createSupbaseClient();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignupSchema>) {
    try {
      await axios.post("/api/signup", values);
      setErrorMessage("");
      form.reset();
      setSuccessMessage("Check your email");
    } catch (err) {
      if (err instanceof AxiosError) {
        setErrorMessage(err.response?.data);
      }
    }
  }
  return (
    <Card className="w-[420px]">
      <CardHeader>
        <Header />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormError message={errorMessage} />
            <FormSuccess message={successMessage} />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Email"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Password"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 dark:text-white"
              disabled={form.formState.isSubmitting}
            >
              Sign up
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          size={"lg"}
          variant="secondary"
          className="w-full flex items-center justify-center gap-x-2"
        >
          <FcGoogle className="w-5 h-5" />
          <span className="font-normal text-sm">Continue with Google</span>
        </Button>
      </CardFooter>
      <CardFooter>
        <Button
          variant={"link"}
          size={"sm"}
          className="font-normal w-full text-sm dark:text-gray-400/90 text-gray-800"
          asChild
        >
          <Link href="/login">Already have an account?</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
