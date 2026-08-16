import jwt, { SignOptions } from "jsonwebtoken";
import environment from "../config/env";

export interface AuthPayload {
  id: string;
  email: string;
  role: "USER" | "SELLER" | "ADMIN";
}

const expiresIn: SignOptions["expiresIn"] = environment.JWT_EXPIRES_IN as SignOptions["expiresIn"];
export const generateToken = (
  payload: AuthPayload,
) => {
  return jwt.sign(
    payload,
    environment.JWT_SECRET,
    { expiresIn }
  );
};

export const verifyToken = (
  token: string
): AuthPayload => {
  try {
    const decoded = jwt.verify(
      token,
      environment.JWT_SECRET
    );

    if (typeof decoded === "string") {
      throw new Error("Invalid token");
    }

    return decoded as AuthPayload;
  } catch {
    throw new Error("Invalid token");
  }
};
const refreshOptions: SignOptions = {
    expiresIn: environment.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]
};
export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, environment.JWT_SECRET, refreshOptions);
}