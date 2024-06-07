import authenticateToken from "../../middlewares/authenticate.token";
import express from "express";
import errorHandler from "../../middlewares/error.middleware";
import apiUserRouter from "./users.router";
import apiWalletsRouter from "./wallet.router";

const apiRouter = express.Router();

apiRouter.use("/users", apiUserRouter);
apiRouter.use("/wallets", authenticateToken, apiWalletsRouter);

apiRouter.use(errorHandler);

export default apiRouter;
