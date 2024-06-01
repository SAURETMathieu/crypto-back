import express from "express";
import exampleController from "../../controllers/example.controller";
import controllerWrapper from "../../helpers/controller.wrapper";
import validationMiddleware from "../../middlewares/validation.middleware";
import exampleCreateSchema from "../../schemas/example.create.schema";
import exampleUpdateSchema from "../../schemas/example.update.schema";

const exampleRouter = express.Router();

exampleRouter
  .route("/")
  /**
   * GET /api/examples
   * @summary Get all examples
   * @tags Examples
   * @return {Example[]} 200 - success response - application/json
   * @return {ApiJsonError} 400 - Bad request response - application/json
   * @return {ApiJsonError} 500 - Internal Server Error - application/json
   */
  .get(controllerWrapper(exampleController.getAll.bind(exampleController)))
  /**
   * POST /api/examples
   * @summary Create a new example
   * @tags Examples
   * @param {ExampleInput} request.body.required - example info
   * @return {Example} 201 - success response - application/json
   * @return {ApiJsonError} 400 - Bad request response - application/json
   * @return {ApiJsonError} 500 - Internal Server Error - application/json
   */
  .post(
    validationMiddleware("body", exampleCreateSchema),
    controllerWrapper(exampleController.create.bind(exampleController))
  );

exampleRouter
  .route("/:id(\\d+)")
  /**
   * GET /api/examples/{id}
   * @summary Get a example from its id
   * @tags Examples
   * @param {number} id.path.required - example id
   * @return {Example} 200 - success response - application/json
   * @return {ApiJsonError} 400 - Bad request response - application/json
   * @return {ApiJsonError} 404 - Not found response - application/json
   * @return {ApiJsonError} 500 - Internal Server Error - application/json
   */
  .get(controllerWrapper(exampleController.getByPk.bind(exampleController)))
  /**
   * PATCH /api/examples/{id}
   * @summary Update a example
   * @tags Examples
   * @param {number} id.path.required - example id
   * @param {ExampleInput} request.body.required - example info
   * @return {Example} 200 - success response - application/json
   * @return {ApiJsonError} 400 - Bad request response - application/json
   * @return {ApiJsonError} 404 - Not found response - application/json
   * @return {ApiJsonError} 500 - Internal Server Error - application/json
   */
  .patch(
    validationMiddleware("body", exampleUpdateSchema),
    controllerWrapper(exampleController.update.bind(exampleController))
  )
  /**
   * DELETE /api/examples/{id}
   * @summary Delete a example
   * @tags Examples
   * @param {number} id.path.required - example id
   * @return {Example} 200 - success response - application/json
   * @return {ApiJsonError} 400 - Bad request response - application/json
   * @return {ApiJsonError} 404 - Not found response - application/json
   * @return {ApiJsonError} 500 - Internal Server Error - application/json
   */
  .delete(controllerWrapper(exampleController.delete.bind(exampleController)));

export default exampleRouter;
