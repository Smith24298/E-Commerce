import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 5 login requests per `window` (here, per 15 minutes)
    standardHeaders: "draft-8",
    legacyHeaders: false, 
    message: {
        success: false,
        message:"Too many login attempts from this IP, please try again after 15 minutes"
    },
});

export const registerRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 10, // Limit each IP to 10 register requests per `window` (here, per 1 hour)
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message:"Too many registration attempts from this IP, please try again after 1 hour"
    },
});

export const forgotPasswordRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 5, // Limit each IP to 5 forgot password requests per `window` (here, per 1 hour)
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message:"Too many forgot password attempts from this IP, please try again after 1 hour"
    },
});

export const resetPasswordRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 5, // Limit each IP to 5 reset password requests per `window` (here, per 1 hour)
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message:"Too many reset password attempts from this IP, please try again after 1 hour"
    },
});

export const apiRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 1 minute)
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message:"Too many requests from this IP, please try again after 1 minute"
    },
});