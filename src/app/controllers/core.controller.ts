import { NextFunction, Request, Response } from "express";
import prisma from "@/helpers/pg.prisma";

export default class Controller {

  static get table():string {
    throw new Error("Table name not defined");
  }

  static async getAll(_: Request, response: Response) {
    try {
      const rows = await (prisma as any)[this.table].findMany();
      response.status(200).json(rows);
    } catch (error) {
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getByPk(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { id } = request.params;
      const row = await (prisma as any)[this.table].findUnique({ where: { id } });
      if (!row) {
        return next();
      }
      return response.status(200).json(row);
    } catch (error) {
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async create(request: Request, response: Response) {
    try {
      const row = await (prisma as any)[this.table].create({ data: request.body });
      response.status(201).json(row);
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
      const dbData = await (prisma as any)[this.table].findUnique({
        where: { id },
      });

      if (!dbData) {
        return next();
      }

      const data = { ...dbData, ...request.body };
      const row = await (prisma as any)[this.table].update({
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
      const deleted = await (prisma as any)[this.table].delete({ where: { id } });
      if (!deleted) {
        return next();
      }
      return response.status(204).json();
    } catch (error) {
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
}
