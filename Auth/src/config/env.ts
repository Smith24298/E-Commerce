import "dotenv/config";

const environment = {
    PORT: process.env.PORT,
    JWT_SECRET: String(process.env.JWT_SECRET),
    JWT_EXPIRES_IN: String(process.env.JWT_EXPIRES_IN),
    REDIS_URL: String(process.env.REDIS_URL),
    RESEND_API_KEY: String(process.env.RESEND_API_KEY),
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
}

for (const [key,value] of Object.entries(environment)) {
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }
}

export default environment;