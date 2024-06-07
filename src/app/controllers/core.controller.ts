import { NextFunction, Request, Response } from "express";
import prisma from "../helpers/pg.prisma";

export default class Controller {
  static get table(): string {
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
    const { id } = request.params;
    const row = await (prisma as any)[this.table].findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!row) {
      return next();
    }
    return response.status(200).json(row);
  }

  static async create(request: Request, response: Response) {
    const { body } = request;
    body.userId = "clx0dzekq00018bidpe7al2t8";
    body.type = "Centralized";
    delete body.key;
    console.log(body);
    const row = await prisma.wallet.create({ data: body });
    response.status(201).json(row);
  }

  static async update(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { id } = request.params;
    const dbData = await (prisma as any)[this.table].findUnique({
      where: { id: parseInt(id, 10) },
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
  }

  static async delete(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { id } = request.params;
    const deleted = await (prisma as any)[this.table].delete({
      where: { id: parseInt(id, 10) },
    });
    if (!deleted) {
      return next();
    }
    return response.status(204).json();
  }
}
