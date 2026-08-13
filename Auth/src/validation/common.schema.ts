import { z } from "zod";

export const emailSchema = z
  .email({ message: "Invalid email address" })
  .transform((email) => email.toLowerCase().trim());

export const passwordSchema = z
  .string()
  .min(8, {
    message: "Password must be at least 8 characters long",
  })
  .max(100, {
    message: "Password must not exceed 100 characters",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/\d/, {
    message: "Password must contain at least one number",
  })
  .regex(/[@$!%*?&]/, {
    message: "Password must contain at least one special character",
  });

export const nameSchema = z
  .string()
  .trim()
  .min(1, {
    message: "Name is required",
  })
  .max(100, {
    message: "Name must not exceed 100 characters",
  });

export const roleSchema = z.enum(["CUSTOMER", "VENDOR"], {
  message: "Invalid role",
});