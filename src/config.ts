import dotenv from "dotenv";
import {ConnectionOptions} from "bullmq";

export interface PinguinConfig {
    redis: {
        host: string
        port: number
    }
    applicationRole: "worker" | "queue"
}

// use dotenv to load .env variables to config (mainly for development)
dotenv.config()

export const config: PinguinConfig = {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379
    },
    applicationRole: process.env.APPLICATION_ROLE as "worker" | "queue"
}

export const redisConnectionConfig: ConnectionOptions = {
    host: config.redis.host,
    port: config.redis.port,
    password: process.env.REDIS_PASSWORD
}
