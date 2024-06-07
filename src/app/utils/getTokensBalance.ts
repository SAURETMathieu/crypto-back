import fetch from "node-fetch";

export async function getTokensBalance(walletAddress: string) {
  try {
    const apiKey = process.env.ETHERSCAN_KEY;
    const apiUrl = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${walletAddress}&tag=latest&apikey=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("Réponse de l'API Etherscan :", data);

    if (data.status !== "1") {
      return (
        "Erreur lors de la récupération du solde du portefeuille :" +
        data.message
      );
    }
    return parseInt(data.result) / 1e18;
  } catch (error: any) {
    return (
      "Erreur lors de la récupération du solde du portefeuille :" +
      error.message
    );
  }
}
