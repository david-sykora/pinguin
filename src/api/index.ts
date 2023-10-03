import express from 'express';
import {body, validationResult} from 'express-validator';
import {logger} from '../services/logger.js';
import {sendPingTask} from "../services/queue.js";

const api = express();
api.use(express.json());
const pingValidation = [
    body('domain')
        .exists()
        .withMessage('domain is required')
        .isString()
];
api.post('/ping', pingValidation, async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        logger.warn('invalid domain ping request received', {
            Data: req.body,
            Errors: validationErrors.array()
        });
        return res.json(validationErrors.array());
    }
    try {
        const pingResult = await sendPingTask(req.body.domain);
        return res.json({"result": pingResult});
    } catch (e) {
        logger.error({
            Data: req.body,
            err: e
        }, 'error ping domain');
        return res.status(500).json({error: e.message});
    }
});

// in case I want to remotely poweroff the server
api.post('/poweroff', async (req, res) => {
    logger.info(`poweroff request received`)
    try {
        process.exit(0)
        return res.json({"result": "OK"});
    } catch (e) {
        logger.error({
            Data: req.body,
            err: e
        }, 'error poweroff');
        return res.status(500).json({error: e.message});
    }
})

export function startApiServer() {
    logger.info('starting API server');
    api.listen(3000, () => {
        logger.info('API server listening on port 3000');
    });
}
