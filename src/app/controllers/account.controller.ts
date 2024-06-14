import CoreController from "./core.controller";

export default class AccountController extends CoreController {
  static get table(): string {
    return "account";
  }
}
