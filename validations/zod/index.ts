import * as z from "zod";

export const zodPassword = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(50, { message: "Password must be at most 50 characters" });

export const zodEmail = z.string().email();

export const zodUsername = z
  .string()
  .min(3, { message: "Username must be at least 3 characters" })
  .max(25, { message: "Username can be at most 25 characters" })
  .refine(
    (username) => {
      return /^[a-zA-Z0-9_]+$/.test(username);
    },
    {
      message:
        "Username can contains only characters, numbers or underscores(_)",
    }
  );
