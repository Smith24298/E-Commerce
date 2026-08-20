export { register, verifyEmail } from "./email-verification.service";
export { forgetPasswordService, resetPasswordService } from "./password.service";
export {
  REFRESH_TOKEN_LIFETIME_DAYS,
  REFRESH_TOKEN_MAX_AGE_MS,
  createRefreshTokenRecord,
  refreshAccessToken,
  logout,
} from "./token.service";

import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { generateToken } from "../utils/jwt";
import { createRefreshTokenRecord } from "./token.service";

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.status !== "VERIFIED") {
    throw new Error("Email not verified");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password_hash
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const refreshToken = await createRefreshTokenRecord({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const accessToken = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { accessToken, refreshToken };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
  return user;
};
