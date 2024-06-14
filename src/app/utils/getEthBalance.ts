import fetch from "node-fetch";

//Requests per second: 10
//Max number of transactions/operations in response: 1000
//Max allowed timestamp age: 1 year

export async function getTokensBalance(
  walletAddress: string,
  blockchain: string
) {
  try {
    const apiKey =
      process.env.NODE_ENV !== "dev" ? process.env.ETHPLORER_KEY : "freekey";
    const apiUrl =
      blockchain === "BSC"
        ? `https://api.binplorer.com/getAddressInfo/${walletAddress}?apiKey=${apiKey}`
        : `https://api.ethplorer.io/getAddressInfo/${walletAddress}?apiKey=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      return (
        "Erreur lors de la récupération du solde du portefeuille :" +
        data.error.message
      );
    }

    const dataToKeep = {
      tokens: data.tokens.map((token:any) => {
        if (token.tokenInfo.price) {
          return {
            address: token.tokenInfo.address,
            name: token.tokenInfo.name,
            symbol: token.tokenInfo.symbol,
            decimals: token.tokenInfo.decimals,
            image: token.tokenInfo.image,
            price: token.tokenInfo.price.rate,
            diff: token.tokenInfo.price.diff,
            diff7: token.tokenInfo.price.diff7d,
            diff30: token.tokenInfo.price.diff30d,
            balance: parseFloat(token.balance) / 10 ** token.tokenInfo.decimals,
          };
        }
        return null;
      }).filter((token:any) => token !== null),
    };

    return dataToKeep;
  } catch (error: any) {
    return (
      "Erreur lors de la récupération du solde du portefeuille :" +
      error.message
    );
  }
}
