import { Worker } from "bullmq";
import { redis } from "../config/redis";

console.log("Starting email worker...");
//TODO : update the WOrker to send email using nodemailer and handle errors and retries
const worker = new Worker(
  "email",
  async (job) => {
    console.log("🔥 JOB RECEIVED");
    console.log("Job ID:", job.id);
    console.log("Job Name:", job.name);
    console.log("Job Data:", job.data);

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