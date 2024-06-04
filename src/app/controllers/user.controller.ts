import prisma from "../helpers/pg.prisma";
import CoreController from "./core.controller";
import { Request, Response, NextFunction } from "express";

export default class UserController extends CoreController {
  static get table(): string {
    return "user";
  }

  static async getByPk(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { id } = request.params;
      const row = await prisma.user.findUnique({ where: { id } });
      if (!row) {
        return next();
      }
      return response.status(200).json(row);
    } catch (error) {
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async update(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { id } = request.params;
      const dbData = await prisma.user.findUnique({
        where: { id },
      });

      if (!dbData) {
        return next();
      }

      const data = { ...dbData, ...request.body };
      const row = await prisma.user.update({
        where: { id },
        data,
      });
      return response.status(200).json(row);
    } catch (error) {
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async delete(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { id } = request.params;
      const deleted = await prisma.user.delete({ where: { id } });
      if (!deleted) {
        return next();
      }
      return response.status(204).json();
    } catch (error) {
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
}
