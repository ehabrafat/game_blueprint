"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@supabase/supabase-js";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import * as z from "zod";
import { Header } from "../auth/Header";
import { FormError } from "./FormError";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    try {
      await axios.post("/api/login", values);
      setErrorMessage("");
      form.reset();
      router.push("/lobby");
    } catch (err) {
      if (err instanceof AxiosError) {
        setErrorMessage(err.response?.data);
      }
    }
  }
  const signWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    router.push("/lobby");
  };
  return (
    <>
      <Card className="w-[420px]">
        <CardHeader className="flex flex-col gap-y-4">
          <Header />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormError message={errorMessage} />
              <FormField
                control={form.control}
                name="usernameOrEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Username or Email"
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
                variant={"link"}
                size={"sm"}
                className="w-full flex justify-start px-1 text-sm font-normal dark:text-gray-400/90 text-gray-800"
                asChild
              >
                <Link href={"/forgot-password"}>Forgot password?</Link>
              </Button>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 dark:text-white"
                disabled={form.formState.isSubmitting}
              >
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            size={"lg"}
            variant="secondary"
            className="w-full flex items-center justify-center gap-x-2"
            onClick={signWithGoogle}
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
            <Link href="/signup">Don't have an account?</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
