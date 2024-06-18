import { Request, Response } from "express";
import prisma from "../helpers/pg.prisma";
import { getAllTransactions } from "../services/moralis/getAllTransactions";
import { getTokensPrices } from "../services/moralis/getTokensPrices";
import { getWalletTokenBalancesWithPrice } from "../services/moralis/getWalletTokenBalancesWithPrice";
import { createWalletWithBalancesAndTransactions } from "../utils/initialize.wallet";
import CoreController from "./core.controller";

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

  static async create(request: Request, response: Response) {
    const { body } = request;
    body.userId = request.user.id;

    let transactions = null;
    let walletTokensBalances = null;

    if (body.exchange) {
      body.type = "Centralized";
      delete body.key;
    } else {
      body.type = "Decentralized";
      walletTokensBalances = await getWalletTokenBalancesWithPrice(
        body.address,
        body.blockchain
      );
      transactions = await getAllTransactions(body.address, body.blockchain);
      const tokens = transactions.map((transaction: any) => ({
        tokenAddress: transaction.tokenAddress,
        toBlock: transaction.blockNumber,
      }));

      const tokensCopies = tokens.concat(tokens);
      const tokensPrices = await getTokensPrices(tokensCopies, body.blockchain);

      console.log(tokensPrices);

      transactions = transactions.map((transaction: any) => {
        const tokenPrice = tokensPrices?.find(
          (token: any) =>
            token.tokenAddress.toLowerCase() ===
              transaction.tokenAddress.toLowerCase() &&
            token.toBlock === transaction.blockNumber
        );

        return {
          ...transaction,
          tokenPrice: tokenPrice?.usdPrice,
        };
      });
    }

    const { newWallet, newTransactions, newBalances } =
      await createWalletWithBalancesAndTransactions(
        body,
        walletTokensBalances,
        transactions
      );

    //TODO calculer les profits et les frais
    //TODO calculer les variations du jour, semaine et mois
    //TODO créer une fonction générale qui fetch tout les wallets toutes les 24h (attention aux rates limite)
    //TODO pour générer des courbes de balance, profits et frais et cryptos d'un wallet
    //TODO retourner les données du wallet
    const modifiedRow: any = newWallet;
    modifiedRow.day = 1;
    modifiedRow.day7 = 1;
    modifiedRow.month = 1;
    modifiedRow.fees = 250.5;
    modifiedRow.balance = 29999.99;
    modifiedRow.profits = 1000.0;
    modifiedRow.key = "key";
    return response.status(201).json(modifiedRow);
  }

  static async update(request: Request, response: Response) {
    const { body } = request;
    const { id } = request.params;
    const walletId = parseInt(id, 10);
    const walletExist = await prisma.wallet.findUnique({
      where: { id: walletId },
    });

    if (!walletExist) {
      return response.status(404).json({ error: "Wallet not found" });
    }

    if (walletExist.userId !== request.user.id) {
      return response.status(403).json({ error: "Forbidden" });
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
    response: Response
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
      return response.status(404).json({ error: 'Wallet not found' });
    }

    if (walletWithBalances.userId !== request.user.id) {
      return response.status(403).json({ error: "Forbidden" });
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
}
