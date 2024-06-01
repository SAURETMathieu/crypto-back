type Example = {
  id: number;
  name: string;
  number: number;
  created_at: string;
  updated_at: string;
};

type ExampleInput = {
  name: string;
  number: number;
};

import CoreDatamapper from "./core.datamapper.js";

export default class ExampleDatamapper extends CoreDatamapper {
  static readTableName = "example";

  static writeTableName = "example";
}
