import client from "../helpers/pg.client";

interface DataRecord {
  [key: string]: any;
}

export default class CoreDatamapper {
  static readTableName: string;

  static writeTableName: string;

  static async findAll(): Promise<DataRecord[]> {
    const result = await client.query(`SELECT * FROM "${this.readTableName}"`);
    return result.rows;
  }

  static async findByPk(id: number) {
    const result = await client.query(
      `SELECT * FROM "${this.readTableName}" WHERE "id" = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async insert(data: DataRecord): Promise<DataRecord[]> {
    const result = await client.query(
      `SELECT * FROM create_${this.writeTableName}($1)`,
      [data]
    );
    return result.rows[0];
  }

  static async update(data: DataRecord): Promise<DataRecord[]> {
    const result = await client.query(
      `SELECT * FROM update_${this.writeTableName}($1)`,
      [data]
    );
    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const result = await client.query(
      `DELETE FROM "${this.writeTableName}" WHERE "id" = $1`,
      [id]
    );
    return !!result.rowCount;
  }
}
