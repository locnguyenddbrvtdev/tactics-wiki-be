import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

const { combine, timestamp, label, printf, colorize } = winston.format;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const myFormat = printf(({ level, message, label, timestamp, stack }) => {
  // Kiểm tra nếu có lỗi, thì in ra stack trace
  return stack
    ? `${timestamp} [${label}] ${level}: ${message} - ${stack}`
    : `${timestamp} [${label}] ${level}: ${message}`;
});

const winstonOption: WinstonModuleOptions = {
  level: process.env.NODE_ENV === 'development' ? 'silly' : 'verbose',
  format: combine(
    colorize({ all: true }),
    label({ label: 'System' }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    myFormat,
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
};

export default winstonOption;
