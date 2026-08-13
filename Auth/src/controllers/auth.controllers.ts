import { prisma } from "../config/prisma";
import { Request, Response } from "express";
import { register } from "../services/auth.service";
export const registerUser = async (req: Request, res: Response) => {
    const result = await register(req.body);
    return res.status(201).json(result);
}