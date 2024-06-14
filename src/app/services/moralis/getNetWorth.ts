import Moralis from "moralis";

//cost 500 per request => 80 per day max
export async function getNetWorth(walletAddress: string, blockchain: string) {
  try {
    if (!Moralis.Core.isStarted) {
      return null;
    }

    const response = await Moralis.EvmApi.wallets.getWalletNetWorth({
      chains: ["0x1"],
      excludeSpam: true,
      excludeUnverifiedContracts: true,
      address: walletAddress,
    });

    console.log(response.result);
    return true;
  } catch (e) {
    console.error(e);
    return null;
  }
}
