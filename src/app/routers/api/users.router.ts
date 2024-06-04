import express from "express";
import UserController from "../../controllers/user.controller";
import controllerWrapper from "../../helpers/controller.wrapper";
import validationMiddleware from "../../middlewares/validation.middleware";
import exampleCreateSchema from "../../schemas/example.create.schema";
import exampleUpdateSchema from "../../schemas/example.update.schema";

const userRouter = express.Router();

userRouter
  .route("/")
  /**
   * GET /api/examples
   * @summary Get all examples
   * @tags Users
   * @return {User[]} 200 - success response - application/json
   * @return {ApiJsonError} 400 - Bad request response - application/json
   * @return {ApiJsonError} 500 - Internal Server Error - application/json
   */
  .get(controllerWrapper(UserController.getAll.bind(UserController)))
  /**
   * POST /api/examples
   * @summary Create a new User
   * @tags Users
   * @param {UserInput} request.body.required - User info
   * @return {User} 201 - success response - application/json
   * @return {ApiJsonError} 400 - Bad request response - application/json
   * @return {ApiJsonError} 500 - Internal Server Error - application/json
   */
  .post(
    validationMiddleware("body", exampleCreateSchema),
    controllerWrapper(UserController.create.bind(UserController))
  );

userRouter
  .route("/:id")
  /**
   * GET /api/examples/{id}
   * @summary Get a User from its id
   * @tags Users
   * @param {number} id.path.required - User id
   * @return {User} 200 - success response - application/json
   * @return {ApiJsonError} 400 - Bad request response - application/json
   * @return {ApiJsonError} 404 - Not found response - application/json
   * @return {ApiJsonError} 500 - Internal Server Error - application/json
   */
  .get(controllerWrapper(UserController.getByPk.bind(UserController)))
  /**
   * PATCH /api/examples/{id}
   * @summary Update a User
   * @tags Users
   * @param {number} id.path.required - User id
   * @param {UserInput} request.body.required - User info
   * @return {User} 200 - success response - application/json
   * @return {ApiJsonError} 400 - Bad request response - application/json
   * @return {ApiJsonError} 404 - Not found response - application/json
   * @return {ApiJsonError} 500 - Internal Server Error - application/json
   */
  .patch(
    validationMiddleware("body", exampleUpdateSchema),
    controllerWrapper(UserController.update.bind(UserController))
  )
  /**
   * DELETE /api/examples/{id}
   * @summary Delete a User
   * @tags Users
   * @param {number} id.path.required - User id
   * @return {User} 200 - success response - application/json
   * @return {ApiJsonError} 400 - Bad request response - application/json
   * @return {ApiJsonError} 404 - Not found response - application/json
   * @return {ApiJsonError} 500 - Internal Server Error - application/json
   */
  .delete(controllerWrapper(UserController.delete.bind(UserController)));

export default userRouter;
