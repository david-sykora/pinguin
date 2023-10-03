import {Worker} from 'bullmq';
import {logger} from "./logger.js";
import {execCommand} from "./executor.js";
import {redisConnectionConfig} from "../config.js";

interface PingTaskData {
    domain: string
}

// starts the worker which picks tasks from the bullmq queue and executes them
export const startPingWorker = async () => {
    logger.info(`starting ping worker`)
    const worker = new Worker<PingTaskData>('ping', async job => {
        if (!job.data.domain) {
            const error = new Error(`Invalid job ${job.id} received from queue ${worker.name}. Domain is missing in job data.`)
            logger.error(error);
            throw error;
        }
        logger.info(`worker retrieved job ${job.id} from queue ${worker.name} with id ${job.id} and domain to ping ${job.data.domain}`);
        const result = await execCommand(`ping -c 1 ${job.data.domain}`)
        logger.info(`worker finished job ${job.id} from queue ${worker.name} with id ${job.id} and domain to ping ${job.data.domain} with result ${result}`);
        return result
    }, {
        connection: redisConnectionConfig
    });
    worker.on('failed', (job, err) => {
        logger.error(`worker failed job ${job.id} from queue ${worker.name} with id ${job.id} and domain to ping ${job.data.domain} with error ${err}`);
    })
    await worker.waitUntilReady();
    logger.info(`ping worker started and waiting for jobs`)
}
