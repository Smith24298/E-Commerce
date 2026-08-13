import jwt from "jsonwebtoken";

const payload = {
    id: "user_id",
    email: "user_email",
    role: "user_role"
}

export const generateToken = (payload: object, expiresIn: string | number) => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn:"15m" });
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
        throw new Error("Invalid token");
    }
}