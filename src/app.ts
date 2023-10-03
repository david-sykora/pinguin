import dotenv from 'dotenv';
import {startApiServer} from './api/index.js';
import {config} from "./config.js";
import {createPingQueue} from "./services/queue.js";
import {startPingWorker} from "./services/worker.js";
import {logger} from "./services/logger.js";

(async () => {
    dotenv.config();
    logger.info(`starting pinguin with application role ${config.applicationRole}`)
    switch (config.applicationRole) {
        case "queue":
            await createPingQueue();
            startApiServer()
            break;
        case "worker":
            await startPingWorker();
            break;
    }
})();
