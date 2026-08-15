import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { prisma } from "../config/prisma";
import { emailQueue } from "../config/emailQueue";

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

  const validUntil = new Date(Date.now() + 60 * 60 * 1000);
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