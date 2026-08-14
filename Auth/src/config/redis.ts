import environment from "./env";
import IORedis from 'ioredis';

const redisUrl = environment.REDIS_URL;
export const redis  = new IORedis(
    redisUrl,
    {
        maxRetriesPerRequest:null,
    }
);