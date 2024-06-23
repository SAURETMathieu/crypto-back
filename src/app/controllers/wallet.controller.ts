import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/api.error";
import prisma from "../helpers/pg.prisma";
import CoreController from "./core.controller";
import getWalletsWithBalancesAndTransactions from "../services/database/getWalletsWithBalancesAndTransactions";
import createDecentralizeWallet from "../services/moralis/createDecentralizeWallet";

export default class WalletController extends CoreController {
  static get table(): string {
    return "wallet";
  }

  static async userGetAll(request: Request, response: Response) {
    const { user } = request;
    const rows = await prisma.wallet.findMany({ where: { userId: user.id } });
    //TODO remplacer ceci par les vraies valeurs
    const promises = rows.map(async (row: any) => {
      row.day = 1;
      row.day7 = 1;
      row.month = 1;
      row.fees = 250.5;
      row.balance = 29999.99;
      row.profits = 1000.0;
      row.key = "key";
      return row;
    });
    const modifiedRows = await Promise.all(promises);
    //TODO remplacer ceci par les vraies valeurs
    //TODO récupérer les valeurs du wallet dans la bdd pour calculer les profits et les frais
    //TODO si decentraliser, prendre les données du dernier jour
    //TODO si centraliser, prendre les données de l'exchange (en temps reel)

    return response.status(200).json(modifiedRows);
  }

  static async create(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { body } = request;
    body.userId = request.user.id;
    let newWallet: any;

    const walletExist = await prisma.wallet.findFirst({
      where: {
        address: body.address,
        blockchain: body.blockchain,
        userId: body.userId,
      },
    });

    if (walletExist) {
      const errorApi = new ApiError("Wallet already exist", {
        httpStatus: 409,
      });
      return next(errorApi);
    }

    if (body.exchange) {
      body.type = "Centralized";
      delete body.key;
    } else {
      body.type = "Decentralized";
      newWallet = await createDecentralizeWallet(body);

      if (newWallet instanceof ApiError) {
        return next(newWallet);
      }
    }

    const walletWithBalancesAndTransactions = await getWalletsWithBalancesAndTransactions(request.user.id, newWallet.id);

    if (!walletWithBalancesAndTransactions) {
      const errorApi = new ApiError("Wallet created but fail to get infos", {
        httpStatus: 500,
      });
      return next(errorApi);
    }

    const formattedWallet = walletWithBalancesAndTransactions.map((wallet) => {

      const balance = wallet.balances
        .map((balance:any) => balance.nbToken * (balance.price ?? 0) || 0)
        .reduce((a:number, b:number) => a + b, 0);

      const modifiedWallet: any = {
        ...wallet,
        day: 1,
        day7: 1,
        month: 1,
        fees: 1,
        balance,
        profits: 1000.0,
        key: "key",
      };

      return modifiedWallet;
    });
    //TODO calculer les profits et les frais
    //TODO calculer les variations du jour, semaine et mois
    //TODO créer une fonction générale qui fetch tout les wallets toutes les 24h (attention aux rates limite)

    return response.status(201).json(formattedWallet);
  }

  static async update(request: Request, response: Response, next: NextFunction) {
    const { body } = request;
    const { id } = request.params;
    const walletId = parseInt(id, 10);
    const walletExist = await prisma.wallet.findUnique({
      where: { id: walletId },
    });

    if (!walletExist) {
      const errorApi = new ApiError("Wallet not found", {
        httpStatus: 404,
      });
      return next(errorApi);
    }

    if (walletExist.userId !== request.user.id) {
      const errorApi = new ApiError("Forbidden", {
        httpStatus: 403,
      });
      return next(errorApi);
    }

    delete body.key;

    const updatedWallet = await prisma.wallet.update({
      where: { id: walletId },
      data: body,
    });

    const modifiedRow: any = updatedWallet;
    modifiedRow.day = 1;
    modifiedRow.day7 = 1;
    modifiedRow.month = 1;
    modifiedRow.fees = 250.5;
    modifiedRow.balance = 29999.99;
    modifiedRow.profits = 1000.0;
    modifiedRow.key = "key";
    return response.status(200).json(modifiedRow);
  }

  static async getWalletWithTransactionsAndBalances(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { id } = request.params;
    const walletId = parseInt(id, 10);

    const walletWithBalances = await prisma.wallet.findUnique({
      where: { id: walletId },
      include: {
        balances: {
          include: {
            crypto: true,
          },
        },
      },
    });

    if (!walletWithBalances) {
      const errorApi = new ApiError("Wallet not found", {
        httpStatus: 404,
      });
      return next(errorApi);
    }

    if (walletWithBalances.userId !== request.user.id) {
      const errorApi = new ApiError("Forbidden", {
        httpStatus: 403,
      });
      return next(errorApi);
    }

    const formattedBalances = walletWithBalances?.balances.map((balance) => {
      const formattedBalance: any = {
        ...balance,
        cryptoId: balance.crypto.id,
        asset: balance.crypto.asset,
        name: balance.crypto.name,
        digit: balance.crypto.digit,
        logo_url: balance.crypto.logo_url,
        currency: balance.crypto.currency,
      };
      delete formattedBalance.crypto;

      return formattedBalance;
    });

    walletWithBalances.balances = formattedBalances;

    return response.status(200).json(walletWithBalances);
  }

  static async getAllWalletWithTransactionsAndBalances(
    request: Request,
    response: Response
  ) {
    const { user } = request;
    const wallets: any[] = await getWalletsWithBalancesAndTransactions(user.id);

    if (!wallets || wallets.length === 0) {
      return response.status(200).json([]);
    }

    const formattedWallets = wallets.map((wallet) => {

      const balance = wallet.balances
        .map((balance:any) => balance.nbToken * (balance.price ?? 0) || 0)
        .reduce((a:number, b:number) => a + b, 0);

      const modifiedWallet: any = {
        ...wallet,
        day: 1,
        day7: 1,
        month: 1,
        fees: 1,
        balance,
        profits: 1000.0,
        key: "key",
      };

      return modifiedWallet;
    });

    return response.status(200).json(formattedWallets);
  }
}
