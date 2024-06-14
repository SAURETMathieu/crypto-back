import { getTokensBalance } from "../services/moralis/getWalletTokenBalancesWithPrice";
//import * as bitcoin from 'bitcoinjs-lib'; // Pour la validation Bitcoin

export default async function validateAddress(
  address: string,
  blockchain: string
) {
  switch (blockchain) {
    case "Ethereum":
    case "BSC": {
      return await getTokensBalance(address, blockchain);
    }
    case "BTC": {
      // try {
      //   bitcoin.address.toOutputScript(address);
      //   return true;
      // } catch (e) {
      //   return false;
      // }
      return true;
    }
    default:
      return false;
  }
}
