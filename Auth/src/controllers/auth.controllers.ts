import { Request, Response } from "express";
import { register,verifyEmail } from "../services/auth.service";
export const registerUser = async (req: Request, res: Response) => {
    const result = await register(req.body);
    return res.status(201).json(result);
}

export const verifyEmailToken = async (req:Request,res:Response)=>{
    const result = await verifyEmail(req.query.token as string);
    return res.status(200).json(result);
}