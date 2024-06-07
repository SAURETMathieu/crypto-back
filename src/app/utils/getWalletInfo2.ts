import Web3 from "web3";

const web3 = new Web3(
  `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`
);

export async function getWalletBalance(walletAddress: string) {
  try {
    const balance = await web3.eth.getBalance(walletAddress);
    console.log(balance);
    const balanceInEth = web3.utils.fromWei(balance, "ether");
    console.log(balanceInEth);
    return balance;
  } catch (error: any) {
    console.error(
      "Erreur lors de la récupération du solde du portefeuille :",
      error.message
    );
    return null;
  }
}
