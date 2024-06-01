import express from "express";
import corsMiddleware from "./middlewares/cors";
import errorMiddleware from "./middlewares/error.middleware";
import httpLogger from "./middlewares/httpLogger";
import router from "./routers/index.router";

const app = express();

app.use(corsMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(httpLogger);

app.use(router);

app.use(errorMiddleware);

export default app;
