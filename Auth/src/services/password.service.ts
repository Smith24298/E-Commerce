import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { prisma } from "../config/prisma";
import { emailQueue } from "../config/emailQueue";
import { hashToken } from "./token.service";

const PASSWORD_RESET_TOKEN_VALIDITY_MS = 15 * 60 * 1000;

export const forgetPasswordService = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(resetPasswordToken);
    const validUntil = new Date(Date.now() + PASSWORD_RESET_TOKEN_VALIDITY_MS);

    await prisma.passwordResetToken.create({
      data: {
        token: tokenHash,
        userId: user.id,
        validUntil,
      },
    });

    await emailQueue.add(
      "reset-password",
      {
        name: user.name,
        email: user.email,
        token: resetPasswordToken,
        isReset: true,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      },
    );
  }

  return { message: "If the email exists, a password reset link has been sent." };
};

export const resetPasswordService = async (data: { token: string; password: string }) => {
  const tokenHash = hashToken(data.token);
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token: tokenHash },
  });

  if (!resetToken || resetToken.validUntil < new Date() || resetToken.used) {
    throw new Error("Invalid or expired reset token");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: resetToken.userId },
      data: { password_hash: passwordHash },
    });
    await tx.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    });
    await tx.refreshToken.updateMany({
      where: { userId: resetToken.userId, revoked: false },
      data: { revoked: true },
    });
  });

  return { message: "Password reset successful" };
};
