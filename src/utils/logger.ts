import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';

const logDirectory = path.resolve(process.cwd(), 'logs');
fs.mkdirSync(logDirectory, { recursive: true });

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }) =>
      `${timestamp} [${level.toUpperCase()}] ${stack || message}`
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(logDirectory, 'test-execution.log') }),
  ],
});

export default logger;
