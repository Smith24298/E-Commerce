import { Worker } from "bullmq";
import { redis } from "../config/redis";
import { registerTemplate,resetPasswordTemplate } from '../mail.templates/mail.template';
import { sendEmail } from '../utils/resend.service';

console.log("Starting email worker...");

const worker = new Worker(
  "email",
  async (job) => {
    const { email, name, token,isReset } = job.data;
    const html = isReset ? resetPasswordTemplate(name, email, token) : registerTemplate(name, email, token);

    await sendEmail(email, isReset ? "Reset Your Password" : "Verify Your Email", html);

    return { success: true };
  },
  {
    connection: redis,
  }
);

worker.on("ready", () => {
  console.log("✅ Worker connected to Redis");
});

worker.on("completed", (job) => {
  console.log("✅ Job completed:", job.id);
});

worker.on("failed", (job, error) => {
  console.error("❌ Job failed:", job?.id);
  console.error(error);
});

worker.on("error", (error) => {
  console.error("❌ Worker error:", error);
});

console.log("Email worker started");