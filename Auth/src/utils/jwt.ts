import jwt, { SignOptions } from "jsonwebtoken";
import environment from "../config/env";

const options: SignOptions = {
  expiresIn: environment.JWT_EXPIRES_IN as SignOptions["expiresIn"],
};
export const generateToken = (payload: object) => {
    return jwt.sign(payload, environment.JWT_SECRET, options);
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, environment.JWT_SECRET);
    } catch (error) {
        throw new Error("Invalid token");
    }
}
const refreshOptions: SignOptions = {
    expiresIn: environment.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]
};
export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, environment.JWT_SECRET, refreshOptions);
}