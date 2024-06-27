import ApiError from "../../errors/api.error";
import { createWalletWithBalancesAndTransactions } from "../../utils/initialize.wallet";
import { getAllTransactions } from "./getAllTransactions";
import { getTokensPrices } from "./getTokensPrices";
import { getWalletTokenBalancesWithPrice } from "./getWalletTokenBalancesWithPrice";
import {Decimal} from 'decimal.js';

export default async function createDecentralizeWallet(body: any) {
  try {
    let walletTokensBalances = await getWalletTokenBalancesWithPrice(
      body.address,
      body.blockchain
    );

    if (!walletTokensBalances) {
      const errorApi = new ApiError(
        "Error while fetching wallet token balances, try again later",
        {
          httpStatus: 500,
        }
      );
      return errorApi;
    }

    let transactions = await getAllTransactions(body.address, body.blockchain);

    if (!transactions) {
      const errorApi = new ApiError(
        "Error while fetching transactions, try again later",
        {
          httpStatus: 500,
        }
      );
      return errorApi;
    }

    const tokens = transactions.map((transaction: any) => ({
      tokenAddress: transaction.tokenAddress ?? null,
      toBlock: transaction.blockNumber ?? null,
    }));

    const nbTokens = tokens.length;
    const nbRequests = Math.ceil(nbTokens / 25);
    const promises = Array.from({ length: nbRequests }, (_, index) => {
      const start = index * 25;
      const end = start + 25;
      return getTokensPrices(tokens.slice(start, end), body.blockchain);
    });

    const results = await Promise.all(promises);

    const tokensPrices = results.flat();

    if (!tokensPrices) {
      const errorApi = new ApiError(
        "Error while fetching tokens prices, try again later",
        {
          httpStatus: 500,
        }
      );
      return errorApi;
    }

    transactions = transactions.map((transaction: any) => {
      const tokenPrice = tokensPrices?.find(
        (token: any) =>
          token?.tokenAddress?.toLowerCase() ===
            transaction.tokenAddress.toLowerCase() &&
          token?.toBlock === transaction.blockNumber
      );

      return {
        ...transaction,
        tokenPrice: tokenPrice?.usdPrice,
      };
    });

    walletTokensBalances = walletTokensBalances.map(
      (balance: any) => {
        let receive = new Decimal(0);
        let send = new Decimal(0);
        let totalInvested = new Decimal(0);
        let realizedProfit = new Decimal(0);

        transactions.forEach((transaction: any) => {
          if (transaction?.tokenSymbol === balance?.symbol) {
            const transactionValue = new Decimal(transaction?.value ?? 0);
            const tokenPrice = new Decimal(transaction?.tokenPrice ?? 0);
            if (transaction?.fromAddress?.toLowerCase() === body.address?.toLowerCase()) {
              send = send.plus(transactionValue);
              realizedProfit = realizedProfit.plus(transactionValue.times(tokenPrice));
            }
            if (transaction?.toAddress?.toLowerCase() === body.address?.toLowerCase()) {
              totalInvested = totalInvested.plus(transactionValue.times(tokenPrice));
              receive = receive.plus(transactionValue);
            }
          }
        });

        const balanceUsdPrice = balance?.usdPrice ? new Decimal(balance?.usdPrice) : null;
        const unrealizedProfit = balanceUsdPrice ? balanceUsdPrice
          .times(balance?.balance)
          .minus(totalInvested) : null;

        return {
          ...balance,
          realizedProfit: parseFloat(realizedProfit.toFixed(3)),
          unrealizedProfit: unrealizedProfit? parseFloat(unrealizedProfit.toFixed(3)) : null,
        };
      }
    );

    const newWallet = await createWalletWithBalancesAndTransactions(
      body,
      walletTokensBalances,
      transactions
    );
    return newWallet;
  } catch (e) {
    console.error(e);
    const errorApi = new ApiError(
      "Error while creating wallet, try again later",
      {
        httpStatus: 500,
      }
    );
    return errorApi;
  }
}
