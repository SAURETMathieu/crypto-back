import Moralis from 'moralis';
import {Decimal} from 'decimal.js';
import formatBlockchain from '../../utils/formatBlockchain';
//cost 100 per request => 400 per day max

export async function getWalletTokenBalancesWithPrice(walletAddress: string, blockchain: string) {
  try {
    if (!Moralis.Core.isStarted) {
      return null;
    }
    const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      "chain": formatBlockchain(blockchain),
      "excludeSpam": true,
      "excludeUnverifiedContracts": true,
      "address": walletAddress
    });

    const formattedData = (response.result).map((token:any) => ({
      name: token.name,
      symbol: token.symbol,
      logo: token.logo || "/empty-token.svg",
      decimals: token.decimals,
      usdPrice: token.usdPrice,
      usdPrice24h: token.usdPrice24hrPercentChange,
      portfolioPercentage: token.portfolioPercentage,
      balance: new Decimal(token.balanceFormatted)
    }));

    return formattedData;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// return example
// [
//   {
//     name: 'Wrapped Ether',
//     symbol: 'WETH',
//     logo: 'https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295',
//     decimals: 18,
//     usdPrice: 1,
//     usdPrice24hr: 0,
//     portfolioPercentage: 0,
//     balanceFormatted: '0.000000000000000000'
//   },
//   {
//     name: 'USD Coin',
//     symbol: 'USDC',
//     logo: 'https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389',
//     decimals: 6,
//     usdPrice: 1,
//     usdPrice24hr: 0,
//     portfolioPercentage: 0,
//     balanceFormatted: '0.000000'
//   }
// ]
