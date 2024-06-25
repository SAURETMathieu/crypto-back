import ApiError from "../../errors/api.error";
import { createWalletWithBalancesAndTransactions } from "../../utils/initialize.wallet";
import { getAllTransactions } from "./getTransactions";
import { getWalletTokenBalancesWithMobula } from "./getWalletTokenBalancesWithMobula";

export default async function createDecentralizeWallet(body: any) {
  try {
    const walletTokensBalances = await getWalletTokenBalancesWithMobula(
      body.address,
      body.blockchain
    );

    if (!walletTokensBalances || walletTokensBalances.error) {
      const errorApi = new ApiError(
        walletTokensBalances.error,
        {
          httpStatus: 500,
        }
      );
      return errorApi;
    }

    const transactions = await getAllTransactions(body.address, body.blockchain);

    if (!transactions) {
      const errorApi = new ApiError(
        "Error while fetching data, try again later",
        {
          httpStatus: 500,
        }
      );
      return errorApi;
    }

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
