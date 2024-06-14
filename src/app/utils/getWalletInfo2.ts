import Web3 from "web3";

//100000 per day
//total archive requests per day: up to 25000


const web3 = new Web3(
  `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`
);

export async function getWalletBalance(walletAddress: string): Promise<boolean> {
  try {
    const balance = await web3.eth.getTransactionCount(walletAddress);
    console.log(balance);
    // const balanceInEth = web3.utils.fromWei(balance, "ether");
    // console.log(balanceInEth);
    return true;
  } catch (error: any) {
    console.error(
      "Erreur lors de la récupération du solde du portefeuille :",
      error.message
    );
    return false;
  }
}
