export interface DataMapper {
  findAll(): Promise<any[]>;
  findByPk(id: number): Promise<any | null>;
  insert(data: any): Promise<any>;
  update(data: any): Promise<any>;
  delete(id: number): Promise<boolean>;
}
