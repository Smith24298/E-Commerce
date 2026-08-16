import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { prisma } from "../config/prisma";
import { emailQueue } from "../config/emailQueue";
import {generateToken, verifyToken,generateRefreshToken} from '../utils/jwt';

export const register = async (data: {
  email: string;
  password: string;
  name: string;
  role: "USER" | "SELLER";
}) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const tokenHash = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const validUntil = new Date(Date.now() + 15 * 60 * 1000);
  const { user} = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: data.email,
        password_hash: passwordHash,
        name: data.name,
        role: data.role,
        status: "PENDING",
      },
    });

    const token = await tx.emailVerificationToken.create({
      data: {
        token: tokenHash,
        userId: user.id,
        validUntil,
      },
    });

    return {
      user
    };
  });
  await emailQueue.add(
    "verify-email",
    {
      name: user.name,
      email: user.email,
      token: verificationToken,
      isReset:false
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    },
  );

  return {
    message: "User registered successfully. Please verify your email.",
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};

export const verifyEmail =async(token:string)=>{
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const emailToken = await prisma.emailVerificationToken.findUnique({
    where:{
      token:tokenHash
    }
  })
  if(!emailToken){
    throw new Error("Invalid or expired token");
  }
  if(emailToken.validUntil < new Date()){
    throw new Error("Token has expired");
  }
  await prisma.$transaction(async(tx)=>{

    await tx.user.update({
      where:{
        id:emailToken.userId
      },
      data:{
        status:"VERIFIED"
      }
    });
    await tx.emailVerificationToken.update({
      where:{
        id:emailToken.id
      },
      data:{
        used:true
      }
    });
  });
  return { message: "Email verified successfully." };
}

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
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

  const accessToken = generateToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    }
  );

  const refreshToken = generateRefreshToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  );

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await prisma.refreshToken.create({
    data: {
      token: refreshTokenHash,
      userId: user.id,
      validUntil: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    },
  });
  

  return {
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      token: refreshTokenHash,
    },
  });

  if(!storedToken || storedToken.validUntil < new Date() || storedToken.used || storedToken.revoked){
    throw new Error("Invalid or expired refresh token");
  }
  const user = await prisma.user.findUnique({
    where:{
      id:storedToken.userId
    },
  });
  if(!user){
    throw new Error("User not found");
  }

  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { used: true },
  });

  const newRefreshToken = generateRefreshToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const newRefreshTokenHash = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  await prisma.refreshToken.create({
    data: {
      token: newRefreshTokenHash,
      userId: user.id,
      validUntil: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    },
  });

  const accessToken = generateToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    }
  );
  return { accessToken, refreshToken: newRefreshToken };
};

export const forgetPasswordService = async (email:string)=>{
  const user = await prisma.user.findUnique({
    where:{
      email
    }
  });

  if(user){
    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(resetPasswordToken).digest("hex");
    const validUntil = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data:{
        token:tokenHash,
        userId:user.id,
        validUntil
      }
    });

    await emailQueue.add(
      "reset-password",
      {
        name: user.name,
        email: user.email,
        token: resetPasswordToken,
        isReset:true
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

export const logout = async (refreshToken: string) => {
  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  await prisma.refreshToken.updateMany({
    where: {
      token: refreshTokenHash,
    },
    data: {
      revoked: true,
    },
  });
  return { message: "Logged out successfully" };
};
export const resetPasswordService = async (data:{token:string,password:string})=>{
  const tokenHash = crypto.createHash("sha256").update(data.token).digest("hex");
  const resetToken = await prisma.passwordResetToken.findUnique({
    where:{
      token:tokenHash,
    }
  });
  if(!resetToken || resetToken.validUntil < new Date() || resetToken.used){
    throw new Error("Invalid or expired reset token");
  }
  const passwordHash = await bcrypt.hash(data.password, 12);
  await prisma.$transaction(async(tx)=>{
    await tx.user.update({
      where:{
        id:resetToken.userId
      },
      data:{
        password_hash:passwordHash
      }
    });
    await tx.passwordResetToken.update({
      where:{
        id:resetToken.id
      },
      data:{
        used:true
      }
    });
    await tx.refreshToken.updateMany({
      where: { userId: resetToken.userId, revoked: false },
      data: { revoked: true }
    });
  });

  return { message: "Password reset successful" };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    }
  });
  return user;
};