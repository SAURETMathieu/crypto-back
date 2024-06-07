import express from "express";
import WalletController from "../../controllers/wallet.controller";
import controllerWrapper from "../../helpers/controller.wrapper";
import validationMiddleware from "../../middlewares/validation.middleware";
import { centralizedWalletCreateSchema, decentralizedWalletCreateSchema } from "../../schemas/wallet.create.schema";

const walletRouter = express.Router();

walletRouter
  .route("/")
  /**
   * GET /api/wallets
   * @summary Get all wallets
   * @tags Wallets
   * @return {Wallet[]} 200 - success response - application/json
   * @return {ApiJsonError} 400 - Bad request response - application/json
   * @return {ApiJsonError} 500 - Internal Server Error - application/json
   */
  .get(
    controllerWrapper(WalletController.userGetAll.bind(WalletController)))


walletRouter
  .route("/centralized")
  /**
   * POST /api/wallets/centralized
   * @summary Create a new Centralized Wallet
   * @tags Wallets
   * @param {WalletInput} request.body.required - Wallet info
   * @return {Wallet} 201 - success response - application/json
   * @return {ApiJsonError} 400 - Bad request response - application/json
   * @return {ApiJsonError} 500 - Internal Server Error - application/json
   */
  .post(
    validationMiddleware("body", centralizedWalletCreateSchema),
    controllerWrapper(WalletController.createWallet.bind(WalletController))
  );

  walletRouter
  .route("/decentralized")
  /**
   * POST /api/wallets/centralized
   * @summary Create a new Decentralized Wallet
   * @tags Wallets
   * @param {WalletInput} request.body.required - Wallet info
   * @return {Wallet} 201 - success response - application/json
   * @return {ApiJsonError} 400 - Bad request response - application/json
   * @return {ApiJsonError} 500 - Internal Server Error - application/json
   */
  .post(
    validationMiddleware("body", decentralizedWalletCreateSchema),
    controllerWrapper(WalletController.createWallet.bind(WalletController))
  );

walletRouter
  .route("/:id")
  /**
   * GET /api/wallets/{id}
   * @summary Get a Wallet from its id
   * @tags Wallets
   * @param {number} id.path.required - Wallet id
   * @return {Wallet} 200 - success response - application/json
   * @return {ApiJsonError} 400 - Bad request response - application/json
   * @return {ApiJsonError} 404 - Not found response - application/json
   * @return {ApiJsonError} 500 - Internal Server Error - application/json
   */
  .get(controllerWrapper(WalletController.getByPk.bind(WalletController)))
  /**
   * PATCH /api/wallets/{id}
   * @summary Update a Wallet
   * @tags Wallets
   * @param {number} id.path.required - Wallet id
   * @param {WalletInput} request.body.required - Wallet info
   * @return {Wallet} 200 - success response - application/json
   * @return {ApiJsonError} 400 - Bad request response - application/json
   * @return {ApiJsonError} 404 - Not found response - application/json
   * @return {ApiJsonError} 500 - Internal Server Error - application/json
   */
  .patch(
    //validationMiddleware("body", walletUpdateSchema),
    controllerWrapper(WalletController.update.bind(WalletController))
  )
  /**
   * DELETE /api/wallets/{id}
   * @summary Delete a Wallet
   * @tags Wallets
   * @param {number} id.path.required - Wallet id
   * @return {Wallet} 200 - success response - application/json
   * @return {ApiJsonError} 400 - Bad request response - application/json
   * @return {ApiJsonError} 404 - Not found response - application/json
   * @return {ApiJsonError} 500 - Internal Server Error - application/json
   */
  .delete(controllerWrapper(WalletController.delete.bind(WalletController)));

export default walletRouter;
