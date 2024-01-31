import { zodEmail, zodPassword, zodUsername } from "@/validations/zod";
import * as z from "zod";

export const LoginSchema = z.object({
  usernameOrEmail: z.string().min(1, { message: "Username/Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const SignupSchema = z.object({
  email: zodEmail,
  password: zodPassword,
});

export const ProfileSchema = z.object({
  username: zodUsername,
  avatar: z.string().min(1, "Avater is required"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(50, { message: "Password must be at most 50 characters" }),
  confirmPassword: z.string().min(1, "Confirm password is required"),
});

export const MessageSchema = z.object({
  message: z.string().min(1, { message: "Message can't be empty" }),
});
