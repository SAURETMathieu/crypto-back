import cors, { CorsOptions } from "cors";
import { NextFunction, Request, Response } from "express";

// Middleware CORS
const corsOptions: CorsOptions = {
  origin: [
    process.env.PROD_FRONT_URL as string,
    process.env.DEV_FRONT_URL as string,
  ],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Disposition"],
};

const corsMiddleware = cors(corsOptions);

export default function (req: Request, res: Response, next: NextFunction) {
  corsMiddleware(req, res, next);
}
