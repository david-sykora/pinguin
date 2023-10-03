import {redisConnectionConfig} from "../config.js";
import {Job, Queue, QueueEvents} from "bullmq";
import {logger} from "./logger.js";

let queue: Queue
let queueEvents: QueueEvents
export const createPingQueue = async () => {
    logger.info(`starting ping queue`)
    queue = new Queue('ping', {
        connection: redisConnectionConfig
    })
    logger.info(redisConnectionConfig)
    queueEvents = new QueueEvents('ping', {
        connection: redisConnectionConfig
    })

    await queue.waitUntilReady()
    await queueEvents.waitUntilReady()
    logger.info(`ping queue started`)
}
export const sendPingTask = async (domain: string) => {
    logger.info(`adding ping task to queue to ping domain ${domain}`)
    const job = await queue.add('ping', {domain})
    logger.info(`ping task added to queue to ping domain ${domain}`)
    await job.waitUntilFinished(queueEvents)
    const returnedJob = await Job.fromId(queue, job.id)
    return returnedJob.returnvalue
}
