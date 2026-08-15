import { z } from "zod";
import {
  emailSchema,
  passwordSchema,
  nameSchema,
  roleSchema
} from "./common.schema";

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    name: nameSchema,
    role:roleSchema
  })
  .strict();

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, {
      message: "Password is required",
    }),
  })
  .strict();

export const forgotPasswordSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, {
      message: "Token is required",
    }),
    password: passwordSchema,
  })
  .strict();

export const verifyEmailSchema = z
  .object({
    token: z.string().trim().min(1, {
      message: "Token is required",
    }),
  })
  .strict();

export const refreshTokenSchema = z
  .object({
    refreshToken: z.string().trim().min(1, {
      message: "Refresh token is required",
    }),
  })
  .strict();