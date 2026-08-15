import { Request, Response } from "express";
import { register,verifyEmail,login,refreshAccessToken } from "../services/auth.service";
import envirnoment from "../config/env";
export const registerUser = async (req: Request, res: Response) => {
    const result = await register(req.body);
    return res.status(201).json(result);
}

export const verifyEmailToken = async (req:Request,res:Response)=>{
    const result = await verifyEmail(req.query.token as string);
    return res.status(200).json(result);
}

export const loginUser = async (req: Request, res: Response) => {
    const result = await login(req.body);
    const { accessToken, refreshToken } = result;
    res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: envirnoment.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
    return res.status(200).json({ success: true, accessToken });
}

export const refreshAccess = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ success: false, message: "Refresh token not found" });
    }
    const result = await refreshAccessToken(refreshToken);
    return res.status(200).json({ success: true, accessToken: result.accessToken });
}