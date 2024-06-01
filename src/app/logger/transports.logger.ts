import * as winston from "winston";
import "winston-daily-rotate-file";

const {
  combine,
  timestamp: now,
  label: category,
  printf,
  json,
  colorize,
} = winston.format;

const consoleFormat = printf(
  (info: winston.LogEntry) =>
    `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
);

const combinedFormat = combine(now(), json());
const errorFormat = combine(now(), json());

// logs mode production
export const transportCombinedFile = winston.createLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "./logs/combined.log",
      level: "http",
      datePattern: "YYYY-MM-DD-HH-mm",
      handleExceptions: true,
      frequency: "1h",
      maxFiles: "3d",
      format: combinedFormat,
    }),
  ],
  exitOnError: false,
});

// logs errors mode production
export const transportErrorFile = winston.createLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      level: "error",
      filename: "./logs/error.log",
      datePattern: "YYYY-MM-DD-HH-mm",
      zippedArchive: true,
      frequency: "1h",
      maxFiles: "3d",
      format: errorFormat,
    }),
  ],
  exitOnError: false,
});

// logs mode dev
export const transportCombinedConsole = new winston.transports.Console({
  level: "http",
  format: combine(category({ label: "all" }), now(), colorize(), consoleFormat),
});
