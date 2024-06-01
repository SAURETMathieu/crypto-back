import express from "express";
import apiUserRouter from "./users.router";
import apiAuthRouter from "./auth.router";
import errorHandler from '../../middlewares/error.middleware';

const apiRouter = express.Router();

apiRouter.use("/users", apiUserRouter);
apiRouter.use("/auth", apiAuthRouter);

apiRouter.use(errorHandler);

export default apiRouter;
