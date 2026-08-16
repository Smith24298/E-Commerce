import Router from 'express';
import { loginRateLimiter, registerRateLimiter, forgotPasswordRateLimiter, resetPasswordRateLimiter,apiRateLimiter } from '../middlewares/rateLimitter';
import {validate,validateQuery,validateCookie} from '../middlewares/validate';
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, verifyEmailSchema, refreshTokenSchema} from '../validation/auth.schema';
import { emailQueue } from '../config/emailQueue';
import { registerUser,verifyEmailToken,loginUser, refreshAccess, forgetPassword, logoutUser, resetPassword,getMe } from '../controllers/auth.controllers';
import { authenticateUser } from '../middlewares/authenticateUser';

const router = Router();

router.post('/register', registerRateLimiter, validate(registerSchema), registerUser);
router.post('/login', loginRateLimiter, validate(loginSchema), loginUser);
router.post('/logout', apiRateLimiter, logoutUser);
router.post('/refresh', apiRateLimiter, validateCookie(refreshTokenSchema), refreshAccess);
router.post('/forgot-password', forgotPasswordRateLimiter, validate(forgotPasswordSchema), forgetPassword);
router.post('/reset-password', resetPasswordRateLimiter, validate(resetPasswordSchema), resetPassword);
router.get('/verify-email', apiRateLimiter, validateQuery(verifyEmailSchema), verifyEmailToken);
router.get('/me', apiRateLimiter, authenticateUser, getMe);
export default router;