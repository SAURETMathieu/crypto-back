import ApiError from "../../errors/api.error";
import { createWalletWithBalancesAndTransactions } from "../../utils/initialize.wallet";
import { getAllTransactions } from "./getAllTransactions";
import { getTokensPrices } from "./getTokensPrices";
import { getWalletTokenBalancesWithPrice } from "./getWalletTokenBalancesWithPrice";

export default async function createDecentralizeWallet(body: any) {
  try {
    const walletTokensBalances = await getWalletTokenBalancesWithPrice(
      body.address,
      body.blockchain
    );
    let transactions = await getAllTransactions(body.address, body.blockchain);

    if (!walletTokensBalances || !transactions) {
      const errorApi = new ApiError(
        "Error while fetching data, try again later",
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
