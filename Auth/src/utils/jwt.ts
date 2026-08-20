import jwt, { SignOptions } from "jsonwebtoken";
import environment from "../config/env";

export interface AuthPayload {
  id: string;
  email: string;
  role: "USER" | "SELLER" | "ADMIN";
}

export const generateToken = (payload: AuthPayload) => {
  const options: SignOptions = {
    expiresIn: environment.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(
    payload,
    environment.JWT_SECRET,
    options
  );
};

export const generateRefreshToken = (payload: AuthPayload) => {
  const options: SignOptions = {
    expiresIn: environment.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(
    payload,
    environment.JWT_SECRET,
    options
  );
};

export const verifyToken = (token: string): AuthPayload => {
  const decoded = jwt.verify(
    token,
    environment.JWT_SECRET
  );

  if (typeof decoded === "string") {
    throw new Error("Invalid token");
  }

  return decoded as AuthPayload;
};