import express from "express";
import apiExampleRouter from "./example.router";
import errorHandler from '../../middlewares/error.middleware';

const apiRouter = express.Router();

apiRouter.use("/examples", apiExampleRouter);

apiRouter.use(errorHandler);

export default apiRouter;
