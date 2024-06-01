import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/api.error";

type Controller = (
  request: Request,
  response: Response,
  next: NextFunction
) => Promise<any>;

export default (controller: Controller) =>
  async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await controller(request, response, next);
    } catch (err: any) {
      next(new ApiError(err.message, { httpStatus: 500 }));
    }
  };
