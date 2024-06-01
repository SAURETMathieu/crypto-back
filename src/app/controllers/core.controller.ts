import { NextFunction, Request, Response } from "express";
import { DataMapper } from "../types/datamapper";

export default class Controller {
  static datamapper: DataMapper;

  static async getAll(_: Request, response: Response) {
    const rows = await this.datamapper.findAll();
    response.status(200).json(rows);
  }

  static async getByPk(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { id } = request.params;
    const row = await this.datamapper.findByPk(Number(id));
    if (!row) {
      return next();
    }
    return response.status(200).json(row);
  }

  static async create(request: Request, response: Response) {
    const row = await this.datamapper.insert(request.body);
    response.status(201).json(row);
  }

  static async update(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { id } = request.params;
    const dbData = await this.datamapper.findByPk(Number(id));

    if (!dbData) {
      return next();
    }

    const data = { ...dbData, ...request.body };

    const row = await this.datamapper.update(data);
    if (!row) {
      return next();
    }
    return response.status(200).json(row);
  }

  static async delete(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { id } = request.params;
    const deleted = await this.datamapper.delete(Number(id));
    if (!deleted) {
      return next();
    }
    return response.status(204).json();
  }
}
