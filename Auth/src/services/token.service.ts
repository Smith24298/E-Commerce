import crypto from "node:crypto";
import { prisma } from "../config/prisma";
import { AuthPayload, generateToken, generateRefreshToken } from "../utils/jwt";

export const REFRESH_TOKEN_LIFETIME_DAYS = 7;
export const REFRESH_TOKEN_MAX_AGE_MS = REFRESH_TOKEN_LIFETIME_DAYS * 24 * 60 * 60 * 1000;

export const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const createRefreshTokenRecord = async (payload: AuthPayload) => {
  const refreshToken = generateRefreshToken(payload);
  const tokenHash = hashToken(refreshToken);

  await prisma.refreshToken.create({
    data: {
      token: tokenHash,
      userId: payload.id,
      validUntil: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_MS),
    },
  });

  return refreshToken;
};

export const refreshAccessToken = async (refreshToken: string) => {
  const refreshTokenHash = hashToken(refreshToken);

  const result = await prisma.$transaction(async (tx) => {
    const storedToken = await tx.refreshToken.findUnique({
      where: { token: refreshTokenHash },
    });

    if (
      !storedToken ||
      storedToken.validUntil < new Date() ||
      storedToken.used ||
      storedToken.revoked
    ) {
      throw new Error("Invalid or expired refresh token");
    }

    const user = await tx.user.findUnique({
      where: { id: storedToken.userId },
    });
    if (!user) {
      throw new Error("User not found");
    }

    await tx.refreshToken.update({
      where: { id: storedToken.id },
      data: { used: true },
    });

    const newRefreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await tx.refreshToken.create({
      data: {
        token: hashToken(newRefreshToken),
        userId: user.id,
        validUntil: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_MS),
      },
    });

    const accessToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken, refreshToken: newRefreshToken };
  });

  return result;
};

export const logout = async (refreshToken: string) => {
  const refreshTokenHash = hashToken(refreshToken);
  await prisma.refreshToken.updateMany({
    where: { token: refreshTokenHash },
    data: { revoked: true },
  });
  return { message: "Logged out successfully" };
};
