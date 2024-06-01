import ExempleDatamapper from "../datamappers/example.datamapper";
import CoreController from "./core.controller";

export default class ExempleController extends CoreController {
  static datamapper = ExempleDatamapper;
}
