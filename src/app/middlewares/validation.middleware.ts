import { Request, RequestHandler } from "express";
import { ValidationError } from "joi";
import ApiError from "../errors/api.error";

const validateRequest = <T>(
  sourceProperty: keyof Request,
  schema: T
): RequestHandler => {
  return async (request: Request, _, next) => {
    try {
      await (schema as any).validateAsync(request[sourceProperty]);
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        next(new ApiError(error.details[0].message, { httpStatus: 400 }));
      } else {
        next(new ApiError("Validation error", { httpStatus: 400 }));
      }
    }
  };
};

export default validateRequest;
