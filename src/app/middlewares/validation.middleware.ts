
import { Request, RequestHandler } from "express";
import { ZodError } from "zod";
import ApiError from "../errors/api.error";

const validationMiddleware = <T>(
  sourceProperty: keyof Request,
  schema: any
): RequestHandler => {
  return async (request: Request, _, next) => {
    try {
      await schema.parseAsync(request[sourceProperty]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors[0]?.message || "Validation error";
        next(new ApiError(errorMessage, { httpStatus: 400 }));
      } else {
        next(new ApiError("Validation error", { httpStatus: 400 }));
      }
    }
  };
};

export default validationMiddleware;
