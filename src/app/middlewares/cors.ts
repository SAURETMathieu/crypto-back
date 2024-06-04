import cors, { CorsOptions } from "cors";

// Middleware CORS
const corsOptions: CorsOptions = {
  origin: [
    process.env.PROD_FRONT_URL as string,
    process.env.DEV_FRONT_URL as string,
  ],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Disposition"],
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
