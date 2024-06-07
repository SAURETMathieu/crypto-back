import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/api.error";
import handlePrismaError from "../errors/prisma.error";

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
      const error = handlePrismaError(err);
      next(new ApiError(error, { httpStatus: 500 }));
    }
  };
