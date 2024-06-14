import fetch from "node-fetch";

//cost 150 per request => 266 per day max

export async function getTokensBalance(walletAddress: string) {
  try {
    const apiKey = process.env.ETHERSCAN_KEY;
    const apiUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("Réponse de l'API Etherscan :", data);

    if (data.status !== "1") {
      return false
    }
    return parseInt(data.result) / 1e18;
  } catch (error: any) {
    return false
  }
}
