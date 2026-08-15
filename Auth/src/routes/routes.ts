import Router from 'express';
import { loginRateLimiter, registerRateLimiter, forgotPasswordRateLimiter, resetPasswordRateLimiter,apiRateLimiter } from '../middlewares/rateLimitter';
import {validate,validateQuery} from '../middlewares/validate';
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, verifyEmailSchema, refreshTokenSchema} from '../validation/auth.schema';
import { emailQueue } from '../config/emailQueue';
import { registerUser,verifyEmailToken,loginUser   } from '../controllers/auth.controllers';

const router = Router();

router.post('/register', registerRateLimiter, validate(registerSchema), registerUser);
router.post('/login', loginRateLimiter, validate(loginSchema), loginUser);
router.post('/logout', apiRateLimiter);
router.post('/refresh', apiRateLimiter, validate(refreshTokenSchema));
router.post('/forgot-password', forgotPasswordRateLimiter, validate(forgotPasswordSchema));
router.post('/reset-password', resetPasswordRateLimiter, validate(resetPasswordSchema));
router.get('/verify-email', apiRateLimiter, validateQuery(verifyEmailSchema), verifyEmailToken);
router.get('/me', apiRateLimiter);
router.get("/test-job", async (req, res) => {
    console.log("Adding job to email queue...");
  const job = await emailQueue.add("verify-email", {
    email: "smithfaldu11082006@gmail.com",
    token: "abc123",
    name: "Test User",
  }, {
    attempts: 3, // Number of retry attempts
  });
  console.log("Job added to email queue:", job.id);
  return res.json({
    message: "Job added",
    jobId: job.id,
  });
});

export default router;