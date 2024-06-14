import { NextFunction, Request, Response } from "express";
import prisma from "../helpers/pg.prisma";

export default class Controller {
  static get table(): string {
    throw new Error("Table name not defined");
  }

  static async getAll(_: Request, response: Response) {
      const rows = await (prisma as any)[this.table].findMany();
      return response.status(200).json(rows);
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
    body.userId = request.user.id;
    body.type = "Centralized";
    delete body.key;
    const row = await prisma.wallet.create({ data: body });
    return response.status(201).json(row);
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
    const userId = request.user.id;
    const walletId = parseInt(id, 10);
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
    });
    if (!wallet) {
      return response.status(404).json({ error: "Wallet not found" });
    }

    if (wallet.userId !== userId && request.user.role !== "admin") {
      return response.status(403).json({ error: "Forbidden" });
    }

    await prisma.wallet.delete({
      where: { id: walletId },
    });

    console.log("wallet deleted");
    return response.status(204).json();
  }
}
