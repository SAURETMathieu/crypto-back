import CoreController from "./core.controller";

export default class UserController extends CoreController {
  static get table(): string {
    return "user";
  }
}
