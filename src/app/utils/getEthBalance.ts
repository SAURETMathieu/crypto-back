import fetch from "node-fetch";

export async function getTokensBalance(walletAddress: string) {
  try {
    const apiKey =process.env.ETHPLORER_KEY;
    const apiUrl = `https://api.ethplorer.io/getAddressInfo/${walletAddress}?apiKey=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("Réponse de l'API Ethplorer :", data);

    if (data.error) {
      return (
        "Erreur lors de la récupération du solde du portefeuille :" +
        data.error.message
      );
    }

    const balances = data.tokens.map((token: any) => {
      const balance = token.balance / Math.pow(10, token.tokenInfo.decimals);
      console.log(token.tokenInfo);

      return {
        symbol: token.tokenInfo.symbol,
        balance: balance,
      };
    });

    console.log("balance",balances);


    return balances;
  } catch (error: any) {
    return (
      "Erreur lors de la récupération du solde du portefeuille :" +
      error.message
    );
  }
}
