import pino from 'pino';

export const logger = pino({
    name: 'bradlo',
    level: 'debug',
    prettyPrint: {
        colorize: true
    }
});
