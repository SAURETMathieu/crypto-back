import express from "express";
import apiUserRouter from "./users.router";
import apiAuthRouter from "./auth.router";
import apiWalletsRouter from "./wallet.router";
import errorHandler from '../../middlewares/error.middleware';

const apiRouter = express.Router();

apiRouter.use("/users", apiUserRouter);
apiRouter.use("/wallets", apiWalletsRouter);

apiRouter.use(errorHandler);

export default apiRouter;
