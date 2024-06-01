import { NextFunction, Request, Response } from "express";
import logger from "../logger/index.logger";

interface LogInfo {
  httpStatus: number;
  level: string;
  message: string;
  timestamp: string;
}

export default function httpLogger(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  response.on("finish", () => {
    const clientIP = request.ip;

    const actualStatus = response.statusCode;

    const logInfo: LogInfo = {
      httpStatus: actualStatus,
      level: "http",
      message: `${clientIP} ${request.method} ${request.originalUrl}`,
      timestamp: new Date().toISOString(),
    };

    logger.http(logInfo);
  });

  next();
}
